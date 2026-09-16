import test from 'node:test';
import assert from 'node:assert/strict';
import { ROUTE, STOPS, routePoint, travelledPath, advanceProgress } from '../src/components/games/journeyMapData.js';

test('route stays anchored to the map endpoints and clamps out of range input', () => {
  assert.deepEqual(routePoint(0), ROUTE[0]);
  assert.deepEqual(routePoint(1), ROUTE[3]);
  assert.deepEqual(routePoint(-10), ROUTE[0]);
  assert.deepEqual(routePoint(10), ROUTE[3]);
});
test('journey moves continuously south along the fixed curve', () => {
  let previous = routePoint(0);
  for (let i = 1; i <= 100; i++) {
    const point = routePoint(i / 100);
    assert.ok(point.y > previous.y);
    assert.ok(point.x >= 875 && point.x <= 904);
    assert.ok(Math.hypot(point.x - previous.x, point.y - previous.y) < 1);
    previous = point;
  }
});
test('fast dragging pauses at the middle story and requires a new advance for arrival', () => {
  assert.equal(advanceProgress(0, 3), STOPS[1].progress);
  assert.equal(advanceProgress(0.49, 1), STOPS[1].progress);
  assert.equal(advanceProgress(0.5, 3), 1);
  assert.equal(advanceProgress(1, -2), 0);
  assert.equal(advanceProgress(0.2, 0.3), 0.3);
});
test('illuminated route ends exactly at the marker at each story stop', () => {
  for (const stop of STOPS) {
    const point = routePoint(stop.progress);
    const path = travelledPath(stop.progress);
    assert.ok(path.startsWith(`M${ROUTE[0].x} ${ROUTE[0].y}`));
    assert.ok(path.endsWith(`L${point.x} ${point.y}`));
    assert.ok(!path.includes('NaN'));
  }
});
