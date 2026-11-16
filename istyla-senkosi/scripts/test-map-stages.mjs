import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { advanceProgress, clampProgress, STOPS } from "../src/components/games/journeyMapData.js";

const source = fs.readFileSync(new URL("../src/components/games/JourneyMapGame.jsx", import.meta.url), "utf8");
const handlers = source.slice(source.indexOf("  const move = (requested"), source.indexOf("  const pointerDown ="));
const state = {
  progress: 0, revealed: -1, entering: false, cardOpen: true,
  progressRef: { current: 0 }, textReadyRef: { current: false }, drag: { current: null },
  STOPS, advanceProgress, clampProgress,
  setProgress(value) { state.progress = value; },
  setRevealedStop(value) { state.revealed = typeof value === "function" ? value(state.revealed) : value; },
  setTextReady(value) { state.textReadyRef.current = value; },
  setClosedStop() {},
};
Object.defineProperties(state, {
  started: { get: () => state.revealed >= 0 },
  activeIndex: { get: () => state.progress >= 1 ? 2 : state.progress >= .5 ? 1 : 0 },
});
const context = vm.createContext(state);
vm.runInContext(handlers, context);
const select = (index) => vm.runInContext(`selectStop(${index})`, context);
select(2);
assert.equal(state.revealed, -1, "Soweto cannot open before Home");
select(0);
assert.equal(state.revealed, 0, "Home opens only its group");
select(1);
assert.equal(state.revealed, 0, "Memory waits for Home reading");
state.textReadyRef.current = true;
select(2);
assert.equal(state.revealed, 0, "Soweto cannot skip Memory");
select(1);
assert.equal(state.progress, .5);
assert.equal(state.revealed, 1);
assert.equal(state.textReadyRef.current, false);
state.textReadyRef.current = true;
select(2);
assert.equal(state.progress, 1);
assert.equal(state.revealed, 2);
state.textReadyRef.current = true;
select(0);
assert.equal(state.revealed, 2, "Earlier map pieces remain after revisiting Home");
console.log("Map stages passed: Home, Memory, Soweto, reading gates and retained pieces.");
