let lastRetreat = -Infinity;
let lastWheel = -Infinity;
let upwardDistance = 0;

// Capture before activities consume the wheel, including fine trackpad deltas.
export function reverseScroll(event, retreat) {
  if (event.ctrlKey || Math.abs(event.deltaX || 0) > Math.abs(event.deltaY)) return;
  if (event.deltaY >= 0) { upwardDistance = 0; return; }
  const target = event.target;
  // Modal albums/settings retain their own scrolling and close controls.
  if (target.closest?.("dialog[open]:not(.soweto-arrival)")) return;
  event.stopPropagation();
  const now = performance.now();
  if (now - lastWheel > 180) upwardDistance = 0;
  lastWheel = now;
  if (now - lastRetreat < 800) { upwardDistance = 0; return; }
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  upwardDistance += -event.deltaY * unit;
  if (upwardDistance < 14) return;
  upwardDistance = 0;
  lastRetreat = now;
  retreat();
}
