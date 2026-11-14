import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const folder='docs/qa/cinema/clarity-final/details';
await mkdir(folder,{recursive:true});
const browser=await chromium.launch({channel:'chrome'}),reports=[];
for(const width of [1440,390,320]){
 const page=await browser.newPage({viewport:{width,height:width===1440?900:844}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.RIMWAKE_BASE_URL||'http://127.0.0.1:4175')+'/explore');
 await page.getByRole('slider').waitFor();await page.waitForTimeout(1800);await page.waitForLoadState('networkidle');
 await page.getByRole('button',{name:/Change UTC/}).click();
 const dialog=page.getByRole('dialog',{name:'Choose UTC time'});
 await dialog.getByLabel('UTC date and time',{exact:true}).fill('2026-11-20T06:01');
 await dialog.getByRole('button',{name:'Show this observation'}).click();
 await page.screenshot({path:`${folder}/utc-nearest-${width}.png`});await page.keyboard.press('Escape');
 await page.getByText('How to read these skies',{exact:true}).click();
 await page.getByText('How to read these skies',{exact:true}).scrollIntoViewIfNeeded();
 await page.screenshot({path:`${folder}/reading-guide-${width}.png`});
 await page.getByRole('button',{name:'Find a moment',exact:true}).click();
 const finder=page.getByRole('region',{name:'Find a moment'});
 await finder.getByRole('combobox',{name:'Observation condition'}).selectOption('joint');
 await finder.locator('button[aria-current]').first().waitFor({state:'attached',timeout:1000}).catch(()=>{});
 await finder.getByRole('button',{name:/Through/}).first().click();
 await finder.scrollIntoViewIfNeeded();await page.screenshot({path:`${folder}/selected-result-${width}.png`});
 reports.push({width,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
 await page.close();
}
await browser.close();await writeFile(folder+'/visual-results.json',JSON.stringify(reports,null,2));
console.log(JSON.stringify(reports));if(reports.some(r=>r.errors.length||r.overflow))process.exitCode=1;
