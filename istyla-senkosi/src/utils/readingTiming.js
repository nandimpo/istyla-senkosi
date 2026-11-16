// Reading hold is proportional to copy; video fades are separate from reading time.
export function readingTiming(text, { outgoing = false, calm = false } = {}) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const hold = Math.max(1600, words * 230 + 350);
  const cover = calm ? 0 : outgoing ? 3000 : 450;
  const reveal = calm ? 0 : 250;
  const exit = calm ? 0 : 400;
  return { hold, cover, reveal, exit, exitAt:cover + reveal + hold, total:cover + reveal + hold + exit };
}
