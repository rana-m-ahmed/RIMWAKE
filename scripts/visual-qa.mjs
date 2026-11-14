import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const round=process.env.QA_ROUND||'round-1';
const dir=`docs/qa/v6/${round}`;await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
const results=[];
for(const [width,height] of [[1440,900],[768,1024],[390,844],[360,800],[320,800]]){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 for(const [route,name] of [['/','discover'],['/explore','explore'],['/method','method']]){
  await page.goto(`http://127.0.0.1:5173${route}`);await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
  if(route==='/explore')await page.getByRole('slider',{name:'UTC sample',exact:true}).waitFor();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  await page.screenshot({path:`${dir}/${name}-${width}.png`,fullPage:false,animations:'disabled'});
  if((width===1440||width===360)&&route!=='/method')await page.screenshot({path:`${dir}/${name}-${width}-full.png`,fullPage:true,animations:'disabled'});
  results.push({route,width,height,overflow,errors:[...errors]});
 }
 await context.close();
}
await browser.close();await writeFile(`${dir}/observations.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results));
if(results.some(result=>result.overflow||result.errors.length))process.exitCode=1;
