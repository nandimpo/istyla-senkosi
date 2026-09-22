import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../src/utils/reverseScroll.js',import.meta.url),'utf8').replace('export function','function');
function setup(){
 let now=1000,back=0,stopped=0;
 const root={};const content={parentElement:root,overflowY:'auto',scrollHeight:900,clientHeight:400,scrollTop:0};
 const context=vm.createContext({performance:{now:()=>now},window:{getComputedStyle:el=>({overflowY:el.overflowY||'visible'})}});
 vm.runInContext(source,context);
 return {content,back:()=>back,stopped:()=>stopped,tick:()=>{now+=850},wheel(options={}){context.reverseScroll({target:content,currentTarget:root,deltaY:-100,deltaX:0,stopPropagation:()=>stopped++,...options},()=>back++);}};
}
test('upward wheel leaves an interactive page and suppresses momentum across remounts',()=>{const h=setup();h.wheel();h.wheel();assert.equal(h.back(),1);assert.equal(h.stopped(),2);h.tick();h.wheel();assert.equal(h.back(),2)});
test('long content scrolls to its top before navigating backward',()=>{const h=setup();h.content.scrollTop=50;h.wheel();assert.equal(h.back(),0);assert.equal(h.stopped(),1);h.content.scrollTop=0;h.wheel();assert.equal(h.back(),1)});
test('forward, horizontal and zoom gestures remain untouched',()=>{const h=setup();h.wheel({deltaY:100});h.wheel({deltaX:200});h.wheel({ctrlKey:true});assert.equal(h.back(),0);assert.equal(h.stopped(),0)});
