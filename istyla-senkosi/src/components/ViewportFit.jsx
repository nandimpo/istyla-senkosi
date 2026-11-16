import { useLayoutEffect, useRef, useState } from "react";

// Fit the whole reading panel, including its controls, rather than clipping it.
export default function ViewportFit({ className = "", children }) {
  const outer = useRef(null);
  const inner = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const container = outer.current;
    const content = inner.current;
    let active = true;
    const fit = () => {
      if (!active) return;
      const style = getComputedStyle(container);
      const available = container.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      const natural = content.scrollHeight;
      if (available > 0 && natural > 0) setScale(Math.min(1, available / natural));
    };
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    observer.observe(content);
    document.fonts.ready.then(fit);
    fit();
    return () => { active = false; observer.disconnect(); };
  }, []);
  return <div ref={outer} className={`${className} viewport-fit`}><div ref={inner} className="viewport-fit__content" style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>{children}</div></div>;
}
