import { useLayoutEffect } from "react";

// Decorative loops (glows, grain and breathing) do not delay navigation.
export function usePageReadiness(rootRef, pageKey, setPageReady) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    let stableSince = null;
    const backgrounds = new Map();
    const check = () => {
      for (const element of root.querySelectorAll("*")) {
        for (const match of getComputedStyle(element).backgroundImage.matchAll(/url\(["']?(.*?)["']?\)/g)) {
          const src = match[1];
          if (backgrounds.has(src)) continue;
          backgrounds.set(src, false);
          const image = new Image();
          image.src = src;
          image.decode().catch(() => {}).then(() => backgrounds.set(src, true));
        }
      }
      const busy = root.querySelector('.chapter-loading, [data-reading="true"], [data-page-loading="true"]');
      const loadingImage = [...root.querySelectorAll("img")].some((image) => {
        const box = image.getBoundingClientRect();
        return box.bottom > 0 && box.top < innerHeight && box.right > 0 && box.left < innerWidth && !image.complete;
      });
      const entering = root.getAnimations({ subtree: true }).some((animation) =>
        ["running", "pending"].includes(animation.playState) &&
        animation.effect?.getTiming().iterations !== Infinity);
      if (busy || loadingImage || entering || document.fonts.status === "loading" || [...backgrounds.values()].includes(false)) {
        stableSince = null;
        setPageReady(false);
      } else {
        stableSince ??= performance.now();
        setPageReady(performance.now() - stableSince >= 350);
      }
    };
    setPageReady(false);
    const observer = new MutationObserver(check);
    observer.observe(root, { childList: true, subtree: true, attributes: true });
    const timer = setInterval(check, 100);
    check();
    return () => { observer.disconnect(); clearInterval(timer); };
  }, [rootRef, pageKey, setPageReady]);
}
