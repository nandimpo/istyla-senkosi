import { useEffect, useRef } from "react";
import { useNavigation } from "../context/NavigationContext";

export default function FloatingText({ text, onComplete }) {
  const { reducedMotion } = useNavigation();
  const words = text.split(/\s+/);
  const completeRef = useRef(onComplete);
  useEffect(() => { completeRef.current = onComplete; }, [onComplete]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;
    const start = () => {
      clearTimeout(timer);
      timer = setTimeout(() => completeRef.current?.(), reducedMotion || preference.matches ? 0 : 800 + (words.length - 1) * 85);
    };
    start();
    preference.addEventListener("change", start);
    return () => { clearTimeout(timer); preference.removeEventListener("change", start); };
  }, [reducedMotion, words.length]);
  return <><span className="narrative-text__accessible">{text}</span><span aria-hidden="true">{words.map((word, index) => <span key={index} className="floating-word" style={{ animationDelay: `${index * 85}ms` }}>{word}{"\u00a0"}</span>)}</span></>;
}
