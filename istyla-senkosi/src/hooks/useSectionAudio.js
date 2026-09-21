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

const FADE_MS = 2200;

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

export function useSectionAudio({ id, audioRef, soundOn, duckMusic = false, volumeScale = 1, continueWhileLocked = false, fadeOut = false }) {
  const { currentSection, volume, navigationLocked } = useNavigation();
  const targetVolume = volume * (duckMusic ? 0.01 : volumeScale);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.muted = !soundOn;

    if (currentSection !== id || fadeOut || (navigationLocked && !continueWhileLocked)) {
      fadeTo(audio, 0, { thenPause: true });
      return undefined;
    }

    if (audio.paused) audio.volume = 0;
    audio.play().catch(() => {});
    fadeTo(audio, targetVolume);

    const retry = () => {
      if (!audio.muted) {
        audio.play().catch(() => {});
        fadeTo(audio, targetVolume);
      }
    };
    resumeListeners.add(retry);
    window.addEventListener("pointerdown", retry);
    window.addEventListener("keydown", retry);
    window.addEventListener("touchstart", retry, { passive: true });
    const fadeForTransition = () => fadeTo(audio, 0, { thenPause: true });
    window.addEventListener("istyla:fade-section-audio", fadeForTransition);
    if (hasInteracted) retry();
    return () => {
      resumeListeners.delete(retry);
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("keydown", retry);
      window.removeEventListener("touchstart", retry);
      window.removeEventListener("istyla:fade-section-audio", fadeForTransition);
      cancelFade(audio);
    };
  }, [currentSection, id, soundOn, audioRef, targetVolume, navigationLocked, continueWhileLocked, fadeOut]);
}
