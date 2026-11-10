import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/hooks/useContinuousZoom.js', import.meta.url), 'utf8')
  .replace(/^import .*;\r?\n/gm, '').replace('export function', 'function');

function setup(reducedMotion = false) {
  const document = Object.assign(new EventTarget(), { hidden: false });
  const preference = Object.assign(new EventTarget(), { matches: false });
  const calls = [];
  let cleanup;
  const animation = { play: () => calls.push('play'), pause: () => calls.push('pause'), cancel: () => calls.push('cancel') };
  const media = { animate: (frames, options) => { calls.push({ frames, options }); return animation; } };
  const context = vm.createContext({ document, window: { matchMedia: () => preference }, useNavigation: () => ({ reducedMotion }), useEffect: (effect) => { cleanup = effect(); } });
  vm.runInContext(source, context);
  context.useContinuousZoom({ current: media }, true, 'photo');
  return { calls, document, preference, cleanup: () => cleanup?.() };
}

test('zoom is bounded and browser-managed, pauses in the background and cleans up', () => {
  const h = setup();
  assert.equal(h.calls[0].frames[1].transform, 'scale(1.18)');
  assert.equal(h.calls[0].options.direction, 'alternate');
  h.document.hidden = true;
  h.document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(h.calls.at(-1), 'pause');
  h.document.hidden = false;
  h.document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(h.calls.at(-1), 'play');
  h.cleanup();
  assert.equal(h.calls.at(-1), 'cancel');
  const count = h.calls.length;
  h.document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(h.calls.length, count);
});

test('zoom honors both saved and live system reduced-motion preferences', () => {
  assert.equal(setup(true).calls.length, 0);
  const h = setup();
  h.preference.matches = true;
  h.preference.dispatchEvent(new Event('change'));
  assert.equal(h.calls.at(-1), 'cancel');
});
