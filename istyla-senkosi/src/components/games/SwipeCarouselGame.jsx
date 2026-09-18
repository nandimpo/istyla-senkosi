import { useRef, useState } from "react";
import "../../styles/ChapterGames.css";
import "../../styles/CurvedCarousel.css";

function SwipeCarouselGame({ images, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [furthest, setFurthest] = useState(0);
  const start = useRef(null);
  const slideRef = useRef(null);
  const ready = furthest === images.length - 1;
  const goTo = (target) => {
    const next = Math.max(0, Math.min(images.length - 1, target));
    setCurrent(next); setFurthest((value) => Math.max(value, next)); setOffset(0);
  };
  const down = (event) => {
    if (event.button !== 0) return;
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
  return <section className="game-stage game-stage--skhothane curved-gallery">
    <header className="game-copy curved-gallery__copy">
      <div><p className="tag">03 / SKHOTHANE</p><h1>Every photo I took that day.</h1></div>
      <p className="body">I went back through everything I shot, one image after another, trying to see what I&apos;d missed the first time.</p>
    </header>
    <div className={`curved-gallery__stage ${dragging ? "is-dragging" : ""}`} tabIndex={0} role="group" aria-roledescription="carousel" aria-label="Skhothane fashion photographs. Drag or use the arrow keys to explore." onPointerDown={down} onPointerMove={move} onPointerUp={release} onPointerCancel={cancel} onLostPointerCapture={cancel} onPointerLeave={() => setCursor(null)} onKeyDown={(event) => { if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) { event.preventDefault(); event.stopPropagation(); goTo(event.key === "Home" ? 0 : event.key === "End" ? images.length - 1 : current + (event.key === "ArrowRight" ? 1 : -1)); } }}>
      {images.map((src, index) => {
        const distance = index - current + offset;
        return <figure ref={index === 0 ? slideRef : undefined} key={src} className="curved-gallery__panel" aria-hidden={index !== current} style={{ "--slide-x":`${distance * 104}%`, "--slide-turn":`${Math.max(-35, Math.min(35, distance * -15))}deg`, "--slide-depth":`${Math.min(100, Math.abs(distance) * 35)}px`, opacity:Math.abs(distance) > 3 ? 0 : 1 }}><img src={src} alt={`Skhothane style, photograph ${index + 1}`} draggable={false} loading={Math.abs(index - current) <= 2 ? "eager" : "lazy"}/></figure>;
      })}
      {cursor && <span className="curved-gallery__cursor" aria-hidden="true" style={{ left:cursor.x, top:cursor.y }}>{dragging ? "DRAGGING" : "DRAG"}</span>}
    </div>
    <div className="curved-gallery__controls">
      <button type="button" disabled={current === 0} aria-label="Previous photograph" onClick={() => goTo(current - 1)}>&larr;</button>
      <span role="status">{current + 1} / {images.length}</span>
      <button type="button" disabled={current === images.length - 1} aria-label="Next photograph" onClick={() => goTo(current + 1)}>&rarr;</button>
      {ready && <button type="button" className="curved-gallery__continue" onClick={onComplete}>Continue the story &rarr;</button>}
    </div>
    <p className="curved-gallery__hint">DRAG THROUGH, THE WAY I DID, LOOKING BACK</p>
  </section>;
}
export default SwipeCarouselGame;
