import { useRef, useState } from "react";
import StitchedNarrative from "../StitchedNarrative";
import OutfitAmbience from "./OutfitAmbience";
import "../../styles/ChapterGames.css";
import "../../styles/CurvedCarousel.css";

function SwipeCarouselGame({ images, onComplete, audioRef }) {
  const [copyReady, setCopyReady] = useState(false);
  const [current, setCurrent] = useState(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [furthest, setFurthest] = useState(0);
  const start = useRef(null);
  const slideRef = useRef(null);
  const wheelDelta = useRef(0);
  const wheelLockedUntil = useRef(0);
  const ready = furthest === images.length - 1;
  const goTo = (target) => {
    if (!copyReady) return;
    const next = Math.max(0, Math.min(images.length - 1, target));
    setCurrent(next); setFurthest((value) => Math.max(value, next)); setOffset(0);
  };
  const down = (event) => {
    if (!copyReady || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = { x:event.clientX, width:slideRef.current.offsetWidth * 1.04 };
    setDragging(true);
  };
  const move = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.pointerType === "mouse") setCursor({ x:event.clientX - bounds.left, y:event.clientY - bounds.top });
    if (!start.current) return;
    let amount = (event.clientX - start.current.x) / start.current.width;
    if ((current === 0 && amount > 0) || (current === images.length - 1 && amount < 0)) amount *= .2;
    setOffset(Math.max(-1.2, Math.min(1.2, amount)));
  };
  const cancel = () => { start.current = null; setDragging(false); setOffset(0); };
  const release = (event) => {
    if (!start.current) return;
    const distance = event.clientX - start.current.x;
    if (Math.abs(distance) > 40) goTo(current + (distance < 0 ? 1 : -1));
    cancel();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const turnWithWheel = (event) => {
    if (!copyReady) { event.stopPropagation(); return; }
    event.stopPropagation();
    const now = performance.now();
    if (now < wheelLockedUntil.current) return;
    wheelDelta.current += event.deltaY;
    if (Math.abs(wheelDelta.current) < 35) return;
    goTo(current + Math.sign(wheelDelta.current));
    wheelDelta.current = 0;
    wheelLockedUntil.current = now + 450;
  };
  return <section className="game-stage game-stage--skhothane curved-gallery" onWheel={turnWithWheel}>
    <OutfitAmbience audioRef={audioRef} />
    <header className="game-copy curved-gallery__copy">
      <div><p className="tag">03 / SKHOTHANE</p><h1>Looking closer at their style.</h1></div>
      <StitchedNarrative onComplete={() => setCopyReady(true)} className="game-copy__narrative" text="I look through photos of other Skhothanes, one image at a time. Their colours, poses and confidence remind me of my cousin and make me wonder what I overlooked in his style." placement="inline" />
    </header>
    <div inert={!copyReady} className={`curved-gallery__stage ${dragging ? "is-dragging" : ""}`} tabIndex={0} role="group" aria-roledescription="carousel" aria-label="Skhothane fashion photographs. Drag, scroll, or use the arrow keys to explore." onPointerDown={down} onPointerMove={move} onPointerUp={release} onPointerCancel={cancel} onLostPointerCapture={cancel} onPointerLeave={() => setCursor(null)} onKeyDown={(event) => { if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) { event.preventDefault(); event.stopPropagation(); goTo(event.key === "Home" ? 0 : event.key === "End" ? images.length - 1 : current + (event.key === "ArrowRight" ? 1 : -1)); } }}>
      {images.map((src, index) => {
        const distance = index - current + offset;
        return <figure ref={index === 0 ? slideRef : undefined} key={src} className="curved-gallery__panel" aria-hidden={index !== current} style={{ "--slide-x":`${distance * 104}%`, "--slide-turn":`${Math.max(-35, Math.min(35, distance * -15))}deg`, "--slide-depth":`${Math.min(100, Math.abs(distance) * 35)}px`, opacity:Math.abs(distance) > 3 ? 0 : 1 }}><img src={src} alt={`Skhothane style, photograph ${index + 1}`} draggable={false} loading={Math.abs(index - current) <= 2 ? "eager" : "lazy"}/></figure>;
      })}
      {cursor && <span className="curved-gallery__cursor" aria-hidden="true" style={{ left:cursor.x, top:cursor.y }}>{dragging ? "DRAGGING" : "DRAG"}</span>}
    </div>
    <div className="curved-gallery__controls" inert={!copyReady}>
      <button type="button" disabled={!copyReady || current === 0} aria-label="Previous photograph" onClick={() => goTo(current - 1)}>&larr;</button>
      <span role="status">{current + 1} / {images.length}</span>
      <button type="button" disabled={current === images.length - 1} aria-label="Next photograph" onClick={() => goTo(current + 1)}>&rarr;</button>
      {ready && <button type="button" className="curved-gallery__continue" onClick={onComplete}>Continue the story &rarr;</button>}
    </div>
    <p className="curved-gallery__hint" role="status">{copyReady ? "DRAG, SCROLL OR USE THE ARROWS TO EXPLORE" : "READ TO UNLOCK THE PHOTOGRAPHS"}</p>
  </section>;
}
export default SwipeCarouselGame;
