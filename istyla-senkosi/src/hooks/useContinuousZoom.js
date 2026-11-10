import { useEffect } from "react";
import { useNavigation } from "../context/NavigationContext";

export function useContinuousZoom(ref, enabled, resetKey) {
  const { reducedMotion } = useNavigation();
  useEffect(() => {
    const media = ref.current;
    if (!enabled || !media) return undefined;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation;
    const syncVisibility = () => {
      if (document.hidden) animation?.pause();
      else animation?.play();
    };
    const update = () => {
      animation?.cancel();
      animation = undefined;
      if (reducedMotion || preference.matches) return;
      // Run the slow zoom on the compositor, with a bounded image size.
      animation = media.animate([{ transform: "scale(1)" }, { transform: "scale(1.18)" }], { duration: 60000, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
      syncVisibility();
    };
    update();
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      animation?.cancel();
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, [ref, enabled, resetKey, reducedMotion]);
}
