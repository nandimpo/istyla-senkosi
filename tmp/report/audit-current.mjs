import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/nandi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve('istyla-senkosi/dist');
const out=path.resolve('tmp/report/current-audit'); fs.mkdirSync(out,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.mp4':'video/mp4','.mp3':'audio/mpeg','.m4a':'audio/mp4'};
const server=http.createServer((req,res)=>{const rel=decodeURIComponent(req.url.split('?')[0]).replace(/^\/istyla-senkosi\//,'');const f=path.resolve(root,rel||'index.html');if(!f.startsWith(root+path.sep)&&f!==root){res.writeHead(403).end();return;}fs.readFile(f,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');res.end(data);});});
await new Promise(r=>server.listen(5189,'127.0.0.1',r));
let browser;
const results=[];
try{
browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',args:['--no-sandbox']});
async function open(section,pageIndex,width=1440){
 const context=await browser.newContext({viewport:{width,height:width===1440?900:844},reducedMotion:'reduce'});
 await context.addInitScript(({section,pageIndex})=>{sessionStorage.setItem('istyla:section',JSON.stringify(section));sessionStorage.setItem(`istyla:${section}:page`,JSON.stringify(pageIndex));localStorage.setItem('istyla-preferences',JSON.stringify({soundOn:false,reducedMotion:true}));},{section,pageIndex});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5189/istyla-senkosi/',{waitUntil:'load'});await page.waitForTimeout(800);
 return {page,context,errors};
}
for(const [section,index] of []){
 for(const width of [1440,390]){const {page,context,errors}=await open(section,index,width);await page.screenshot({path:path.join(out,`${section}-${width}.png`)});results.push({section,index,width,errors,overflow:await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth})),heading:await page.locator('h1,h2').allTextContents()});await context.close();}
}
{
const {page,context}=await open('swenka',1);
await page.locator('.wardrobe button').first().click();await page.getByRole('button',{name:'Drop SHOES here',exact:true}).click();
results.push({check:'wrong wardrobe target',hatRevealed:await page.getByRole('button',{name:'HAT revealed',exact:true}).count()});
await context.close();
}
{
const {page,context}=await open('swenka',1);
await page.locator('.wardrobe button').first().click();await page.getByRole('button',{name:'Drop HAT here',exact:true}).focus();await page.keyboard.press('Enter');
results.push({check:'wardrobe keyboard placement',hatRevealed:await page.getByRole('button',{name:'HAT revealed',exact:true}).count()});await context.close();
}
{
const {page,context}=await open('introduction',5);await page.locator('.journey-viewport').hover();await page.mouse.wheel(0,-100);await page.waitForTimeout(400);
results.push({check:'map upward wheel',page:await page.evaluate(()=>sessionStorage.getItem('istyla:introduction:page')),mapVisible:await page.locator('.journey-viewport').count()});await context.close();
}
{
const {page,context}=await open('reflection',5);await page.getByRole('button',{name:'CREDITS'}).click();
results.push({check:'credits destination',section:await page.evaluate(()=>sessionStorage.getItem('istyla:section'))});await context.close();
}
{
const {page,context}=await open('about',0);const hidden=page.locator('.chapters-drawer .chapter-link').first();await hidden.focus();results.push({check:'closed chapter drawer focus',focused:await hidden.evaluate(el=>document.activeElement===el)});await context.close();
}
}catch(e){results.push({fatal:e.stack});process.exitCode=1;}finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));if(browser)await browser.close();server.close();}
