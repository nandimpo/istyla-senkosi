import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Run the hook with a deterministic media element and animation clock.
const source = readFileSync(new URL('../src/hooks/useSectionAudio.js', import.meta.url), 'utf8')
  .replace(/^import .*;\r?\n/gm, '').replace('export function', 'function');
function setup() {
  let now = 0, id = 0, cleanup;
  const frames = new Map();
  const navigation = { currentSection: 'swenka', volume: 0.8, navigationLocked: false };
  const audio = Object.assign(new EventTarget(), {
    dataset: {}, volume: 0, paused: true, ended: false, duration: 100, currentTime: 0,
    src: 'khawuleza.mp3', loop: false,
    play() { this.paused = false; return Promise.resolve(); },
    pause() { this.paused = true; },
    load() { this.currentTime = 0; this.ended = false; },
  });
  const context = vm.createContext({
    window: new EventTarget(), performance: { now: () => now },
    requestAnimationFrame: fn => { frames.set(++id, fn); return id; },
    cancelAnimationFrame: key => frames.delete(key),
    useNavigation: () => navigation,
    useEffect: fn => { cleanup = fn(); },
  });
  vm.runInContext(source, context);
  return {
    audio, navigation,
    mount(options = {}) { cleanup?.(); context.useSectionAudio({ id: 'swenka', audioRef: { current: audio }, soundOn: true, nextTrack: 'nongqongqo.mp3', ...options }); },
    tick(ms) { now += ms; const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now)); },
    end() { audio.ended = true; audio.paused = true; audio.dispatchEvent(new Event('ended')); },
  };
}

test('intro is audible but below chapter volume, preserving playback position', () => {
  const h = setup();
  h.mount({ volumeScale: 0.45 }); h.tick(2200);
  assert.ok(Math.abs(h.audio.volume - 0.36) < 1e-9);
  h.audio.currentTime = 25;
  h.mount(); h.tick(2200);
  assert.equal(h.audio.volume, 0.8);
  assert.equal(h.audio.currentTime, 25);
});

test('first song fades out once and the follow-up fades in without restarting on handoff', async () => {
  const h = setup(); h.mount(); h.tick(2200);
  assert.equal(h.audio.loop, false);
  h.audio.currentTime = 96;
  h.audio.dispatchEvent(new Event('timeupdate'));
  h.tick(2000); assert.equal(h.audio.volume, 0.4);
  h.tick(2000); assert.equal(h.audio.volume, 0);
  h.end(); await Promise.resolve();
  assert.equal(h.audio.src, 'nongqongqo.mp3');
  h.tick(2000); assert.equal(h.audio.volume, 0.4);
  h.tick(2000); assert.equal(h.audio.volume, 0.8);
  h.audio.currentTime = 15;
  h.mount();
  assert.equal(h.audio.currentTime, 15);
  assert.equal(h.audio.loop, true);
});

test('follow-up respects mute and video ducking', async () => {
  const h = setup(); h.mount({ soundOn: false, duckMusic: true });
  h.end(); await Promise.resolve(); h.tick(4000);
  assert.equal(h.audio.muted, true);
  assert.equal(h.audio.volume, 0.008);
});

test('leaving the chapter cancels the handoff and pauses the music', () => {
  const h = setup(); h.mount(); h.tick(2200);
  h.navigation.currentSection = 'pantsula'; h.mount();
  h.end(); h.tick(2200);
  assert.equal(h.audio.src, 'khawuleza.mp3');
  assert.equal(h.audio.paused, true);
  assert.equal(h.audio.volume, 0);
});
