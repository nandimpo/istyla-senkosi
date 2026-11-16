// Reading hold is proportional to copy; video fades are separate from reading time.
export function readingTiming(text, { outgoing = false, calm = false, holdMs, coverMs } = {}) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const hold = holdMs ?? Math.max(1600, words * 230 + 350);
  const cover = calm ? 0 : coverMs ?? (outgoing ? 3000 : 450);
  const reveal = calm ? 0 : 250;
  const exit = calm ? 0 : 400;
  return { hold, cover, reveal, exit, exitAt:cover + reveal + hold, total:cover + reveal + hold + exit };
}
