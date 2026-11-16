import { useEffect, useRef, useState } from "react";
import "../styles/StitchAdvance.css";

export default function StitchAdvance({ disabled = false, onComplete, label = "Continue the story" }) {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const drag = useRef(null);
  const progressRef = useRef(0);
  const done = useRef(false);
  const timer = useRef(null);
  const callback = useRef(onComplete);
  useEffect(() => { callback.current = onComplete; }, [onComplete]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const finish = () => {
    if (disabled || done.current) return;
    done.current = true;
    progressRef.current = 1;
    setProgress(1);
    setComplete(true);
    timer.current = setTimeout(() => callback.current?.(), 550);
  };
  const stop = (event) => event.stopPropagation();
  return <nav className={`stitch-advance ${complete ? "is-complete" : ""} ${!disabled && !complete && !interacted ? "is-inviting" : ""}`} aria-label="Follow the stitch to continue" onClick={stop} onKeyDown={stop} onPointerDown={stop} onWheel={stop} onDragStart={(event) => event.preventDefault()}>
    <p role="status">{complete ? "Every detail deserves attention." : disabled ? "Let the words unfold..." : "Follow the thread"}</p>
    <span className="stitch-advance__instruction">Drag the needle right to continue</span>
    <div className="stitch-advance__seam" role="slider" tabIndex={disabled || complete ? -1 : 0} aria-label="Drag the needle to the right to continue, or press Enter" aria-disabled={disabled || complete} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (disabled || done.current || event.button !== 0) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.preventDefault();
        setInteracted(true);
        event.currentTarget.focus({ preventScroll: true });
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { x: event.clientX, start: progressRef.current, width: Math.max(48, bounds.width - 36) };
      }}
      onPointerMove={(event) => {
        event.stopPropagation();
        if (!drag.current || disabled) return;
        event.preventDefault();
        const value = Math.max(0, Math.min(1, drag.current.start + (event.clientX - drag.current.x) / drag.current.width));
        progressRef.current = value;
        setProgress(value);
        if (value >= .8) { drag.current = null; finish(); }
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        if (drag.current && !disabled) {
          const value = Math.max(0, Math.min(1, drag.current.start + (event.clientX - drag.current.x) / drag.current.width));
          progressRef.current = value;
          setProgress(value);
          if (value >= .8) finish();
        }
        drag.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={(event) => { event.stopPropagation(); drag.current = null; }}
      onLostPointerCapture={() => { drag.current = null; }}
      onKeyDown={(event) => { event.stopPropagation(); if (["Enter", " ", "ArrowRight", "End"].includes(event.key)) { event.preventDefault(); finish(); } }}>
      <span className="stitch-advance__guide" />
      <span className="stitch-advance__thread" style={{ width: `${progress * 100}%` }} />
      <svg className="stitch-advance__needle" style={{ left: `calc(${progress * 100}% - ${progress * 30}px)` }} viewBox="0 0 48 18" aria-hidden="true"><path d="M2 9L44 5L47 6L44 8L2 11Z" fill="#ddd9cb" stroke="#726e61" strokeWidth=".7"/><ellipse cx="7" cy="9" rx="3" ry="1" fill="#28251d"/></svg>
    </div>
    <button type="button" aria-label={label} disabled={disabled || complete} onClick={finish}>Continue &rarr;</button>
  </nav>;
}
