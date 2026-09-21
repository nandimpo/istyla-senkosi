import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import FloatingText from "./FloatingText";
import "../styles/StitchedNarrative.css";

const DEFAULT_TIMING = { thread: 2600 };

export default function StitchedNarrative({ text, placement = "lower-left", chapterColour, timing = DEFAULT_TIMING, onComplete, animation = "needle", className = "" }) {
  const { reducedMotion } = useNavigation();
  const [phase, setPhase] = useState("sewing");
  const lineRef = useRef(null);
  const needleRef = useRef(null);
  const completeRef = useRef(onComplete);
  const completedRef = useRef(false);
  const textDoneRef = useRef(false);
  const threadDoneRef = useRef(false);
  const wordCount = text.trim().split(/\s+/).length;
  const threadDuration = Math.max(timing.thread ?? DEFAULT_TIMING.thread, 800 + (wordCount - 1) * 85);

  useEffect(() => { completeRef.current = onComplete; }, [onComplete]);

  const textComplete = () => {
    textDoneRef.current = true;
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      needleRef.current?.setAttribute("transform", "translate(475 14) rotate(28)");
      setPhase("hanging");
    } else if (threadDoneRef.current) {
      setPhase("hanging");
    }
  };

  useEffect(() => {
    if (phase !== "sewing") return undefined;
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const line = lineRef.current;
    const needle = needleRef.current;
    const length = line.getTotalLength();
    let frame;
    let started;
    line.style.strokeDasharray = `${length}`;
    line.style.strokeDashoffset = `${length}`;
    const draw = (now) => {
      if (started === undefined) started = now;
      const elapsed = Math.min(1, (now - started) / threadDuration);
      const progress = elapsed * elapsed * (3 - 2 * elapsed);
      const point = line.getPointAtLength(length * progress);
      line.style.strokeDashoffset = `${length * (1 - progress)}`;
      needle.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(28)`);
      if (elapsed < 1) frame = requestAnimationFrame(draw);
      else {
        threadDoneRef.current = true;
        if (textDoneRef.current) setPhase("hanging");
      }
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [phase, reducedMotion, threadDuration]);

  useEffect(() => {
    if (phase !== "hanging" || completedRef.current) return undefined;
    const calm = reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      completeRef.current?.();
    }, calm ? 0 : 1150);
    return () => clearTimeout(timer);
  }, [phase, reducedMotion]);

  return <div className={`stitched-narrative stitched-narrative--${placement} stitched-narrative--${animation} ${className}`} data-phase={phase} style={{ "--thread-colour": chapterColour || "var(--narrative-accent, #e0ba7e)" }}>
    <div className="stitched-narrative__copy"><FloatingText text={text} onComplete={textComplete} /></div>
    <div className="stitched-narrative__thread-wrap" aria-hidden="true">
      <svg className="stitched-narrative__thread" viewBox="0 0 500 120" preserveAspectRatio="none">
        <path className="stitched-narrative__draw" ref={lineRef} d="M1 14 H475" />
        <path className="stitched-narrative__stitches" d="M1 14 H475" />
        <path className="stitched-narrative__tail" pathLength="100" d="M475 14 C482 32 483 48 473 63 C460 80 471 99 489 93 C505 88 499 69 486 74 C475 79 484 103 500 111" />
        <g className="stitched-narrative__needle" ref={needleRef} transform="translate(1 14) rotate(28)">
          <path className="stitched-narrative__needle-body" d="M-33 -2.4 Q-35 0 -33 2.4 L-7 1.5 Q-3 .9 0 0 Q-3 -.9 -7 -1.5 Z" />
          <path className="stitched-narrative__needle-shine" d="M-29 -1 L-7 -.65" />
          <ellipse className="stitched-narrative__needle-eye" cx="-29" cy="0" rx="2.9" ry="1.15" />
        </g>
      </svg>
    </div>
  </div>;
}
