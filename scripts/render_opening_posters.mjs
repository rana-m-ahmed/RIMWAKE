import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});await mkdir('deliverables/opening-frames',{recursive:true});
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height}});await page.goto((process.env.RIMWAKE_BASE_URL||'http://127.0.0.1:5173')+'/');await page.locator('canvas').waitFor();await page.waitForLoadState('networkidle');await page.waitForTimeout(1600);
 await page.waitForFunction(()=>{const poster=document.querySelector('[class*=poster]');return poster&&Number(getComputedStyle(poster).opacity)===0});
 await page.addStyleTag({content:'main>nav,main>section,header,footer,[class*=poster],[class*=vignette],[class*=artCredit]{visibility:hidden!important}[class*=stage]{position:fixed!important;inset:0!important;height:100vh!important}'});await page.waitForTimeout(200);
 await page.screenshot({path:`deliverables/opening-frames/${name}.png`});await page.close();
}await browser.close();console.log('Captured the initialized NASA visual scene in its opening camera pose. No scientific observations are rendered into these posters.');
