import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../context/NavigationContext";

const TURN_MS = 1050;

export default function MemoryFlipbook({ images, paused = false }) {
  const { reducedMotion } = useNavigation();
  const [page, setPage] = useState({ current: 0, previous: null, turn: 0, direction: 1 });
  const busy = useRef(false);
  const startX = useRef(null);
  const turnTimer = useRef(null);
  const flipRef = useRef(null);

  useEffect(() => () => clearTimeout(turnTimer.current), []);

  const flip = (direction) => {
    if (paused || busy.current || images.length < 2) return;
    busy.current = true;
    setPage(({ current, turn }) => ({ current: (current + direction + images.length) % images.length, previous: current, turn: turn + 1, direction }));
    clearTimeout(turnTimer.current);
    turnTimer.current = setTimeout(() => {
      setPage((value) => ({ ...value, previous: null }));
      busy.current = false;
    }, reducedMotion ? 0 : TURN_MS);
  };
  flipRef.current = flip;

  useEffect(() => {
    if (paused) return undefined;
    const handleArrow = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target?.tagName)) return;
      event.preventDefault();
      event.stopPropagation();
      flipRef.current(event.key === "ArrowRight" ? 1 : -1);
    };
    window.addEventListener("keydown", handleArrow, true);
    return () => window.removeEventListener("keydown", handleArrow, true);
  }, [paused]);

  const handlePointerDown = (event) => {
    event.stopPropagation();
    startX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event) => {
    event.stopPropagation();
    if (startX.current === null) return;
    const distance = event.clientX - startX.current;
    startX.current = null;
    flip(Math.abs(distance) > 45 && distance > 0 ? -1 : 1);
  };

  return (
    <div className="memory-flipbook" role="group" tabIndex={paused ? -1 : 0} aria-label={`Jama's memory album, photograph ${page.current + 1} of ${images.length}. Drag or use the buttons to turn a page.`}
      onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}
      onPointerCancel={(event) => { event.stopPropagation(); startX.current = null; }}
      onClick={(event) => event.stopPropagation()} onWheel={(event) => event.stopPropagation()}
      onKeyDown={(event) => { event.stopPropagation(); if (event.key === "ArrowRight") { event.preventDefault(); flip(1); } if (event.key === "ArrowLeft") { event.preventDefault(); flip(-1); } }}>
      {page.turn > 0 && <div className="memory-flipbook__settled-page" aria-hidden="true" />}
      <div className="memory-flipbook__stack" aria-hidden="true" />
      <div className="memory-flipbook__page">
        <img src={images[page.current]} alt={`Memory photograph ${page.current + 1} of ${images.length}`} />
      </div>
      {page.previous !== null && !paused && !reducedMotion && (
        <div key={page.turn} className={`memory-flipbook__turning memory-flipbook__turning--${page.direction > 0 ? "forward" : "back"}`} aria-hidden="true">
          <img src={images[page.previous]} alt="" />
          <span className="memory-flipbook__paper-back" />
        </div>
      )}
      <div className="memory-flipbook__controls" onPointerDown={(event) => event.stopPropagation()} onPointerUp={(event) => event.stopPropagation()}>
        <button type="button" onClick={(event) => { event.stopPropagation(); flip(-1); }} aria-label="Previous memory photograph">←</button>
        <span aria-live="polite">{String(page.current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        <button type="button" onClick={(event) => { event.stopPropagation(); flip(1); }} aria-label="Next memory photograph">→</button>
      </div>
      <p className="memory-flipbook__hint">DRAG OR TAP TO TURN A MEMORY</p>
    </div>
  );
}
