import { useEffect, useState } from "react";
import cousinImage from "../assets/images/Cousin/Cousin 1.jpeg";
import NarrativeText from "./NarrativeText";
import IntroAmbientAudio from "./IntroAmbientAudio";
import "../styles/MemoryStitchIntro.css";
import "../styles/MemoryStitchOrganic.css";

const seams = [
  { id: "v1", className: "vertical seam-v1", label: "Stitch the upper centre seam" },
  { id: "v2", className: "vertical seam-v2", label: "Stitch the middle centre seam" },
  { id: "v3", className: "vertical seam-v3", label: "Stitch the lower centre seam" },
  { id: "h1", className: "horizontal seam-h1", label: "Stitch the upper left seam" },
  { id: "h2", className: "horizontal seam-h2", label: "Stitch the upper right seam" },
  { id: "h3", className: "horizontal seam-h3", label: "Stitch the lower left seam" },
  { id: "h4", className: "horizontal seam-h4", label: "Stitch the lower right seam" },
];

const fragments = [
  [0, 0, -13, -10, -2.4], [1, 0, 12, -14, 2.1],
  [0, 1, -16, 1, 1.4], [1, 1, 14, 7, -1.8],
  [0, 2, -9, 15, -1.2], [1, 2, 15, 12, 2.3],
];
const threadColours = ["#d62e3b", "#e8d6b2", "#1c8e87", "#ef9e91", "#183d80", "#cf2633", "#f0dcc3"];

export default function MemoryStitchIntro({ track, audioRef, children }) {
  const [finishedCopy, setFinishedCopy] = useState({});
  const copyReady = Object.keys(finishedCopy).length === 4;
  const [stitched, setStitched] = useState(() => new Set());
  const [drawing, setDrawing] = useState(false);
  const [opened, setOpened] = useState(() => {
    try {
      const savedPage = JSON.parse(sessionStorage.getItem("istyla:reflection:page"));
      return Number.isInteger(savedPage) && savedPage > 0;
    } catch { return false; }
  });
  const complete = stitched.size === seams.length;
  const stitchProgress = stitched.size / seams.length;
  const remaining = 1 - stitchProgress;
  const stitch = (id) => setStitched((current) => current.has(id) ? current : new Set([...current, id]));

  useEffect(() => {
    if (!complete) return undefined;
    const timer = setTimeout(() => setOpened(true), 2200);
    return () => clearTimeout(timer);
  }, [complete]);


  return <>
    {track && <audio ref={audioRef} src={track} loop preload="metadata" aria-hidden="true" />}
    {opened ? children : <section className={`memory-stitch ${complete ? "is-complete" : ""}`} style={{ "--piece-gap":`${9 * remaining}px` }} onPointerUp={() => setDrawing(false)} onPointerCancel={() => setDrawing(false)}>
    <IntroAmbientAudio id="reflection" track={track} sharedAudioRef={audioRef} />
    <div className="memory-stitch__copy">
      <small><NarrativeText onComplete={() => setFinishedCopy((done) => done[0] ? done : { ...done, [0]: true })} text="04 / REFLECTION · JAMA’S JOURNEY" delay={150} /></small>
      <h1><NarrativeText onComplete={() => setFinishedCopy((done) => done[1] ? done : { ...done, [1]: true })} text="PIECE THE" delay={1000} /><em><NarrativeText onComplete={() => setFinishedCopy((done) => done[2] ? done : { ...done, [2]: true })} text="MEMORY TOGETHER." delay={1900} /></em></h1>
      <p><NarrativeText onComplete={() => setFinishedCopy((done) => done[3] ? done : { ...done, [3]: true })} text="I have carried fragments of Ree through every chapter. Draw the thread across each tear and bring the photograph back together." delay={3300} /></p>
      <strong>{complete ? "The memory is whole." : `${stitched.size} of ${seams.length} seams joined`}</strong>
    </div>
    <div inert={!copyReady} className="memory-stitch__work" aria-label="A torn photograph of Ree waiting to be stitched together">
      <div className="memory-stitch__fragments">
        {fragments.map(([column, row, x, y, angle], index) => <div key={index} className="memory-stitch__fragment" style={{ backgroundImage:`url("${cousinImage}")`, backgroundPosition:`${column * 100}% ${row * 50}%`, "--piece-x":`${x * remaining}px`, "--piece-y":`${y * remaining}px`, "--piece-angle":`${angle * remaining}deg`, "--piece-delay":`${index * 55}ms` }} />)}
      </div>
      <div className="memory-stitch__seams" onPointerLeave={() => setDrawing(false)}>
        {seams.map((seam, index) => <button disabled={!copyReady} key={seam.id} type="button" className={`memory-stitch__seam ${seam.className} ${stitched.has(seam.id) ? "is-done" : ""}`} aria-label={seam.label} aria-pressed={stitched.has(seam.id)} style={{ "--thread-colour":threadColours[index] }} onPointerDown={(event) => { event.preventDefault(); setDrawing(true); stitch(seam.id); }} onPointerEnter={() => { if (drawing) stitch(seam.id); }} onClick={() => stitch(seam.id)}><span>STITCH</span></button>)}
      </div>
      <div className="memory-stitch__needle" aria-hidden="true" />
    </div>
    <p className="memory-stitch__instruction">{copyReady ? "DRAG ACROSS THE SEAMS, OR SELECT EACH TEAR" : "READ TO UNLOCK THE STITCHING"}</p>
  </section>}
  </>;
}
