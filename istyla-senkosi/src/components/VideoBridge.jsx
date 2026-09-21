import { useEffect, useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import "../styles/VideoBridge.css";

export default function VideoBridge({ text, onCovered, onComplete, outgoing = false }) {
  const { reducedMotion } = useNavigation();
  const callbacks = useRef({ onCovered, onComplete });
  useEffect(() => { callbacks.current = { onCovered, onComplete }; });
  const calm = reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    const covered = setTimeout(() => callbacks.current.onCovered?.(), calm ? 0 : outgoing ? 3100 : 1900);
    const complete = setTimeout(() => callbacks.current.onComplete?.(), calm ? 4500 : outgoing ? 9000 : 6500);
    return () => { clearTimeout(covered); clearTimeout(complete); };
  }, [calm, outgoing]);
  return <div className={`video-bridge${outgoing ? " video-bridge--outgoing" : ""}${calm ? " video-bridge--calm" : ""}`} role="status" aria-live="polite">
    <p>{text}</p>
  </div>;
}
