import { useEffect, useRef } from "react";
import { useNavigation } from "../../context/NavigationContext";
import "../../styles/OutfitAmbience.css";

// A media element can only have one source node, including across screen revisits.
const analysers = new WeakMap();
let audioContext;

export default function OutfitAmbience({ audioRef }) {
  const layerRef = useRef(null);
  const { soundOn, reducedMotion } = useNavigation();

  useEffect(() => {
    const layer = layerRef.current;
    const audio = audioRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let animation;
    let bass = 0;
    let shimmer = 0;
    let phase = 0;
    let previous = 0;
    let running = false;
    let analyser = audio && analysers.get(audio);
    const bins = new Uint8Array(512);

    const connect = async () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audio || !AudioContext || !soundOn) return;
      try {
        audioContext ??= new AudioContext();
        if (audioContext.state === "suspended") await audioContext.resume();
        // Leave ordinary playback untouched until the audio context is running.
        if (disposed || audioContext.state !== "running") return;
        analyser = analysers.get(audio);
        if (!analyser) {
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 1024;
          analyser.smoothingTimeConstant = 0.65;
          const source = audioContext.createMediaElementSource(audio);
          source.connect(analyser);
          analyser.connect(audioContext.destination);
          analysers.set(audio, analyser);
        }
      } catch { /* Keep the static atmosphere if Web Audio is unavailable. */ }
    };

    const draw = (now) => {
      if (previous && now - previous < 1000 / 30) {
        animation = requestAnimationFrame(draw);
        return;
      }
      const delta = Math.min((now - (previous || now)) / 1000, 0.05);
      previous = now;
      let low = 0;
      let high = 0;
      const playing = soundOn && audio && !audio.paused && !audio.muted && audio.volume > 0;
      if (playing && analyser && audioContext.state === "running") {
        analyser.getByteFrequencyData(bins);
        const binWidth = audioContext.sampleRate / analyser.fftSize;
        const bassEnd = Math.max(2, Math.ceil(180 / binWidth));
        for (let i = 1; i < bassEnd; i++) low += bins[i] / 255;
        low /= bassEnd - 1;
        const start = Math.ceil(1500 / binWidth);
        const end = Math.min(bins.length, Math.ceil(7000 / binWidth));
        for (let i = start; i < end; i++) high += bins[i] / 255;
        high /= Math.max(1, end - start);
      }
      bass += (low - bass) * (1 - Math.exp(-delta * (low > bass ? 18 : 5)));
      shimmer += (high - shimmer) * (1 - Math.exp(-delta * 8));
      if (playing) phase += delta * (0.16 + bass * 0.65);
      layer.style.setProperty("--ambient-x", `${Math.sin(phase) * 5}%`);
      layer.style.setProperty("--ambient-y", `${Math.cos(phase * 0.8) * 4}%`);
      layer.style.setProperty("--ambient-scale", (1 + bass * 0.3).toFixed(3));
      layer.style.setProperty("--ambient-glow", (0.42 + bass * 0.35).toFixed(3));
      layer.style.setProperty("--ambient-shimmer", (0.2 + shimmer * 0.6).toFixed(3));
      animation = requestAnimationFrame(draw);
    };
    const updateMotion = () => {
      const shouldRun = !reducedMotion && !preference.matches && !document.hidden && soundOn && audio && !audio.paused && !audio.muted && audio.volume > 0;
      if (shouldRun && !running) {
        running = true;
        previous = 0;
        animation = requestAnimationFrame(draw);
      } else if (!shouldRun) {
        running = false;
        cancelAnimationFrame(animation);
        layer.style.setProperty("--ambient-scale", "1");
        layer.style.setProperty("--ambient-glow", ".42");
        layer.style.setProperty("--ambient-shimmer", ".2");
      }
    };
    connect();
    updateMotion();
    window.addEventListener("pointerdown", connect, true);
    window.addEventListener("keydown", connect, true);
    audio?.addEventListener("play", connect);
    audio?.addEventListener("playing", updateMotion);
    audio?.addEventListener("pause", updateMotion);
    audio?.addEventListener("volumechange", updateMotion);
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateMotion);
    return () => {
      disposed = true;
      cancelAnimationFrame(animation);
      window.removeEventListener("pointerdown", connect, true);
      window.removeEventListener("keydown", connect, true);
      audio?.removeEventListener("play", connect);
      audio?.removeEventListener("playing", updateMotion);
      audio?.removeEventListener("pause", updateMotion);
      audio?.removeEventListener("volumechange", updateMotion);
      preference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateMotion);
    };
  }, [audioRef, soundOn, reducedMotion]);

  return <div ref={layerRef} className="outfit-ambience" aria-hidden="true">
    <div className="outfit-ambience__haze" />
    <div className="outfit-ambience__sheen" />
  </div>;
}
