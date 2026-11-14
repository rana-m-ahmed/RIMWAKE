import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
const folder='docs/qa/cinema/performance';await mkdir(folder,{recursive:true});
const browser=await chromium.launch({channel:'chrome'}),reports=[];
for(const motion of ['no-preference','reduce'])for(const route of ['/','/explore'])for(let run=1;run<=2;run++){
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:motion});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:187500,uploadThroughput:93750});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.addInitScript(()=>{window.__metrics={lcp:0,cls:0};new PerformanceObserver(l=>{for(const e of l.getEntries())window.__metrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__metrics.cls+=e.value}).observe({type:'layout-shift',buffered:true})});
 await page.goto('http://127.0.0.1:4173'+route);if(route==='/explore')await page.getByRole('slider',{name:'UTC sample'}).waitFor();else await page.getByRole('heading',{level:1}).waitFor();const readyMs=await page.evaluate(()=>performance.now());await page.waitForLoadState('networkidle');
 const metrics=await page.evaluate(()=>({...window.__metrics,resources:performance.getEntriesByType('resource').map(r=>({name:r.name.split('/').at(-1),transferSize:r.transferSize,encodedBodySize:r.encodedBodySize,duration:r.duration}))}));
 let samplePaintMs=null;if(route==='/explore')samplePaintMs=await page.evaluate(async()=>{const slider=document.querySelector('input[type=range]'),start=performance.now();Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(slider,'300');slider.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return performance.now()-start});
 reports.push({motion,route,run,readyMs,...metrics,samplePaintMs,errors});console.log(JSON.stringify({motion,route,run,readyMs,lcp:metrics.lcp,cls:metrics.cls,samplePaintMs}));await context.close();
}
await browser.close();const assets=readdirSync('dist/assets').filter(n=>n.endsWith('.js')).map(name=>({name,bytes:statSync('dist/assets/'+name).size,gzipBytes:gzipSync(readFileSync('dist/assets/'+name)).length}));
await writeFile(folder+'/cold-runs.json',JSON.stringify({measured_at_utc:new Date().toISOString(),profile:{viewport:'390x844',latency_ms:150,download_mbps:1.5,cpu_slowdown:4,cold_cache:true},scope:'Eight local static production-preview lab runs; preview serves uncompressed files. Gzip sizes reported separately. Not deployed CDN results or field INP. Script-to-two-frame sample paint is a diagnostic, not field interaction latency.',assets,reports},null,2));if(reports.some(r=>r.errors.length))process.exitCode=1;
