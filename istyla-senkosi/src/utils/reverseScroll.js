let lastRetreat = -Infinity;

// Capture before games and albums consume the wheel. Scroll readable content
// back to its top before treating another upward gesture as page navigation.
export function reverseScroll(event, retreat) {
  if (event.ctrlKey || event.deltaY >= 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  let element = event.target;
  while (element && element !== event.currentTarget) {
    const overflow = window.getComputedStyle(element).overflowY;
    if ((overflow === "auto" || overflow === "scroll") && element.scrollHeight > element.clientHeight + 1 && element.scrollTop > 1) {
      event.stopPropagation();
      return;
    }
    element = element.parentElement;
  }
  event.stopPropagation();
  const now = performance.now();
  if (event.deltaY > -12 || now - lastRetreat < 800) return;
  lastRetreat = now;
  retreat();
}
