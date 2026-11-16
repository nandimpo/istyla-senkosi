import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import "../styles/RhythmAdvance.css";

let beatContext;
function Footprint({ lit, next, right }) {
  return <svg className={`rhythm-advance__foot ${lit ? "is-lit" : ""} ${next ? "is-next" : ""} ${right ? "is-right" : ""}`} viewBox="0 0 28 62" aria-hidden="true">
    <path d="M9 2C2 4 1 16 4 27L7 39L21 36C25 27 27 15 22 7C19 2 14 0 9 2Z" />
    <path d="M8 44L21 41L22 54Q21 60 15 60Q9 60 8 55Z" />
    <path className="rhythm-advance__tread" d="M6 15L23 12M6 23L23 20M8 31L22 28M11 50L19 48" />
  </svg>;
}
export default function RhythmAdvance({ disabled = false, onComplete, label = "Continue the story", disabledMessage = "Let the words unfold...", disabledInstruction = "Two taps unlock the next page" }) {
  const { soundOn, volume, reducedMotion } = useNavigation();
  const [steps, setSteps] = useState(0);
  const count = useRef(0);
  const timer = useRef(null);
  const callback = useRef(onComplete);
  useEffect(() => { callback.current = onComplete; }, [onComplete]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const tap = () => {
    if (disabled || count.current >= 2) return;
    const next = ++count.current;
    setSteps(next);
    if (soundOn && volume > 0) {
      try {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (Audio) {
          beatContext ??= new Audio();
          beatContext.resume().catch(() => {});
          const oscillator = beatContext.createOscillator();
          const gain = beatContext.createGain();
          const now = beatContext.currentTime;
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(next === 1 ? 150 : 190, now);
          oscillator.frequency.exponentialRampToValueAtTime(65, now + .12);
          gain.gain.setValueAtTime(.0001, now);
          gain.gain.exponentialRampToValueAtTime(Math.max(.0001, volume * .18), now + .01);
          gain.gain.exponentialRampToValueAtTime(.0001, now + .16);
          oscillator.connect(gain).connect(beatContext.destination);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
          oscillator.start();
          oscillator.stop(now + .18);
        }
      } catch { /* Footprints also provide feedback when audio is unavailable. */ }
    }
    if (next === 2) timer.current = setTimeout(() => callback.current?.(), reducedMotion ? 180 : 450);
  };
  const stop = (event) => event.stopPropagation();
  return <nav style={{ visibility: disabled ? "hidden" : "visible" }} aria-hidden={disabled || undefined} className={`rhythm-advance ${!disabled && steps < 2 ? "is-ready" : ""}`} aria-label="Tap into the rhythm" onClick={stop} onPointerDown={stop} onWheel={stop} onKeyDown={stop}>
    <p className="rhythm-advance__title" role="status">{disabled ? disabledMessage : steps === 2 ? "Two steps forward." : "Tap into the rhythm"}</p>
    <button type="button" disabled={disabled || steps === 2} aria-label={`${label}. ${steps === 0 ? "Tap twice" : "One more tap"}. Enter or Space also works.`} onKeyDown={(event) => { if (event.repeat) event.preventDefault(); }} onClick={tap}>
      <Footprint lit={steps >= 1} next={!disabled && steps === 0} />
      <Footprint right lit={steps >= 2} next={!disabled && steps === 1} />
    </button>
    <span className="rhythm-advance__instruction">{steps === 2 ? "Moving with the rhythm" : disabled ? disabledInstruction : steps === 1 ? "One more step. Tap again." : "Two steps forward. Tap twice to continue."}</span>
  </nav>;
}
