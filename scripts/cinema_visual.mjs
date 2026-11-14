import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const round=process.env.QA_ROUND||'round-1',dir=`docs/qa/cinema/${round}`;await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});const results=[];
for(const [width,height] of [[1440,900],[768,1024],[390,844],[360,800],[320,800]]){
 const context=await browser.newContext({viewport:{width,height}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [route,label] of [['/','experience'],['/explore','explorer'],['/field-guide','guide'],['/sources','sources']]){
  await page.goto('http://127.0.0.1:5173'+route);await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);if(route==='/explore')await page.getByRole('slider',{name:'UTC sample'}).waitFor();
  await page.screenshot({path:`${dir}/${label}-${width}.png`,fullPage:false});
  results.push({route,width,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errors:[...errors]});
  if(route==='/'&&(width===1440||width===360)){
   for(const chapter of [1,2,3,4,5]){await page.locator(`#chapter-${chapter}`).evaluate(el=>el.scrollIntoView({behavior:'instant'}));await page.waitForTimeout(180);await page.screenshot({path:`${dir}/chapter-${chapter+1}-${width}.png`,fullPage:false})}
  }
 }
 await context.close();
}
await browser.close();await writeFile(`${dir}/visual-results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));if(results.some(r=>r.overflow||r.errors.length))process.exitCode=1;
