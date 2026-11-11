import { useEffect, useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import "../styles/VideoBridge.css";

export default function VideoBridge({ text, onCovered, onComplete, outgoing = false, durationMs }) {
  const { reducedMotion } = useNavigation();
  const callbacks = useRef({ onCovered, onComplete });
  useEffect(() => { callbacks.current = { onCovered, onComplete }; });
  const calm = reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    const duration = durationMs ?? (calm ? 4500 : outgoing ? 9000 : 6500);
    const covered = setTimeout(() => callbacks.current.onCovered?.(), calm ? 0 : duration * (outgoing ? 3100 / 9000 : 1900 / 6500));
    const complete = setTimeout(() => callbacks.current.onComplete?.(), duration);
    return () => { clearTimeout(covered); clearTimeout(complete); };
  }, [calm, outgoing, durationMs]);
  const timing = durationMs ? { animationDuration: `${durationMs}ms` } : undefined;
  return <div className={`video-bridge${outgoing ? " video-bridge--outgoing" : ""}${calm ? " video-bridge--calm" : ""}`} style={timing} role="status" aria-live="polite">
    <p style={timing}>{text}</p>
  </div>;
}
