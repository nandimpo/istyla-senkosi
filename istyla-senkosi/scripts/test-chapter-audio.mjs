import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const hook = fs.readFileSync(new URL("../src/hooks/useSectionAudio.js", import.meta.url), "utf8").replace(/^import .*;\r?$/gm, "").replace("export function useSectionAudio", "function useSectionAudio");
const helper = fs.readFileSync(new URL("../src/hooks/chapterAudioQueue.js", import.meta.url), "utf8").match(/export function nextQueueIndex[\s\S]*$/)[0].replace("export function", "function");
let cleanup;
let nav = { currentSection:"swenka", volume:.7, navigationLocked:false };
const browser = new EventTarget();
const sandbox = { useState:(initial) => [initial, () => {}], useRef:(initial) => ({ current:initial }), CHAPTER_FOLLOWUPS:{ swenka:["chapter-a.mp3", "chapter-b.mp3"] }, useEffect:(effect) => { cleanup = effect(); }, useNavigation:() => nav, window:browser, performance, requestAnimationFrame:() => 1, cancelAnimationFrame:() => {} };
vm.createContext(sandbox);
vm.runInContext(helper + "\n" + hook + "\nthis.runAudio = useSectionAudio;", sandbox);
class Audio extends EventTarget {
  constructor() { super(); this.src="primary.mp3"; this.dataset={}; this.loop=true; this.volume=.7; this.paused=false; this.ended=false; this.currentTime=0; this.duration=60; }
  load() { this.ended=false; this.paused=true; this.currentTime=0; }
  play() { this.paused=false; return Promise.resolve(); }
  pause() { this.paused=true; }
  end() { this.ended=true; this.currentTime=this.duration; this.dispatchEvent(new Event("ended")); }
}
const audio = new Audio();
const args = { id:"swenka", audioRef:{ current:audio }, soundOn:true };
sandbox.runAudio(args);
assert.equal(audio.src,"primary.mp3", "opening song stays until it ends");
assert.equal(audio.loop,false, "opening track cannot loop past its end");
audio.end();
assert.equal(audio.src,"chapter-a.mp3");
await Promise.resolve();
cleanup();
assert.equal(audio.paused,false,"level changes must not pause playback before the fade");
sandbox.runAudio({ ...args, soundOn:false, duckMusic:true });
assert.equal(audio.src,"chapter-a.mp3", "sound/volume changes preserve playlist position");
assert.equal(audio.muted,true);
assert.equal(audio.paused,true,"video playback must actually pause the soundtrack");
const heldSource = audio.src;
audio.currentTime = 12;
browser.dispatchEvent(new Event("pointerdown"));
assert.equal(audio.paused,true,"clicks cannot restart soundtrack during video");
audio.end();
assert.equal(audio.src,heldSource,"playlist cannot advance during video");
audio.ended = false;
audio.currentTime = 12;
cleanup?.();
sandbox.runAudio(args);
browser.dispatchEvent(new Event("istyla:video-audio-end"));
assert.equal(audio.src,heldSource,"same song resumes after video");
assert.equal(audio.currentTime,12,"same playback position resumes");
assert.equal(audio.paused,false);
audio.end();
assert.equal(audio.src,"chapter-b.mp3");
audio.end();
assert.equal(audio.src,"chapter-a.mp3", "chapter follow-ups cycle after the queue finishes");
cleanup();
nav = { ...nav, currentSection:"pantsula" };
sandbox.runAudio(args);
audio.end();
assert.equal(audio.src,"chapter-a.mp3", "inactive chapter must not advance its queue");
cleanup();
console.log("Chapter audio queue checks passed.");
