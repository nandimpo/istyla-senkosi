import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CrossfadePhoto from "./CrossfadePhoto";
import "../styles/FashionAlbum.css";

export default function FashionAlbum({ images, label, crossfade, visualOnly }) {
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);
  const touch = useRef(null);
  const open = selected !== null;
  const stop = (event) => event.stopPropagation();
  useEffect(() => {
    if (!open) return;
    const focus = document.activeElement;
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => { dialog.close(); focus?.focus(); };
  }, [open]);
  const move = (direction) => setSelected((index) => (index + direction + images.length) % images.length);
  return <>
    <div className={`fashion-wall ${crossfade ? "fashion-wall--crossfade" : ""} ${images.length <= 16 ? "fashion-wall--compact" : ""}`} aria-label={label} onPointerDown={stop} onClick={stop} onKeyDown={stop} onWheel={stop}>
      {images.map((src, index) => <figure key={src} style={{ "--tilt":`${[-4,3,-2,5,-3][index % 5]}deg`, "--arrival":`${index * 55}ms` }}>
        {crossfade ? <CrossfadePhoto images={images} index={index} alt={label} paused={visualOnly || open} interval={7500} fadeDuration={4000} onOpen={visualOnly ? undefined : setSelected}/> : <button type="button" className="fashion-album__photo" tabIndex={visualOnly ? -1 : 0} disabled={visualOnly} aria-label={`Open ${label}, photograph ${index + 1}`} onClick={() => setSelected(index)}><img src={src} alt={`${label}, photograph ${index + 1}`} loading="eager" draggable={false}/></button>}
      </figure>)}
    </div>
    {open && createPortal(<dialog ref={dialogRef} className="fashion-album" aria-label={`${label} photo album`} onPointerDown={stop} onWheel={stop} onClick={(event) => { stop(event); if (event.target === event.currentTarget) setSelected(null); }} onCancel={(event) => { event.preventDefault(); setSelected(null); }} onKeyDown={(event) => { stop(event); if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }}>
      <header><p>{label}</p><button type="button" onClick={() => setSelected(null)}>Close album (Esc)</button></header>
      <div className="fashion-album__image" onTouchStart={(event) => { touch.current = event.touches[0].clientX; }} onTouchEnd={(event) => { if (touch.current === null) return; const distance = event.changedTouches[0].clientX - touch.current; touch.current = null; if (Math.abs(distance) > 60) move(distance < 0 ? 1 : -1); }}><img src={images[selected]} alt={`${label}, photograph ${selected + 1}`} draggable={false}/></div>
      <nav aria-label="Album navigation"><button type="button" onClick={() => move(-1)}>Previous</button><span aria-live="polite">{selected + 1} / {images.length}</span><button type="button" onClick={() => move(1)}>Next</button></nav>
    </dialog>, document.body)}
  </>;
}
