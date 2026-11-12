import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CrossfadePhoto from "./CrossfadePhoto";
import "../styles/FashionAlbum.css";
import "../styles/Scrapbook.css";

const scrapbookSlots = [
  [5,24,30,44,-3], [37,25,28,28,2], [70,24,18,36,-2],
  [3,60,18,34,-5], [35,58,27,34,-2], [63,49,24,25,3],
  [64,76,20,17,-2], [76,81,22,15,-3], [49,44,13,21,-12],
  [80,55,18,25,4], [51,46,17,22,-3], [74,60,17,24,2],
  [28,35,16,23,3], [53,75,17,18,-2], [5,49,16,23,-3],
  [45,24,17,27,2], [27,68,17,24,3], [76,34,18,24,-2],
];
const fullScrapbookSlots = [
  [3,21,34,48,-3], [38,22,28,27,2], [77,21,17,33,-2],
  [2,61,18,35,-5], [35,55,31,39,-2], [64,47,25,28,3],
  [67,66,20,29,-2], [80,82,19,14,-3], [49,44,13,21,-12],
  [81,55,18,25,4], [61,23,17,24,-4], [25,35,20,35,3],
  [51,78,16,17,-3], [77,34,17,19,4], [3,38,16,19,-4],
  [27,69,18,26,2], [46,43,17,22,-3], [74,61,18,24,2],
];

export default function FashionAlbum({ images, label, crossfade, visualOnly, scrapbook = false, chapter = "STYLE", clippingKinds = [] }) {
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
    <div className={`fashion-wall ${scrapbook ? "fashion-wall--scrapbook" : ""} ${crossfade ? "fashion-wall--crossfade" : ""} ${images.length <= 16 ? "fashion-wall--compact" : ""}`} aria-label={label} onPointerDown={stop} onClick={stop} onKeyDown={stop} onWheel={stop}>
      {scrapbook && <><header className="scrapbook-masthead" aria-label={`${chapter} scrapbook`}><h3>Still here.<br /><em>Still him.</em></h3><small>What stays with me</small></header><span className="scrapbook-note">the past, in the present ↗</span><span className="scrapbook-footer">COLLECTED, NOT FORGOTTEN / HOVER TO LOOK CLOSER · TAP TO OPEN</span></>}
      {images.map((src, index) => {
        const slots = images.length > 12 ? fullScrapbookSlots : scrapbookSlots;
        const [x,y,w,h,tilt] = slots[index % slots.length];
        return <figure key={src} className={scrapbook ? `scrapbook-clipping scrapbook-clipping--${clippingKinds[index] || (index % 4 === 0 ? "portrait" : "photo")}` : undefined} style={{ "--tilt":`${scrapbook ? tilt : [-4,3,-2,5,-3][index % 5]}deg`, "--arrival":`${index * 55}ms`, "--clip-x":`${x}%`, "--clip-y":`${y}%`, "--clip-w":`${w}%`, "--clip-h":`${h}%`, "--clip-layer":index + 1 }}>
        {crossfade ? <CrossfadePhoto images={images} index={index} alt={label} paused={visualOnly || open} interval={7500} fadeDuration={4000} onOpen={visualOnly ? undefined : setSelected}/> : <button type="button" className="fashion-album__photo" tabIndex={visualOnly ? -1 : 0} disabled={visualOnly} aria-label={`Open ${label}, photograph ${index + 1}`} onClick={() => setSelected(index)}><img src={src} alt={`${label}, photograph ${index + 1}`} loading="eager" draggable={false}/></button>}
      </figure>; })}
    </div>
    {open && createPortal(<dialog ref={dialogRef} className="fashion-album" aria-label={`${label} photo album`} onPointerDown={stop} onWheel={stop} onClick={(event) => { stop(event); if (event.target === event.currentTarget) setSelected(null); }} onCancel={(event) => { event.preventDefault(); setSelected(null); }} onKeyDown={(event) => { stop(event); if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }}>
      <header><p>{label}</p><button type="button" onClick={() => setSelected(null)}>Close album (Esc)</button></header>
      <div className="fashion-album__image" onTouchStart={(event) => { touch.current = event.touches[0].clientX; }} onTouchEnd={(event) => { if (touch.current === null) return; const distance = event.changedTouches[0].clientX - touch.current; touch.current = null; if (Math.abs(distance) > 60) move(distance < 0 ? 1 : -1); }}><img src={images[selected]} alt={`${label}, photograph ${selected + 1}`} draggable={false}/></div>
      <nav aria-label="Album navigation"><button type="button" onClick={() => move(-1)}>Previous</button><span aria-live="polite">{selected + 1} / {images.length}</span><button type="button" onClick={() => move(1)}>Next</button></nav>
    </dialog>, document.body)}
  </>;
}
