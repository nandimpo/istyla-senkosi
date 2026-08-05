export function scrollToChapter(id) {
  const el = document.getElementById(id);
  if (!el) return;
  // "about" (the landing hero) has no chapter-opener video to skip past.
  const top = id === "about" ? el.offsetTop : el.offsetTop + window.innerHeight;
  window.scrollTo({ top, behavior: "smooth" });
}
