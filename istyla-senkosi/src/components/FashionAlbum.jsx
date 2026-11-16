import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigation } from "../context/NavigationContext";
import useCollageAssembly from "../hooks/useCollageAssembly";
import CollageMarks from "./CollageMarks";
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

export default function FashionAlbum({ images, label, crossfade, visualOnly, scrapbook = false, chapter = "STYLE", clippingKinds = [], customSlots, notes = [], audioRef, onAssemblyReady }) {
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);
  const touch = useRef(null);
  const open = selected !== null;
  const stop = (event) => event.stopPropagation();
  const handwrittenNotes = notes.length ? notes : chapter === "01 / SWENKA" ? [
    { text:"notice the finishing touches…", x:4, y:41, tilt:-4 },
    { text:"a suit, worn with pride", x:38, y:7, tilt:3 },
    { text:"the care is in the details", x:61, y:91, tilt:-3 },
  ] : chapter === "03 / SKHOTHANE" ? [
    { text:"colour with confidence", x:5, y:9, tilt:-4 },
    { text:"look at the combinations!", x:38, y:44, tilt:3 },
    { text:"his joy, in every detail", x:55, y:92, tilt:-3 },
  ] : [];
  const [assetsReady, setAssetsReady] = useState(false);
  const readyCallback = useRef(onAssemblyReady);
  useEffect(() => { readyCallback.current = onAssemblyReady; }, [onAssemblyReady]);
  useEffect(() => {
    let cancelled = false;
    setAssetsReady(false);
    Promise.allSettled(images.map((src) => {
      const image = new Image();
      image.src = src;
      return image.decode();
    })).then(() => { if (!cancelled) setAssetsReady(true); });
    return () => { cancelled = true; };
  }, [images]);
  const { reducedMotion } = useNavigation();
  const calm = reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const assembly = useCollageAssembly({ count: images.length, noteCount: handwrittenNotes.length, audioRef, paused: visualOnly, reducedMotion: calm });
  useEffect(() => {
    if (!visualOnly) readyCallback.current?.(assembly.complete && assetsReady);
  }, [assembly.complete, assetsReady, visualOnly]);
  useEffect(() => {
    if (!open) return;
    const focus = document.activeElement;
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => { dialog.close(); focus?.focus(); };
  }, [open]);
  const move = (direction) => setSelected((index) => (index + direction + images.length) % images.length);
  return <>
    <div className={`fashion-wall fashion-wall--assembling ${scrapbook ? "fashion-wall--scrapbook" : ""} ${crossfade ? "fashion-wall--crossfade" : ""} ${images.length <= 16 ? "fashion-wall--compact" : ""}`} style={{ "--assembly-end": "0ms" }} aria-label={label} onPointerDown={stop} onClick={stop} onKeyDown={stop} onWheel={stop}>
      {scrapbook && <><header className="scrapbook-masthead" aria-label={`${chapter} scrapbook`}><h3>Still here.<br /><em>Still him.</em></h3><small>What stays with me</small></header><span className="scrapbook-note" style={{ visibility: assembly.decorated ? "visible" : "hidden" }}>the past, in the present ↗</span><span className="scrapbook-footer">COLLECTED, NOT FORGOTTEN / HOVER TO LOOK CLOSER · TAP TO OPEN</span></>}
      <div className="scrapbook-canvas">
      {scrapbook && <>
        <div className="scrapbook-mixed-papers" aria-hidden="true">{[0,1,2].map((index) => <span key={index} style={{ visibility: index < assembly.papers ? "visible" : "hidden", animationDelay: "0ms", animationName: index < assembly.papers ? "scrapbook-paper" : "none" }} />)}</div>
        <CollageMarks className={`scrapbook-doodles ${assembly.decorated ? "is-placed" : "is-waiting"}`} height={650} marks={[
          ["swiggle",316,38,40,89], ["zigzag",39,487,93,22],
          ["zigzag",658,367,78,25], ["star",674,35,39,34],
          ["yellowStar",317,443,30,27], ["zigzag",75,602,67,15],
          ["zigzag",757,605,108,16], ["circle",63,318,194,130],
          ["swiggle",791,455,146,71], ["zigzag",407,300,109,15],
          ["star",950,63,22,35], ["circle",28,260,38,58],
          ["circle",628,540,25,40], ["swiggle",346,393,20,183],
          ["zigzag",261,527,21,18],
        ]} />
      </>}
      {images.map((src, index) => {
        const slots = customSlots || (images.length > 12 ? fullScrapbookSlots : scrapbookSlots);
        const [sx,sy,sw,sh,tilt] = slots[index % slots.length];
        const [x,y,w,h] = scrapbook && !customSlots ? [4 + sx * .9, 3 + (sy - 20) * 1.15, sw * .9, sh * 1.05] : [sx,sy,sw,sh];
        return <figure key={src} className={scrapbook ? `scrapbook-clipping ${index < assembly.placed ? "is-placed" : "is-waiting"} scrapbook-clipping--${clippingKinds[index] || (index % 4 === 0 ? "portrait" : "photo")}` : undefined} style={{ "--tilt":`${scrapbook ? tilt : [-4,3,-2,5,-3][index % 5]}deg`, "--arrival":"0ms", visibility: index < assembly.placed ? "visible" : "hidden", "--placement-x":`${index % 2 ? 14 : -14}px`, "--placement-turn":`${index % 2 ? 3 : -3}deg`, "--clip-x":`${x}%`, "--clip-y":`${y}%`, "--clip-w":`${w}%`, "--clip-h":`${h}%`, "--clip-layer":index + 1 }}>
        {crossfade ? <CrossfadePhoto images={images} index={index} alt={label} paused={visualOnly || open} interval={7500} fadeDuration={4000} onOpen={visualOnly ? undefined : setSelected}/> : <button type="button" className="fashion-album__photo" tabIndex={visualOnly || index >= assembly.placed ? -1 : 0} disabled={visualOnly || index >= assembly.placed} aria-label={`Open ${label}, photograph ${index + 1}`} onClick={() => setSelected(index)}><img src={src} alt={`${label}, photograph ${index + 1}`} loading="eager" draggable={false}/></button>}
      </figure>; })}
      {scrapbook && handwrittenNotes.map((note, index) => <span key={note.text} className={`scrapbook-scribble ${index < assembly.notes ? "is-placed" : "is-waiting"}`} style={{ visibility: index < assembly.notes ? "visible" : "hidden", "--note-arrival":"0ms", left:`${note.x}%`, top:`${note.y}%`, "--note-tilt":`${note.tilt || 0}deg` }}>{note.text}</span>)}
      </div>
    </div>
    {open && createPortal(<dialog ref={dialogRef} className="fashion-album" aria-label={`${label} photo album`} onPointerDown={stop} onWheel={stop} onClick={(event) => { stop(event); if (event.target === event.currentTarget) setSelected(null); }} onCancel={(event) => { event.preventDefault(); setSelected(null); }} onKeyDown={(event) => { stop(event); if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }}>
      <header><p>{label}</p><button type="button" onClick={() => setSelected(null)}>Close album (Esc)</button></header>
      <div className="fashion-album__image" onTouchStart={(event) => { touch.current = event.touches[0].clientX; }} onTouchEnd={(event) => { if (touch.current === null) return; const distance = event.changedTouches[0].clientX - touch.current; touch.current = null; if (Math.abs(distance) > 60) move(distance < 0 ? 1 : -1); }}><img src={images[selected]} alt={`${label}, photograph ${selected + 1}`} draggable={false}/></div>
      <nav aria-label="Album navigation"><button type="button" onClick={() => move(-1)}>Previous</button><span aria-live="polite">{selected + 1} / {images.length}</span><button type="button" onClick={() => move(1)}>Next</button></nav>
    </dialog>, document.body)}
  </>;
}
