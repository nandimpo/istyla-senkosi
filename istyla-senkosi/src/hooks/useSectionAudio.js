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

function fadeTo(audio, target, { thenPause = false, duration = FADE_MS } = {}) {
  cancelFade(audio);
  const from = audio.volume;
  if (from === target) {
    if (thenPause) audio.pause();
    return;
  }
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, Math.max(0, (now - start) / duration));
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

export function useSectionAudio({ id, audioRef, soundOn, duckMusic = false, volumeScale = 1, continueWhileLocked = false, fadeOut = false, nextTrack }) {
  const { currentSection, volume, navigationLocked } = useNavigation();
  const targetVolume = volume * (duckMusic ? 0.01 : volumeScale);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.muted = !soundOn;
    if (nextTrack) audio.loop = audio.dataset.followupTrack === nextTrack;

    if (currentSection !== id || fadeOut || (navigationLocked && !continueWhileLocked)) {
      fadeTo(audio, 0, { thenPause: true });
      return () => cancelFade(audio);
    }

    let disposed = false;
    let fadingTrackEnd = false;
    const hasNextTrack = () => nextTrack && audio.dataset.followupTrack !== nextTrack;
    const fadeTrackEnd = () => {
      const remaining = audio.duration - audio.currentTime;
      if (!hasNextTrack() || !Number.isFinite(remaining) || remaining > 4 || remaining <= 0) return false;
      if (!fadingTrackEnd) {
        fadingTrackEnd = true;
        fadeTo(audio, 0, { duration: remaining * 1000 });
      }
      return true;
    };
    const startNextTrack = () => {
      if (!hasNextTrack()) return;
      audio.dataset.followupTrack = nextTrack;
      audio.src = nextTrack;
      audio.loop = true;
      audio.volume = 0;
      fadingTrackEnd = false;
      audio.load();
      audio.play().then(() => {
        if (!disposed) fadeTo(audio, targetVolume, { duration: 4000 });
      }).catch(() => {});
    };
    const retry = () => {
      if (audio.ended && hasNextTrack()) { startNextTrack(); return; }
      if (audio.paused) {
        audio.volume = 0;
        audio.play().catch(() => {});
      }
      if (!fadeTrackEnd()) fadeTo(audio, targetVolume);
    };
    audio.addEventListener("timeupdate", fadeTrackEnd);
    audio.addEventListener("ended", startNextTrack);
    retry();
    resumeListeners.add(retry);
    window.addEventListener("pointerdown", retry);
    window.addEventListener("keydown", retry);
    window.addEventListener("touchstart", retry, { passive: true });
    const fadeForTransition = () => fadeTo(audio, 0, { thenPause: true });
    window.addEventListener("istyla:fade-section-audio", fadeForTransition);
    if (hasInteracted) retry();
    return () => {
      disposed = true;
      audio.removeEventListener("timeupdate", fadeTrackEnd);
      audio.removeEventListener("ended", startNextTrack);
      resumeListeners.delete(retry);
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("keydown", retry);
      window.removeEventListener("touchstart", retry);
      window.removeEventListener("istyla:fade-section-audio", fadeForTransition);
      cancelFade(audio);
    };
  }, [currentSection, id, soundOn, audioRef, targetVolume, navigationLocked, continueWhileLocked, fadeOut, nextTrack]);
}
