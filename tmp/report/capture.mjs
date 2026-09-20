import { createRequire } from 'module';
const require=createRequire(import.meta.url);
const { chromium }=require('C:/Users/nandi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',args:['--no-sandbox']});
const base='http://127.0.0.1:5173/istyla-senkosi/';
for(const name of ['introduction','swenka','pantsula','skhothane','reflection']){
  const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
  await context.addInitScript((section)=>{
    sessionStorage.setItem('istyla:section',JSON.stringify(section));
    sessionStorage.setItem(`istyla:${section}:page`,'0');
    if(['swenka','pantsula'].includes(section))sessionStorage.setItem(`istyla:${section}:opened`,'true');
    localStorage.setItem('istyla-preferences',JSON.stringify({soundOn:false,reducedMotion:true}));
  },name);
  const page=await context.newPage();
  await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForTimeout(2200);
  await page.screenshot({path:`tmp/report/current-${name}.png`,fullPage:false});
  console.log(name,await page.title());
  await context.close();
}
await browser.close();
