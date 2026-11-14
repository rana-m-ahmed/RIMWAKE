import { chromium } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';
const folder='docs/qa/v6/performance';await mkdir(folder,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});const reports=[];
for(const route of ['/','/explore'])for(let run=1;run<=3;run++){
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.setCacheDisabled',{cacheDisabled:true});
 await session.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:187500,uploadThroughput:93750});await session.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.addInitScript(()=>{window.__metrics={lcp:0,cls:0};new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__metrics.lcp=entry.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__metrics.cls+=entry.value}).observe({type:'layout-shift',buffered:true})});
 await page.goto(`http://127.0.0.1:4173${route}`);
 if(route==='/explore')await page.getByRole('slider',{name:'UTC sample',exact:true}).waitFor();else await page.getByRole('heading',{name:'Different sky.'}).waitFor();
 const readyMs=await page.evaluate(()=>performance.now());await page.waitForLoadState('networkidle');
 const metrics=await page.evaluate(()=>({...window.__metrics,resources:performance.getEntriesByType('resource').map(resource=>({name:resource.name.split('/').at(-1),transferSize:resource.transferSize,encodedBodySize:resource.encodedBodySize,duration:resource.duration}))}));
 let samplePaintMs=null;
 if(route==='/explore')samplePaintMs=await page.evaluate(async()=>{const slider=document.querySelector('input[type=range]');const start=performance.now();const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(slider,'300');slider.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));return performance.now()-start});
 const report={route,run,readyMs,samplePaintMs,...metrics,errors,optional3DRequested:metrics.resources.some(resource=>resource.name.includes('LunarContext')||resource.name.includes('lroc-color-2k'))};reports.push(report);console.log(JSON.stringify({route,run,readyMs,lcp:metrics.lcp,cls:metrics.cls,samplePaintMs}));await context.close();
}
await browser.close();await writeFile(`${folder}/cold-runs.json`,JSON.stringify({measured_at_utc:new Date().toISOString(),profile:{viewport:'390x844',latency_ms:150,download_mbps:1.5,upload_mbps:.75,cpu_slowdown:4,cold_cache:true},scope:'Six local production-preview lab runs. Not public-host measurements, field INP, or a guarantee of performance on other devices. Sample-paint probe covers script dispatch to two animation frames, not field interaction latency.',reports},null,2));
