import { useEffect } from "react";
import { useNavigation } from "../context/NavigationContext";

export function useContinuousZoom(ref, enabled, resetKey) {
  const { reducedMotion } = useNavigation();
  useEffect(() => {
    const media = ref.current;
    if (!enabled || !media) return undefined;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation;
    const update = () => {
      cancelAnimationFrame(animation);
      media.style.transform = "none";
      if (reducedMotion || preference.matches) return;
      const start = performance.now();
      const zoom = (now) => {
        media.style.transform = `scale(${1 + (now - start) / 10000})`;
        animation = requestAnimationFrame(zoom);
      };
      animation = requestAnimationFrame(zoom);
    };
    update();
    preference.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(animation);
      preference.removeEventListener("change", update);
      media.style.transform = "none";
    };
  }, [ref, enabled, resetKey, reducedMotion]);
}
