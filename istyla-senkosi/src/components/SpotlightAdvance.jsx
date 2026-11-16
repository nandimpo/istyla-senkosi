import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import clothingDetail from "../assets/Chapter 3_Skothane/Skothane/skhothane-1.jpg";
import "../styles/SpotlightAdvance.css";

const HOLD_MS = 1100;
export default function SpotlightAdvance({ disabled = false, onComplete, label = "Continue the story", detailImage = clothingDetail }) {
  const { reducedMotion } = useNavigation();
  const [progress, setProgress] = useState(0);
  const frame = useRef(null);
  const timer = useRef(null);
  const active = useRef(false);
  const finished = useRef(false);
  const callback = useRef(onComplete);
  useEffect(() => { callback.current = onComplete; }, [onComplete]);
  const cancel = () => {
    active.current = false;
    cancelAnimationFrame(frame.current);
    if (!finished.current) setProgress(0);
  };
  useEffect(() => {
    const cancelHidden = () => { if (document.hidden) cancel(); };
    document.addEventListener("visibilitychange", cancelHidden);
    return () => { active.current = false; cancelAnimationFrame(frame.current); clearTimeout(timer.current); document.removeEventListener("visibilitychange", cancelHidden); };
  }, []);
  const begin = () => {
    if (disabled || active.current || finished.current) return;
    active.current = true;
    const started = performance.now();
    const tick = (now) => {
      if (!active.current) return;
      const amount = Math.min(1, (now - started) / HOLD_MS);
      setProgress(amount);
      if (amount === 1) {
        active.current = false;
        finished.current = true;
        timer.current = setTimeout(() => callback.current?.(), reducedMotion ? 150 : 400);
      } else frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };
  const stop = (event) => event.stopPropagation();
  return <nav style={{ visibility: disabled ? "hidden" : "visible" }} aria-hidden={disabled || undefined} className={`spotlight-advance ${!disabled && progress < 1 ? "is-ready" : ""} ${progress > 0 ? "is-holding" : ""} ${(progress === 1) ? "is-complete" : ""}`} aria-label="Step into the spotlight" onPointerDown={stop} onClick={stop} onKeyDown={stop} onWheel={stop}>
    <p className="spotlight-advance__title" role="status">{disabled ? "Let the words unfold..." : (progress === 1) ? "A closer look. A new perspective." : "Hold to look closer"}</p>
    <button type="button" disabled={disabled || (progress === 1)} aria-label={`${label}. Press and hold with your mouse, trackpad or finger, or hold Space or Enter.`}
      onPointerDown={(event) => { event.stopPropagation(); if (event.button !== 0 || disabled) return; event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); begin(); }}
      onPointerUp={(event) => { cancel(); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
      onPointerCancel={cancel} onLostPointerCapture={cancel} onBlur={cancel}
      onKeyDown={(event) => { event.stopPropagation(); if (["Enter", " "].includes(event.key)) { event.preventDefault(); if (!event.repeat) begin(); } }}
      onKeyUp={(event) => { if (["Enter", " "].includes(event.key)) { event.preventDefault(); cancel(); } }} onClick={(event) => event.preventDefault()}>
      <span className="spotlight-advance__lens">
        <img src={detailImage} alt="" style={{ clipPath:`circle(${progress * 71}% at 50% 50%)` }} />
        <svg className="spotlight-advance__icon spotlight-advance__icon--loafer" style={{ opacity:1 - progress }} viewBox="0 0 40 40" aria-hidden="true"><path d="M5 23L7 12Q8 10 11 13L16 18L24 19Q27 19 30 22L35 24Q38 26 36 29L5 29Q3 27 5 23Z"/><path d="M5 26Q16 29 36 26M6 29L6 31L14 31L15 29M18 19L16 24L28 25L29 22M19 21L26 22"/><path d="M8 14L8 20L14 22"/></svg>
      </span>
      <svg className="spotlight-advance__ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29"/><circle className="spotlight-advance__fill" cx="32" cy="32" r="29" pathLength="100" style={{ strokeDashoffset:100 - progress * 100 }}/></svg>
    </button>
    <span className="spotlight-advance__instruction">{(progress === 1) ? "Looking beyond first impressions" : progress > 0 ? "Keep holding..." : "Press and hold for a moment"}</span>
  </nav>;
}
