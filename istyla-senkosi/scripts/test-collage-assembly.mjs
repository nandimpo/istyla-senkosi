import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const source = fs.readFileSync(new URL("../src/hooks/useCollageAssembly.js", import.meta.url), "utf8").replace(/^import .*;\r?$/gm, "").replace("export default function", "function");
const state = [];
let effect, nextFrame, hookIndex = 0;
const context = vm.createContext({
  useState(initial) { const index = hookIndex++; state[index] = initial; return [initial, value => { state[index] = value; }]; },
  useEffect(callback) { effect = callback; },
  soundtrackBeats: async () => [2, 3.1, 4.2],
  performance: { now: () => 0 },
  requestAnimationFrame(callback) { nextFrame = callback; return 1; },
  cancelAnimationFrame() {},
});
vm.runInContext(source + "\nthis.run = useCollageAssembly;", context);
const audio = { currentTime:0, src:"song.mp3", paused:false, muted:false, volume:.7 };
context.run({ count:3, noteCount:1, audioRef:{ current:audio }, paused:false, reducedMotion:false });
const cleanup = effect();
await Promise.resolve();
const tick = (ms, seconds) => { audio.currentTime = seconds; nextFrame(ms); };
assert.deepEqual(state, [false,0,0,0,false], "Starts completely empty and locked");
tick(400,.4); assert.equal(state[2],1);
tick(1200,1.2); assert.equal(state[1],0);
tick(1300,1.3); assert.equal(state[1],1);
tick(2000,2); assert.equal(state[1],1,"No second piece before the minimum placement time");
tick(2400,2.4); assert.equal(state[1],1);
tick(3100,3.1); assert.equal(state[1],2,"Next piece follows a soundtrack accent");
tick(4200,4.2); assert.equal(state[1],3);
assert.equal(state[0],false,"Placing the last image does not unlock navigation");
tick(5400,5.4); assert.equal(state[4],true); assert.equal(state[3],1);
assert.equal(state[0],false,"Notes and doodles must finish animating first");
tick(7100,7.1); assert.equal(state[0],true,"Navigation unlocks after the final animation");
cleanup();
console.log("Collage assembly checks passed: empty entry, staged pieces, musical accents and final notes.");
