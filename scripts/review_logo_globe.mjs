import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const folder='docs/qa/atlas/logo-review',base='http://127.0.0.1:4175';
await mkdir(folder,{recursive:true});
const browser=await chromium.launch({channel:'chrome'}),results=[];
try{
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:width===1440?900:844}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const route of (width===320?['/explore']:['/','/explore','/field-guide','/sources'])){
   await page.goto(base+route);
   if(route==='/')await page.waitForFunction(()=>document.querySelector('main')?.dataset.hydrated==='true');
   if(route==='/explore')await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.flight==='settled');
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(400);
   const mark=page.locator('header img[src="/assets/brand/rimwake-mark.svg"]');
   if(!await mark.evaluate(img=>img.complete&&img.naturalWidth>0))throw Error('Header logo failed to load');
   const name=route==='/'?'landing':route.slice(1);
   await page.screenshot({path:`${folder}/${name}-${width}.png`});
   if(route==='/explore'){
    const atlas=page.getByRole('region',{name:'Lunar atlas',exact:true});
    await page.getByRole('button',{name:'Sky',exact:true}).click();
    await page.waitForFunction(()=>!document.querySelector('canvas'));
    await page.waitForTimeout(650);
    await atlas.screenshot({path:`${folder}/sky-${width}.png`});
    await page.getByRole('button',{name:'Globe',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.flight==='settled');
    await atlas.screenshot({path:`${folder}/globe-returned-${width}.png`});
   }
   results.push({route,width,errors:[...errors],horizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
  }
  await page.close();console.log('Reviewed',width);
 }
 const page=await browser.newPage({viewport:{width:1200,height:760}});
 await page.goto(pathToFileURL(resolve('docs/rimwake-brand.html')).href);await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:`${folder}/brand.png`,fullPage:true});
 await page.close();
}finally{await browser.close();}
await writeFile(`${folder}/visual-results.json`,JSON.stringify({reviewed_at_utc:new Date().toISOString(),results},null,2));
if(results.some(r=>r.errors.length||r.horizontalOverflow))process.exitCode=1;
