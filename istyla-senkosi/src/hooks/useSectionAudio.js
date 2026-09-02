import { useEffect } from "react";
import { useNavigation } from "../context/NavigationContext";

const resumeListeners = new Set();
let hasInteracted = false;
function markInteracted() {
  if (hasInteracted) return;
  hasInteracted = true;
  resumeListeners.forEach((fn) => fn());
}
if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", markInteracted, { once: true });
  window.addEventListener("keydown", markInteracted, { once: true });
  window.addEventListener("wheel", markInteracted, { once: true, passive: true });
  window.addEventListener("touchstart", markInteracted, { once: true, passive: true });
}

const FADE_MS = 1100;

function cancelFade(audio) {
  if (audio._fadeRaf) {
    cancelAnimationFrame(audio._fadeRaf);
    audio._fadeRaf = null;
  }
}

function fadeTo(audio, target, { thenPause = false } = {}) {
  cancelFade(audio);
  const from = audio.volume;
  if (from === target) {
    if (thenPause) audio.pause();
    return;
  }
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, Math.max(0, (now - start) / FADE_MS));
    audio.volume = Math.min(1, Math.max(0, from + (target - from) * t));
    if (t < 1) {
      audio._fadeRaf = requestAnimationFrame(step);
    } else {
      audio._fadeRaf = null;
      if (thenPause) audio.pause();
    }
  };
  audio._fadeRaf = requestAnimationFrame(step);
}

export function useSectionAudio({ id, audioRef, soundOn }) {
  const { currentSection } = useNavigation();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.muted = !soundOn;

    if (currentSection !== id) {
      fadeTo(audio, 0, { thenPause: true });
      return undefined;
    }

    if (audio.paused) audio.volume = 0;
    audio.play().catch(() => {});
    fadeTo(audio, 1);

    const retry = () => {
      if (!audio.muted) {
        audio.play().catch(() => {});
        fadeTo(audio, 1);
      }
    };
    resumeListeners.add(retry);
    if (hasInteracted) retry();
    return () => resumeListeners.delete(retry);
  }, [currentSection, id, soundOn, audioRef]);
}
