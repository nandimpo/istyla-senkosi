import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const photographs = import.meta.glob("../../assets/Additional Images/Johannesburg fashion/**/*.{jpg,jpeg,png,webp}", { eager: true, query: "?url", import: "default" });
const folders = ["Beginning", "Middle", "Soweto"];
const captions = ["The city I thought I knew", "Between what I knew and what I missed", "Looking again, with my cousin in mind"];
export default function JourneyMemory({ stop, calm, onDone }) {
  const titleId = useId();
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);
  const remaining = useRef(14000);
  const enlarged = selected !== null;
  const images = Object.entries(photographs).filter(([path]) => path.includes(`/${folders[stop]}/`)).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric:true }));
  useEffect(() => {
    if (enlarged) return;
    const start = performance.now();
    const timer = setTimeout(onDone, remaining.current);
    return () => { clearTimeout(timer); remaining.current = Math.max(0, remaining.current - (performance.now() - start)); };
  }, [onDone, enlarged]);
  useEffect(() => {
    if (!enlarged) return;
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => { dialog.close(); previousFocus?.focus(); };
  }, [enlarged]);
  const nameOf = (path) => path.split("/").at(-1).replace(/\.[^.]+$/, "");
  return <aside className={`journey-memory ${calm ? "journey-memory--calm" : ""}`} aria-labelledby={titleId} style={{ animationPlayState: enlarged ? "paused" : "running" }}>
    <div className="journey-memory__heading"><small>JAMA / A MEMORY ALONG THE WAY</small><h2 id={titleId}>{captions[stop]}</h2></div>
    <div className="journey-memory__collage">{images.map(([path, src], index) => <figure key={path} style={{ "--memory-tilt": `${[-5,3,-2,4,-3,2,1][index]}deg`, "--memory-delay": `${index * 90}ms` }}><button type="button" className="journey-memory__photo" aria-label={`Enlarge ${nameOf(path)}`} onClick={() => setSelected(index)}><img src={src} alt={`${folders[stop]} fashion memory: ${nameOf(path)}`} draggable={false}/><span>View full image</span></button></figure>)}</div>
    <button type="button" onClick={onDone}>Return to the route</button>
    {enlarged && createPortal(<dialog ref={dialogRef} className="journey-photo-viewer" aria-label="Enlarged fashion photograph" onCancel={(event) => { event.preventDefault(); setSelected(null); }} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }} onKeyDown={(event) => { event.stopPropagation(); if (event.key === "ArrowRight") { event.preventDefault(); setSelected((selected + 1) % images.length); } if (event.key === "ArrowLeft") { event.preventDefault(); setSelected((selected + images.length - 1) % images.length); } }}>
      <button type="button" className="journey-photo-viewer__close" onClick={() => setSelected(null)}>Close image (Esc)</button>
      <img src={images[selected][1]} alt={`${folders[stop]} fashion memory: ${nameOf(images[selected][0])}`}/>
      <div className="journey-photo-viewer__controls"><button type="button" onClick={() => setSelected((selected + images.length - 1) % images.length)}>Previous</button><span aria-live="polite">{selected + 1} / {images.length}</span><button type="button" onClick={() => setSelected((selected + 1) % images.length)}>Next</button></div>
    </dialog>, document.body)}
  </aside>;
}
