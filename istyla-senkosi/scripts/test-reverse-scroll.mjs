import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
let now = 0;
let retreats = 0;
const root = {};
const target = { parentElement:root, closest:() => null, scrollHeight:100, clientHeight:100, scrollTop:0 };
const context = { window:{ getComputedStyle:() => ({ overflowY:"auto" }), innerHeight:800 }, performance:{ now:() => now } };
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL("../src/utils/reverseScroll.js", import.meta.url),"utf8").replace("export function", "function") + "\nthis.back = reverseScroll;", context);
function wheel(deltaY, extra={}) { context.back({ target,currentTarget:root,deltaY,deltaX:0,stopPropagation() {},...extra }, () => retreats++); }
for (let i=0;i<7;i++) { now+=20; wheel(-2); }
assert.equal(retreats,1,"small trackpad deltas should accumulate");
now+=20;wheel(-100);assert.equal(retreats,1,"momentum should not immediately skip another page");
now+=1000;wheel(-40);assert.equal(retreats,2,"a new upward gesture goes back again");
now+=1000;wheel(80);assert.equal(retreats,2,"forward navigation remains separate");
wheel(-80,{ctrlKey:true});wheel(-80,{deltaX:100});assert.equal(retreats,2,"zoom and horizontal gestures are ignored");
target.scrollHeight=400;target.scrollTop=40;wheel(-80);assert.equal(retreats,2,"reading panels scroll to their top first");
target.scrollTop=0;wheel(-80);assert.equal(retreats,3);
target.closest=() => ({});now+=1000;wheel(-80);assert.equal(retreats,3,"modal scrolling stays local");
console.log("Reverse scroll checks passed.");
