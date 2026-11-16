import { readingTiming } from "../utils/readingTiming";
import { useEffect, useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import "../styles/VideoBridge.css";

export default function VideoBridge({ text, onCovered, onComplete, outgoing = false, prepareVideoAudio = false }) {
  const { reducedMotion } = useNavigation();
  const callbacks = useRef({ onCovered, onComplete });
  useEffect(() => { callbacks.current = { onCovered, onComplete }; });
  const calm = reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { hold, cover, reveal, exit, exitAt, total } = readingTiming(text, { outgoing, calm });
  useEffect(() => {
    const covered = setTimeout(() => callbacks.current.onCovered?.(), cover);
    const complete = setTimeout(() => callbacks.current.onComplete?.(), total);
    return () => { clearTimeout(covered); clearTimeout(complete); };
  }, [cover, total]);
  useEffect(() => {
    if (!prepareVideoAudio || outgoing) return;
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("istyla:video-audio-prepare", { detail: { duration: 3000 } }));
    }, Math.max(0, exitAt - 3000));
    return () => clearTimeout(timer);
  }, [prepareVideoAudio, outgoing, exitAt]);
  const timing = {
    "--bridge-cover": `${cover}ms`,
    "--bridge-reveal": `${reveal}ms`,
    "--bridge-hold": `${hold}ms`,
    "--bridge-exit": `${exit}ms`,
    "--bridge-exit-at": `${exitAt}ms`,
  };
  return <div className={`video-bridge${outgoing ? " video-bridge--outgoing" : ""}${calm ? " video-bridge--calm" : ""}`} style={timing} role="status" aria-live="polite">
    <p>{text}</p>
  </div>;
}
