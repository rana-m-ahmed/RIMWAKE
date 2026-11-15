import http from 'node:http';
import {chromium} from '@playwright/test';
import {mkdir,writeFile,readFile,readdir} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
const folder=process.env.ATLAS_PERF_DIR||'docs/qa/atlas/performance';await mkdir(folder,{recursive:true});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let nextByte=0,transfers=[];
// A real wire proxy also throttles dedicated-worker fetches. Page-only CDP network
// emulation would not establish that the scientific bundles share the same budget.
const server=http.createServer((req,res)=>{
 const upstream=http.request({hostname:'127.0.0.1',port:4175,path:req.url,method:req.method,headers:{...req.headers,host:'127.0.0.1:4175'}},response=>{
  const parts=[];response.on('data',chunk=>parts.push(chunk));response.on('end',async()=>{
   const bytes=Buffer.concat(parts);await sleep(150);if(res.destroyed)return;
   res.writeHead(response.statusCode||500,{...response.headers,'cache-control':'no-store'});
   for(let offset=0;offset<bytes.length;offset+=8192){if(res.destroyed)break;const chunk=bytes.subarray(offset,offset+8192);nextByte=Math.max(performance.now(),nextByte)+chunk.length/187500*1000;await sleep(Math.max(0,nextByte-performance.now()));if(!res.destroyed)res.write(chunk);}
   if(!res.destroyed){res.end();transfers.push({url:req.url,encodedBytes:bytes.length,encoding:response.headers['content-encoding']||'identity'});}
  });
 });upstream.on('error',()=>{if(!res.destroyed){res.writeHead(502);res.end('Local preview unavailable');}});req.on('aborted',()=>upstream.destroy());upstream.end();
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'chrome'}),reports=[];
try{
for(const motion of ['no-preference','reduce'])for(const route of ['/','/explore'])for(let run=1;run<=3;run++){
 nextByte=0;transfers=[];const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:motion}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const pending=new Set();let lastNetworkChange=Date.now();page.on('request',r=>{pending.add(r);lastNetworkChange=Date.now();});for(const event of ['requestfinished','requestfailed'])page.on(event,r=>{pending.delete(r);lastNetworkChange=Date.now();});
 const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.addInitScript(()=>{window.__metrics={lcp:0,cls:0,lcpElement:null,shifts:[]};new PerformanceObserver(list=>{for(const entry of list.getEntries()){window.__metrics.lcp=entry.startTime;window.__metrics.lcpElement={tag:entry.element?.tagName,url:entry.url,text:entry.element?.textContent?.slice(0,100)};}}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput){window.__metrics.cls+=entry.value;window.__metrics.shifts.push({value:entry.value,time:entry.startTime,sources:entry.sources.map(s=>({tag:s.node?.tagName,class:s.node?.className,before:s.previousRect.toJSON(),after:s.currentRect.toJSON()}))});}}).observe({type:'layout-shift',buffered:true});});
 await page.goto(base+route);if(route==='/explore')await page.getByTestId('atlas-utc').filter({visible:true}).waitFor();else await page.getByRole('heading',{level:1}).waitFor();if(route==='/explore')await page.waitForFunction(()=>document.querySelector('[data-testid="atlas-utc"]')?.getAttribute('data-utc')==='2026-11-14T00:00:00Z');
 if(route==='/')await page.waitForFunction(()=>document.querySelector('main')?.getAttribute('data-hydrated')==='true');
 const readyMs=await page.evaluate(()=>performance.now());
 // The GPU capability probe starts 1.5s after hydration. Observe that later
 // enhancement too, rather than ending the byte count at the first quiet gap.
 await page.waitForTimeout(2200);
 if(motion==='no-preference'){
  if(route==='/')await page.locator('[class*="posterGone"]').waitFor({state:'attached',timeout:30000});
  else await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.flight==='settled');
 }
 const quietDeadline=Date.now()+30000;while(pending.size||Date.now()-lastNetworkChange<800){if(Date.now()>quietDeadline)throw Error('Enhancement network did not settle');await sleep(100);}
 await page.waitForTimeout(400);
 const metrics=await page.evaluate(()=>window.__metrics);let sampleDiagnosticMs=null;
 if(route==='/explore'){
  await page.evaluate(()=>{window.__sampleStart=performance.now();const input=document.querySelector('input[aria-label="Inspection hour"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'100');input.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.waitForFunction(()=>document.querySelector('[data-testid="atlas-utc"]')?.getAttribute('data-utc')==='2026-11-18T04:00:00Z');
  sampleDiagnosticMs=await page.evaluate(async()=>{await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));return performance.now()-window.__sampleStart;});
 }
 const record={motion,route,run,readyMs,...metrics,sampleDiagnosticMs,enhancementObserved:motion==='no-preference',transfers:[...transfers],errors};reports.push(record);console.log(JSON.stringify({motion,route,run,readyMs,lcp:metrics.lcp,cls:metrics.cls,sampleDiagnosticMs}));await context.close();
}
}finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
const assets=[];for(const name of (await readdir('dist/assets')).filter(name=>name.endsWith('.js'))){const bytes=await readFile('dist/assets/'+name);assets.push({name,bytes:bytes.length,gzipBytes:gzipSync(bytes).length});}
await writeFile(folder+'/cold-runs.json',JSON.stringify({measured_at_utc:new Date().toISOString(),profile:{viewport:'390x844',cold_context:true,latency_ms:150,shared_download_mbps:1.5,main_thread_cpu_slowdown:4,worker_cpu_slowdown:'not emulated'},scope:'Twelve local lab runs through a shared-bandwidth HTTP wire proxy. Every resource, including worker bundles and worker scientific-data fetches, shares 1.5Mbps. Actual upstream encoded bytes and Content-Encoding are retained. CPU emulation applies to the page main thread, not dedicated-worker execution. Not deployed measurements, field INP, or a physical low-end-device guarantee.',assets,reports},null,2));if(reports.some(r=>r.errors.length))process.exitCode=1;
