import { CHAPTER_FOLLOWUPS, nextQueueIndex } from "./chapterAudioQueue";
import { useEffect, useRef, useState } from "react";
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

const FADE_MS = 3000;

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
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const resumeRef = useRef(() => {});
  const transitionSilenced = useRef(false);
  const targetVolume = volume * (duckMusic ? 0 : volumeScale);

  // Stop on unmount, while allowing changes in level to fade without pausing.
  useEffect(() => {
    const audio = audioRef.current;
    return () => { if (audio) { cancelFade(audio); audio.pause(); } };
  }, [audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.muted = !soundOn;
    const playlist = CHAPTER_FOLLOWUPS[id]?.length ? CHAPTER_FOLLOWUPS[id] : nextTrack ? [nextTrack] : [];
    if (playlist.length) audio.loop = false;
    if (audio.dataset.queueSection !== id) {
      audio.dataset.queueSection = id;
      audio.dataset.followupIndex = "-1";
    }

    if (duckMusic) {
      audio.dataset.videoSoundActive = "true";
      fadeTo(audio, 0, { thenPause: true, duration: 400 });
      return () => cancelFade(audio);
    }

    if (transitionSilenced.current || currentSection !== id || fadeOut || (navigationLocked && !continueWhileLocked)) {
      fadeTo(audio, 0, { thenPause: true });
      return () => cancelFade(audio);
    }

    let disposed = false;
    const playbackFailed = (error) => {
      if (!disposed && error?.name === "NotAllowedError" && soundOn) setAutoplayBlocked(true);
    };
    const playbackStarted = () => {
      if (disposed) return;
      setAutoplayBlocked(false);
    };
    let fadingTrackEnd = false;
    const hasNextTrack = () => playlist.length > 0;
    const fadeTrackEnd = () => {
      if (duckMusic || audio.dataset.videoSoundActive === "true") return false;
      const remaining = audio.duration - audio.currentTime;
      if (!hasNextTrack() || !Number.isFinite(remaining) || remaining > 4 || remaining <= 0) return false;
      if (!fadingTrackEnd) {
        fadingTrackEnd = true;
        fadeTo(audio, 0, { duration: remaining * 1000 });
      }
      return true;
    };
    const startNextTrack = () => {
      if (duckMusic || !hasNextTrack() || transitionSilenced.current || audio.dataset.videoSoundActive === "true") return;
      const savedIndex = Number(audio.dataset.followupIndex ?? -1);
      const index = nextQueueIndex(Number.isInteger(savedIndex) ? savedIndex : -1, playlist.length);
      audio.dataset.followupIndex = String(index);
      audio.src = playlist[index];
      audio.loop = false;
      audio.volume = 0;
      fadingTrackEnd = false;
      audio.load();
      audio.play().then(() => {
        if (disposed) return;
        playbackStarted();
        fadeTo(audio, targetVolume, { duration: 4000 });
      }).catch(playbackFailed);
    };
    const retry = (event) => {
      if (transitionSilenced.current) return;
      if (audio.dataset.videoSoundActive === "true") { fadeTo(audio, 0, { thenPause: true, duration: 400 }); return; }
      if (event?.target?.closest?.(".chapter-player__sound, .intro-ambient-sound")) return;
      if (audio.ended && hasNextTrack()) { startNextTrack(); return; }
      if (audio.paused) {
        audio.volume = 0;
        audio.play().then(playbackStarted).catch(playbackFailed);
      }
      if (!fadeTrackEnd()) fadeTo(audio, targetVolume);
    };
    const prepareForVideo = (event) => {
      // Keep a quiet musical bed while the user decides when to press Play.
      if (audio.dataset.videoSoundActive !== "true") fadeTo(audio, volume * .12, { duration: event?.detail?.duration || 3000 });
    };
    const silenceForVideo = (event) => {
      audio.dataset.videoSoundActive = "true";
      fadeTo(audio, 0, { thenPause: true, duration: event?.detail?.duration || 400 });
    };
    const restoreAfterVideo = () => { delete audio.dataset.videoSoundActive; retry(); };
    window.addEventListener("istyla:video-audio-prepare", prepareForVideo);
    window.addEventListener("istyla:video-audio-start", silenceForVideo);
    window.addEventListener("istyla:video-audio-end", restoreAfterVideo);
    audio.addEventListener("timeupdate", fadeTrackEnd);
    audio.addEventListener("ended", startNextTrack);
    resumeRef.current = retry;
    retry();
    resumeListeners.add(retry);
    window.addEventListener("pointerdown", retry, true);
    window.addEventListener("keydown", retry, true);
    window.addEventListener("touchstart", retry, { passive: true, capture: true });
    window.addEventListener("click", retry, true);
    const fadeForTransition = () => {
      transitionSilenced.current = true;
      fadeTo(audio, 0, { thenPause: true });
    };
    window.addEventListener("istyla:fade-section-audio", fadeForTransition);
    if (hasInteracted) retry();
    return () => {
      disposed = true;
      window.removeEventListener("istyla:video-audio-prepare", prepareForVideo);
      window.removeEventListener("istyla:video-audio-start", silenceForVideo);
      window.removeEventListener("istyla:video-audio-end", restoreAfterVideo);
      resumeRef.current = () => {};
      window.removeEventListener("click", retry, true);
      audio.removeEventListener("timeupdate", fadeTrackEnd);
      audio.removeEventListener("ended", startNextTrack);
      resumeListeners.delete(retry);
      window.removeEventListener("pointerdown", retry, true);
      window.removeEventListener("keydown", retry, true);
      window.removeEventListener("touchstart", retry, true);
      window.removeEventListener("istyla:fade-section-audio", fadeForTransition);
      cancelFade(audio);
    };
  }, [currentSection, id, soundOn, audioRef, targetVolume, navigationLocked, continueWhileLocked, fadeOut, nextTrack]);
  return { autoplayBlocked, resumeAudio: () => resumeRef.current() };
}
