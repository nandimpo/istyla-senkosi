import { useEffect } from "react";
import { useActiveSection } from "../context/ActiveSectionContext";
import { useChapterGate, CHAPTER_ORDER } from "../context/ChapterGateContext";

function ScrollGate() {
  const { isUnlocked, reach } = useChapterGate();
  const activeId = useActiveSection();

  // Whatever section the page is actually showing - via reload scroll
  // restoration, a direct link, or browser back/forward - counts as reached,
  // even though no click or completion fired to unlock it.
  useEffect(() => {
    reach(activeId);
  }, [activeId, reach]);

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      if (CHAPTER_ORDER.includes(id)) reach(id);
    };

    const computeCap = () => {
      for (const id of CHAPTER_ORDER) {
        if (!isUnlocked(id)) {
          const el = document.getElementById(id);
          if (el) return el.offsetTop;
        }
      }
      return Infinity;
    };

    const onScroll = () => {
      const cap = computeCap();
      if (window.scrollY > cap) {
        window.scrollTo({ top: cap, behavior: "instant" });
      }
    };

    document.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isUnlocked, reach]);

  return null;
}

export default ScrollGate;
