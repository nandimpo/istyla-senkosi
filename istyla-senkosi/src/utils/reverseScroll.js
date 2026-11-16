let lastRetreat = -Infinity;
let lastWheel = -Infinity;
let upwardDistance = 0;
let gestureCounted = false;
let firstScrollAt = -Infinity;
const GESTURE_GAP_MS = 180;
const DOUBLE_SCROLL_MS = 2500;

// Capture before activities consume the wheel, including fine trackpad deltas.
export function reverseScroll(event, retreat) {
  if (event.ctrlKey || Math.abs(event.deltaX || 0) > Math.abs(event.deltaY)) return;
  if (event.deltaY >= 0) { upwardDistance = 0; firstScrollAt = -Infinity; gestureCounted = false; return; }
  const target = event.target;
  // Modal albums/settings retain their own scrolling and close controls.
  if (target.closest?.("dialog[open]:not(.soweto-arrival)")) return;
  event.stopPropagation();
  const now = performance.now();
  if (now - lastWheel > GESTURE_GAP_MS) { upwardDistance = 0; gestureCounted = false; }
  lastWheel = now;
  if (now - lastRetreat < 800) { upwardDistance = 0; return; }
  // A trackpad's momentum events belong to one scroll, not a second request.
  if (gestureCounted) return;
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  upwardDistance += -event.deltaY * unit;
  if (upwardDistance < 14) return;
  upwardDistance = 0;
  gestureCounted = true;
  if (now - firstScrollAt > DOUBLE_SCROLL_MS) { firstScrollAt = now; return; }
  firstScrollAt = -Infinity;
  lastRetreat = now;
  retreat();
}
