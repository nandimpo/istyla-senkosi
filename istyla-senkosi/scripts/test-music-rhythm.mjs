import assert from "node:assert/strict";
import { detectBeatTimes } from "../src/utils/musicRhythm.js";
const sampleRate = 1000;
const samples = new Float32Array(4000);
const accents = [.5, 1, 1.5, 2, 2.5, 3];
for (const time of accents) {
  for (let i = time * sampleRate; i < time * sampleRate + 60; i++) samples[i] = .7;
}
const detected = detectBeatTimes(samples, sampleRate);
assert.equal(detected.length, accents.length);
accents.forEach((time, i) => assert.ok(Math.abs(time - detected[i]) <= .02));
assert.deepEqual(detectBeatTimes(new Float32Array(4000), sampleRate), []);
console.log("Music rhythm checks passed: soundtrack accents and silence.");
