import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/hooks/useFrameGesture.js', import.meta.url), 'utf8')
  .replace(/^import .*;\r?\n/gm, '').replace(/export function/g, 'function');
function gesture(options = {}) {
  const state = [];
  let advances = 0, retreats = 0, captures = 0;
  const context = vm.createContext({
    useRef: value => ({ current: value }),
    useState: initial => { const index = state.push(initial) - 1; return [initial, value => { state[index] = value; }]; },
  });
  vm.runInContext(source, context);
  const { handlers } = context.useDragGesture({ onAdvance: () => advances++, onRetreat: () => retreats++, ...options });
  const event = (y, interactive = false) => ({ clientY: y, button: 0, pointerId: 1, isPrimary: true, target: { closest: () => interactive }, currentTarget: { setPointerCapture: () => captures++ } });
  return { handlers, event, state, counts: () => [advances, retreats, captures] };
}

test('upward drag previews movement, advances once, and resets on release', () => {
  const h = gesture();
  h.handlers.onPointerDown(h.event(300));
  h.handlers.onPointerMove(h.event(210));
  assert.deepEqual(h.state, [90, true]);
  h.handlers.onPointerUp(h.event(210));
  h.handlers.onLostPointerCapture();
  assert.deepEqual(h.state, [0, false]);
  assert.deepEqual(h.counts(), [1, 0, 1]);
});

test('short and cancelled drags settle without changing the page', () => {
  const h = gesture();
  h.handlers.onPointerDown(h.event(300)); h.handlers.onPointerUp(h.event(280));
  h.handlers.onPointerDown(h.event(300)); h.handlers.onPointerMove(h.event(100));
  assert.equal(h.state[0], 160);
  h.handlers.onPointerCancel(); h.handlers.onPointerUp(h.event(100));
  assert.deepEqual(h.state, [0, false]);
  assert.deepEqual(h.counts(), [0, 0, 2]);
});

test('reading locks, transition locks and controls do not capture gallery drags', () => {
  for (const options of [{ enabled: false }, { canStart: () => false }]) {
    const h = gesture(options);
    h.handlers.onPointerDown(h.event(300)); h.handlers.onPointerMove(h.event(100)); h.handlers.onPointerUp(h.event(100));
    assert.deepEqual(h.counts(), [0, 0, 0]);
    assert.deepEqual(h.state, [0, false]);
  }
  const h = gesture(); h.handlers.onPointerDown(h.event(300, true));
  assert.deepEqual(h.counts(), [0, 0, 0]);
});

test('dragging down retreats exactly once', () => {
  const h = gesture(); h.handlers.onPointerDown(h.event(200)); h.handlers.onPointerUp(h.event(280));
  assert.deepEqual(h.counts(), [0, 1, 1]);
});
