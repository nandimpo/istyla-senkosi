import { useEffect, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import "../styles/NarrativeText.css";

export default function NarrativeText({ text, delay = 800, embroidered = false, onComplete }) {
  const { reducedMotion } = useNavigation();
  const [systemReducedMotion, setSystemReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [visibleCount, setVisibleCount] = useState(0);
  const showImmediately = reducedMotion || systemReducedMotion;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (event) => setSystemReducedMotion(event.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (showImmediately) return undefined;
    const start = performance.now() + delay;
    const characterMs = embroidered ? 150 : Math.min(75, 16000 / Math.max(1, text.length));
    const timer = window.setInterval(() => {
      const count = Math.min(text.length, Math.max(0, Math.floor((performance.now() - start) / characterMs)));
      setVisibleCount(count);
      if (count === text.length) window.clearInterval(timer);
    }, 30);
    return () => window.clearInterval(timer);
  }, [text, delay, showImmediately, embroidered]);

  const count = showImmediately ? text.length : visibleCount;
  useEffect(() => {
    if (count !== text.length) return undefined;
    // Include the final letter's thread-tightening animation before unlocking.
    const timer = window.setTimeout(() => onComplete?.(), showImmediately ? 0 : embroidered ? 150 : 450);
    return () => window.clearTimeout(timer);
  }, [count, text.length, showImmediately, embroidered, onComplete]);

  return <>
    <span className="narrative-text__accessible">{text}</span>
    <span className={`narrative-stitch${embroidered ? " narrative-stitch--embroidered" : ""}`} aria-hidden="true">
      <span className="narrative-stitch__thread">{text.slice(0, Math.max(0, count - 1))}
      {count > 0 && <span key={count} className={showImmediately ? undefined : "narrative-stitch__letter"}>{text[count - 1]}</span>}</span>
      {!showImmediately && count > 0 && count < text.length && <span className="narrative-stitch__cursor"><span className="narrative-stitch__needle" /></span>}
      <span className="narrative-text__pending">{text.slice(count)}</span>
    </span>
  </>;
}
