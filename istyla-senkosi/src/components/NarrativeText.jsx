import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import { glyphThread } from "./glyphThread";
import "../styles/NarrativeText.css";

export default function NarrativeText({ text, delay = 800, embroidered = false, onComplete }) {
  const { reducedMotion } = useNavigation();
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const needleRef = useRef(null);
  const completeRef = useRef(onComplete);
  useEffect(() => { completeRef.current = onComplete; }, [onComplete]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const letters = [...root.querySelectorAll("[data-letter]")];
    const svg = svgRef.current;
    const needle = needleRef.current;
    let disposed = false;
    let frame;
    svg.replaceChildren();
    if (reducedMotion || systemReduced) {
      letters.forEach((letter) => { letter.style.opacity = 1; });
      needle.style.visibility = "hidden";
      completeRef.current?.();
      return;
    }
    letters.forEach((letter) => { letter.style.opacity = 0; });
    needle.style.visibility = "hidden";
    const cache = new Map();
    let index = 0;
    let started;
    let active;
    let paths = [];
    let length = 0;
    let duration = 0;
    const prepare = () => {
      while (index < letters.length && !letters[index].textContent.trim()) {
        letters[index++].style.opacity = 1;
      }
      if (index >= letters.length) return false;
      active = letters[index];
      const style = getComputedStyle(active);
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const key = font + active.textContent;
      if (!cache.has(key)) cache.set(key, glyphThread(active.textContent, font));
      const glyph = cache.get(key);
      svg.replaceChildren();
      paths = glyph.paths.map((d) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        svg.append(path);
        const size = path.getTotalLength();
        path.style.strokeDasharray = size;
        path.style.strokeDashoffset = size;
        return { path, size };
      });
      length = paths.reduce((sum, part) => sum + part.size, 0);
      duration = Math.min(650, Math.max(280, length * 4));
      active.dataset.glyphHeight = glyph.height;
      return true;
    };
    const tick = (now) => {
      if (disposed) return;
      if (started === undefined) started = now + delay;
      if (now >= started) {
        if (!active && !prepare()) {
          needle.style.visibility = "hidden";
          svg.replaceChildren();
          completeRef.current?.();
          return;
        }
        const progress = Math.min(1, (now - started) / duration);
        const bounds = active.getBoundingClientRect();
        const container = root.getBoundingClientRect();
        const x = bounds.left - container.left;
        const y = bounds.top - container.top + (bounds.height - Number(active.dataset.glyphHeight)) / 2;
        let remaining = progress * length;
        let tip;
        for (const part of paths) {
          part.path.setAttribute("transform", `translate(${x} ${y})`);
          const drawn = Math.max(0, Math.min(part.size, remaining));
          part.path.style.strokeDashoffset = part.size - drawn;
          if (remaining >= 0) tip = part.path.getPointAtLength(drawn);
          remaining -= part.size;
        }
        if (tip) {
          needle.style.visibility = "visible";
          needle.style.left = `${x + tip.x}px`;
          needle.style.top = `${y + tip.y}px`;
        }
        if (progress === 1) {
          active.style.opacity = 1;
          active = null;
          index++;
          started = now;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    document.fonts.ready.then(() => { if (!disposed) frame = requestAnimationFrame(tick); });
    return () => { disposed = true; cancelAnimationFrame(frame); };
  }, [text, delay, reducedMotion, systemReduced]);

  return <>
    <span className="narrative-text__accessible">{text}</span>
    <span ref={rootRef} className={`narrative-stitch narrative-stitch--tracing${embroidered ? " narrative-stitch--embroidered" : ""}`} aria-hidden="true">
      <span className="narrative-stitch__thread">{text.split(/(\s+)/).map((word, wordIndex) => <span className={word.trim() ? "narrative-stitch__word" : undefined} key={wordIndex}>{[...word].map((letter, index) => <span data-letter="" key={index}>{letter}</span>)}</span>)}</span>
      <svg ref={svgRef} className="narrative-stitch__glyph" />
      <span ref={needleRef} className="narrative-stitch__glide"><span className="narrative-stitch__needle" /></span>
    </span>
  </>;
}
