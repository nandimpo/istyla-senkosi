import { useEffect, useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import "../styles/StitchedNarrative.css";
import NarrativeText from "./NarrativeText";
import FloatingText from "./FloatingText";

const DEFAULT_TIMING = { delay: 150, thread: 1400, text: 850, stagger: 180 };

export default function StitchedNarrative({ text, highlightedPhrases = [], placement = "lower-left", chapterColour, timing = DEFAULT_TIMING, onComplete, animation = "needle", className = "" }) {
  const rootRef = useRef(null);
  const callback = useRef(onComplete);
  const { reducedMotion } = useNavigation();
  const { delay = 150, thread = 1400, text: textDuration = 850, stagger = 180 } = timing;
  useEffect(() => { callback.current = onComplete; }, [onComplete]);
  useEffect(() => {
    const root = rootRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;
    let started = false;
    let completed = false;
    let disposed = false;
    let startTime = 0;
    const finish = () => { if (!completed && !disposed) { completed = true; callback.current?.(); } };
    const measure = () => {
      const words = [...root.querySelectorAll(".stitched-narrative__word")];
      let line = 0;
      let top = words[0]?.offsetTop;
      for (const word of words) {
        if (Math.abs(word.offsetTop - top) > 3) { line++; top = word.offsetTop; }
        word.style.setProperty("--line", line);
      }
      if (started && !completed && animation === "lines") {
        clearTimeout(timer);
        const duration = reducedMotion || preference.matches ? 0 : Math.max(delay + thread, delay + thread * .6 + 1000, delay + 250 + line * stagger + textDuration);
        timer = setTimeout(finish, Math.max(0, duration - (performance.now() - startTime)));
      }
    };
    const start = () => {
      if (!started) { started = true; startTime = performance.now(); }
      measure();
      root.dataset.visible = "true";
    };
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) start(); }, { threshold: .15 });
    const resize = new ResizeObserver(measure);
    observer.observe(root);
    resize.observe(root);
    preference.addEventListener("change", measure);
    document.fonts.ready.then(() => { if (!disposed) measure(); });
    return () => { disposed = true; clearTimeout(timer); observer.disconnect(); resize.disconnect(); preference.removeEventListener("change", measure); };
  }, [text, delay, thread, textDuration, stagger, reducedMotion, animation]);

  const selected = highlightedPhrases.find((phrase) => text.toLocaleLowerCase().includes(phrase.toLocaleLowerCase()));
  const highlightStart = selected ? text.toLocaleLowerCase().indexOf(selected.toLocaleLowerCase()) : -1;
  return <div ref={rootRef} className={`stitched-narrative stitched-narrative--${placement} stitched-narrative--${animation} ${className}`} style={{ "--thread-colour": chapterColour || "var(--narrative-accent, #e0ba7e)", "--stitch-delay": `${delay}ms`, "--thread-time": `${thread}ms`, "--text-time": `${textDuration}ms`, "--line-stagger": `${stagger}ms` }}>
    {animation === "needle" ? <div className="stitched-narrative__copy"><NarrativeText key={text} text={text} embroidered={placement !== "inline"} onComplete={onComplete} /></div> : animation === "float" ? <div className="stitched-narrative__copy"><FloatingText text={text} onComplete={onComplete} /></div> : <>
    <p className="stitched-narrative__sr">{text}</p>
    <p className="stitched-narrative__copy" aria-hidden="true">{[...text.matchAll(/\s+|\S+/g)].map((match, index) => {
      const part = match[0];
      const start = match.index;
      if (/^\s+$/.test(part)) return part;
      const highlight = highlightStart >= 0 && start < highlightStart + selected.length && start + part.length > highlightStart;
      return <span key={index} className={`stitched-narrative__word${highlight ? " stitched-narrative__word--accent" : ""}`}>{part}</span>;
    })}</p></>}
    <svg className="stitched-narrative__thread" viewBox="0 0 600 26" preserveAspectRatio="none" aria-hidden="true">
      <path className="stitched-narrative__stitches" pathLength="100" d="M1 13 H435"/>
      <path className="stitched-narrative__draw" pathLength="100" d="M1 13 H435"/>
      <path className="stitched-narrative__tail" pathLength="100" d="M435 13 C475 13 477 22 495 18 S535 5 565 13 H600"/>
    </svg>
  </div>;
}
