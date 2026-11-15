import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.RIMWAKE_BASE_URL||'http://127.0.0.1:4175',round=process.env.ATLAS_QA_ROUND||'round-2',folder=`docs/qa/atlas/${round}`;await mkdir(folder,{recursive:true});
const browser=await chromium.launch({channel:'chrome'}),reports=[];
try{for(const [width,height] of [[1440,900],[1024,900],[768,1024],[390,844],[360,800],[320,800]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [route,label] of [['/','landing'],['/explore','atlas'],['/field-guide','guide'],['/sources','sources']]){
  await page.goto(base+route);if(route==='/explore')await page.waitForFunction(()=>document.querySelector('[data-testid="atlas-utc"]')?.getAttribute('data-utc')==='2026-11-14T00:00:00Z');await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1700);if(route==='/explore'&&await page.locator('canvas').count())await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.flight==='settled');await page.screenshot({path:`${folder}/${label}-${width}.png`});reports.push({route,width,errors:[...errors],overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),mainTextLength:(await page.locator('main').innerText()).length});
  if(route==='/explore'){
   if(width===1440){await page.getByRole('region',{name:'Lunar atlas',exact:true}).screenshot({path:`${folder}/atlas-region-1440.png`});await page.getByRole('button',{name:'Share & export'}).click();for(const [button,file] of [['Download comparison JSON','default-comparison.json'],['Download source samples CSV','default-samples.csv']]){const event=page.waitForEvent('download');await page.getByRole('button',{name:button,exact:true}).click();await (await event).saveAs('docs/qa/atlas/final/'+file);}await page.keyboard.press('Escape');}
   await page.getByRole('button',{name:'Apply 72-hour delay'}).click();await page.getByTestId('atlas-utc').filter({visible:true}).waitFor();await page.waitForTimeout(250);await page.getByRole('region',{name:'Original and delayed window comparison'}).scrollIntoViewIfNeeded();await page.screenshot({path:`${folder}/comparison-${width}.png`});
   await page.getByRole('region',{name:'Mission timeline'}).scrollIntoViewIfNeeded();await page.screenshot({path:`${folder}/timeline-${width}.png`});
   await page.getByRole('button',{name:'Evidence & limits'}).click();await page.screenshot({path:`${folder}/evidence-${width}.png`});await page.keyboard.press('Escape');
   await page.getByRole('button',{name:'Share & export'}).click();await page.screenshot({path:`${folder}/export-${width}.png`});await page.keyboard.press('Escape');
   await page.getByRole('combobox',{name:'Viewpoint A',exact:true}).selectOption('ce4');await page.waitForTimeout(1200);await page.getByRole('region',{name:'Lunar atlas',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:`${folder}/far-side-${width}.png`});
   await page.getByRole('button',{name:'LROC site image',exact:true}).click();await page.screenshot({path:`${folder}/site-image-${width}.png`});
  }
  if(route==='/'&&(width===1440||width===390)){for(const i of [1,2,3,4,5]){await page.locator(`#story-${i}`).scrollIntoViewIfNeeded();if(i>=3)await page.locator('#story-3').getByText('69.2%',{exact:true}).waitFor({state:'attached'});await page.waitForTimeout(300);await page.screenshot({path:`${folder}/story-${i+1}-${width}.png`});}await page.getByRole('button',{name:'Apply the 72-hour delay'}).click();await page.locator('#story-4').scrollIntoViewIfNeeded();await page.waitForTimeout(650);await page.screenshot({path:`${folder}/story-delay-${width}.png`});}
 }
 await context.close();console.log('Captured',width);
}}finally{await browser.close();}
await writeFile(`${folder}/visual-results.json`,JSON.stringify(reports,null,2));console.log(JSON.stringify(reports));if(reports.some(r=>r.overflow||r.errors.length||r.mainTextLength<50))process.exitCode=1;
