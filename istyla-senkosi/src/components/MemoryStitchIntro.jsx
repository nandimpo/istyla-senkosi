import { useEffect, useId, useState } from "react";
import cousinImage from "../assets/images/Cousin/Cousin 1.jpeg";
import beigeThread from "../assets/Chapter 4_Reflection/Textures/Beige_Thread.jpg";
import greenThread from "../assets/Chapter 4_Reflection/Textures/Green_Thread.png";
import redThread from "../assets/Chapter 4_Reflection/Textures/Red_Thread.jpg";
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
const threadAssets = [redThread, beigeThread, greenThread, beigeThread, redThread, greenThread, beigeThread];
function ImageThread({ vertical, src }) {
  const id = useId();
  const maskId = `${id}-crosses`;
  const textureId = `${id}-texture`;
  const colour = src === greenThread ? "#8ba52f" : src === beigeThread ? "#c6ac85" : "#b92d3c";
  const shadow = src === greenThread ? "#465716" : src === beigeThread ? "#6a5439" : "#701a24";
  const paths = [false, true].map((opposite) => Array.from({ length:21 }, (_, index) => {
    const along = 4 + index * 14.6;
    const across = (index % 2 === 0) !== opposite ? 3 : 29;
    return `${index ? "L" : "M"}${along} ${across}`;
  }).join(" "));
  return <svg className="memory-stitch__asset-thread" viewBox={vertical ? "0 0 32 300" : "0 0 300 32"} preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <pattern id={textureId} patternUnits="userSpaceOnUse" width="16" height="8"><image href={src} width="16" height="8" preserveAspectRatio="none" /></pattern>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="32">
        {paths.map((d,index) => <path key={index} d={d} fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />)}
      </mask>
    </defs>
    <g transform={vertical ? "translate(32 0) rotate(90)" : undefined}>
      {paths.map((d,index) => <g key={index} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} stroke={shadow} strokeWidth="3.5" />
        <path d={d} stroke={colour} strokeWidth="2.6" />
        <path d={d} stroke="#f5e2c3" strokeWidth=".45" strokeDasharray="1 2" opacity=".6" />
      </g>)}
      <rect width="300" height="32" fill={`url(#${textureId})`} mask={`url(#${maskId})`} opacity=".6" style={{ mixBlendMode:"screen" }} />
    </g>
  </svg>;
}

export default function MemoryStitchIntro({ track, audioRef, children }) {
  const [finishedCopy, setFinishedCopy] = useState({});
  const copyReady = Object.keys(finishedCopy).length === 4;
  const [stitched, setStitched] = useState(() => new Set());
  const [drawing, setDrawing] = useState(false);
  const [opened, setOpened] = useState(() => {
    try {
      if (sessionStorage.getItem("istyla:reflection:skip-intro") === "true") return true;
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
    {opened ? children : <section className={`memory-stitch ${complete ? "is-complete" : ""}`} data-reading={!copyReady} style={{ "--piece-gap":`${9 * remaining}px` }} onPointerUp={() => setDrawing(false)} onPointerCancel={() => setDrawing(false)}>
    <IntroAmbientAudio id="reflection" track={track} sharedAudioRef={audioRef} />
    <div className="memory-stitch__copy">
      <small><NarrativeText rhythmAudioRef={audioRef} onComplete={() => setFinishedCopy((done) => done[0] ? done : { ...done, [0]: true })} text="04 / REFLECTION · MY JOURNEY" delay={150} /></small>
      <h1><NarrativeText rhythmAudioRef={audioRef} onComplete={() => setFinishedCopy((done) => done[1] ? done : { ...done, [1]: true })} text="PIECE THE" delay={1000} /><em><NarrativeText rhythmAudioRef={audioRef} onComplete={() => setFinishedCopy((done) => done[2] ? done : { ...done, [2]: true })} text="MEMORY TOGETHER." delay={1900} /></em></h1>
      <p><NarrativeText rhythmAudioRef={audioRef} onComplete={() => setFinishedCopy((done) => done[3] ? done : { ...done, [3]: true })} text="I have carried fragments of Ree through every chapter. Draw the thread across each tear and bring the photograph back together." delay={1200} speed={0.18} /></p>
      <strong>{complete ? "The memory is whole." : `${stitched.size} of ${seams.length} seams joined`}</strong>
    </div>
    <div inert={!copyReady} className="memory-stitch__work" aria-label="A torn photograph of Ree waiting to be stitched together">
      <div className="memory-stitch__fragments">
        {fragments.map(([column, row, x, y, angle], index) => <div key={index} className="memory-stitch__fragment" style={{ backgroundImage:`url("${cousinImage}")`, backgroundPosition:`${column * 100}% ${row * 50}%`, "--piece-x":`${x * remaining}px`, "--piece-y":`${y * remaining}px`, "--piece-angle":`${angle * remaining}deg`, "--piece-delay":`${index * 55}ms` }} />)}
      </div>
      <div className="memory-stitch__seams" onPointerLeave={() => setDrawing(false)}>
        {seams.map((seam, index) => <button disabled={!copyReady} key={seam.id} type="button" className={`memory-stitch__seam ${seam.className} ${stitched.has(seam.id) ? "is-done" : ""}`} aria-label={seam.label} aria-pressed={stitched.has(seam.id)} onPointerDown={(event) => { event.preventDefault(); setDrawing(true); stitch(seam.id); }} onPointerEnter={() => { if (drawing) stitch(seam.id); }} onClick={() => stitch(seam.id)}><span>STITCH</span>{stitched.has(seam.id) && <ImageThread src={threadAssets[index]} vertical={seam.className.includes("vertical")} />}</button>)}
      </div>
    </div>
    <p className="memory-stitch__instruction"><span className="memory-stitch__needle" aria-hidden="true" /><span>{copyReady ? "DRAG ACROSS THE SEAMS, OR SELECT EACH TEAR" : "READ TO UNLOCK THE STITCHING"}</span></p>
  </section>}
  </>;
}
