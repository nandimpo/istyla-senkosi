import { useEffect } from "react";
import { useChapterGate, CHAPTER_ORDER } from "../context/ChapterGateContext";

const CLICK_BYPASS_MS = 1200;

function ScrollGate() {
  const { isUnlocked } = useChapterGate();

  useEffect(() => {
    let bypassUntil = 0;

    const onClick = (event) => {
      if (event.target.closest('a[href^="#"]')) {
        bypassUntil = Date.now() + CLICK_BYPASS_MS;
      }
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
      if (Date.now() < bypassUntil) return;
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
  }, [isUnlocked]);

  return null;
}

export default ScrollGate;
