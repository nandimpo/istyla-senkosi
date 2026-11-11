import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import NarrativeText from "./NarrativeText";
import IntroAmbientAudio from "./IntroAmbientAudio";
import zipImage from "../assets/Chapter 1_Swenka/Images/Editorial/Zip.jpg";
import "../styles/UnzipIntro.css";

const ZIP_SEGMENTS = 24;
const ZIP_TEXTURE_REPEATS = 1.5;

export default function UnzipIntro({ image, track, nextTrack, audioRef, children }) {
  const [progress, setProgress] = useState(0);
  const [opening, setOpening] = useState(false);
  const [finishedCopy, setFinishedCopy] = useState({});
  const copyReady = Object.keys(finishedCopy).length === 3;
  const [opened, setOpened] = useState(() => {
    try {
      const savedPage = JSON.parse(sessionStorage.getItem("istyla:swenka:page"));
      return Number.isInteger(savedPage) && savedPage > 0;
    } catch { return false; }
  });
  const { reducedMotion } = useNavigation();
  const drag = useRef(null);

  const openingFrom = useRef(0);
  const finish = () => {
    if (opening || !copyReady) return;
    openingFrom.current = progress;
    setOpening(true);
  };
  useEffect(() => {
    if (!opening) return undefined;
    const calm = reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Finish independently of animation frames, which can pause in a busy tab.
    const completion = setTimeout(() => { setProgress(1); setOpened(true); }, calm ? 0 : 2200);
    if (calm) return () => clearTimeout(completion);
    const start = performance.now();
    let animation;
    const tick = (now) => {
      const elapsed = now - start;
      const amount = Math.min(1, elapsed / 1200);
      setProgress(openingFrom.current + (1 - openingFrom.current) * (1 - (1 - amount) ** 2));
      if (amount < 1) animation = requestAnimationFrame(tick);
    };
    animation = requestAnimationFrame(tick);
    return () => { clearTimeout(completion); cancelAnimationFrame(animation); };
  }, [opening, reducedMotion, setOpened]);


  const edge = (side) => Array.from({ length: 41 }, (_, index) => {
    const t = index / 40;
    // The teeth separate above the slider and stay joined below it.
    // A fixed, gently bowed edge follows the pull without oscillating.
    const fold = progress * 28 * (1 - t) ** 1.35;
    return [50 + side * fold, t * (2 + progress * 86)];
  });
  const leftEdge = edge(-1);
  const rightEdge = edge(1);
  const polygon = (points) => points.map(([x, y]) => `${x}% ${y}%`).join(",");
  const zipEdge = (side, y) => {
    const split = 20 + progress * 860;
    return 500 + side * progress * 280 * (1 - Math.min(1, y / split)) ** 1.35;
  };
  // Small image strips follow the same bowed seam as the fabric. The original
  // photograph supplies both rows of teeth; only their positions are animated.
  const zipStrips = (side) => Array.from({ length: ZIP_SEGMENTS }, (_, index) => {
    const y = index * 1000 / ZIP_SEGMENTS;
    const nextY = (index + 1) * 1000 / ZIP_SEGMENTS;
    const x = zipEdge(side, y);
    const nextX = zipEdge(side, nextY);
    return { x, y, length: Math.hypot(nextX - x, nextY - y) + .6,
      angle: -Math.atan2(nextX - x, nextY - y) * 180 / Math.PI,
      sourceY: 160 + (index * 270 * ZIP_TEXTURE_REPEATS / ZIP_SEGMENTS) % 270 };
  });

  return <>
    {track && <audio ref={audioRef} src={track} loop={!nextTrack} preload="metadata" aria-hidden="true" />}
    {opened ? children : <section className={`unzip-intro ${opening ? "is-opening" : ""} ${copyReady ? "is-ready" : "is-reading"}`} aria-label="Unzip the Swenka chapter" style={{ "--zip-progress": progress }}>
    <IntroAmbientAudio id="swenka" volumeScale={0.45} nextTrack={nextTrack} track={track} sharedAudioRef={audioRef} />
    <img className="unzip-preview" src={image} alt="" />
    <div className="unzip-fabric unzip-fabric-left" aria-hidden="true" style={{ clipPath: `polygon(${polygon([[0, 0], ...leftEdge, [50, 100], [0, 100]])})` }} />
    <div className="unzip-fabric unzip-fabric-right" aria-hidden="true" style={{ clipPath: `polygon(${polygon([...rightEdge, [50, 100], [100, 100], [100, 0]])})` }} />
    <svg className="unzip-seams" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
      <defs><image id="swenka-zip-photograph" href={zipImage} width="500" height="500" transform="rotate(.8 250 250)" /></defs>
      {[-1, 1].map((side, index) => <g key={side} className={`unzip-seam unzip-seam--${index}`}>
        {zipStrips(side).map((strip, i) => <svg key={i} x={side < 0 ? -18 : 0} y="0" width="18" height={strip.length}
          viewBox={`${side < 0 ? 240 : 250} ${strip.sourceY} 10 ${270 * ZIP_TEXTURE_REPEATS / ZIP_SEGMENTS + .2}`} preserveAspectRatio="none" overflow="hidden"
          style={{ transform: `translate(${strip.x}px, ${strip.y}px) rotate(${strip.angle}deg)`, transformOrigin: "0 0" }}>
          <use href="#swenka-zip-photograph" />
        </svg>)}
      </g>)}
    </svg>
    <div className="unzip-copy"><p><NarrativeText onComplete={() => setFinishedCopy((done) => done[0] ? done : { ...done, [0]: true })} text="01 / SWENKA" delay={150} /></p><h1><NarrativeText onComplete={() => setFinishedCopy((done) => done[1] ? done : { ...done, [1]: true })} text={"Style starts\nwith a detail."} delay={1100} /></h1><p><NarrativeText onComplete={() => setFinishedCopy((done) => done[2] ? done : { ...done, [2]: true })} text="Pull the zip down to open the chapter." delay={3500} /></p></div>
    <button className="unzip-pull" aria-label={copyReady ? "Unzip Swenka. Drag down or press Enter to open." : "Finish reading the introduction before unzipping."} disabled={opening || !copyReady}
      onPointerDown={(event) => {
        if (!copyReady) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { y: event.clientY, progress, moved: false };
      }}
      onPointerMove={(event) => {
        if (!drag.current || drag.current.released || opening) return;
        const delta = event.clientY - drag.current.y;
        if (Math.abs(delta) > 5) drag.current.moved = true;
        const next = Math.max(0, Math.min(1, drag.current.progress + delta / (window.innerHeight * .75)));
        setProgress(next);
        if (next >= .97) finish();
      }}
      onPointerUp={() => { if (drag.current) drag.current.released = true; }}
      onPointerCancel={() => { drag.current = null; }}
      onClick={(event) => { if (event.detail === 0 || !drag.current?.moved) finish(); drag.current = null; }}>
      <svg className="unzip-photo-pull" viewBox="221 64 55 100" aria-hidden="true"><defs><clipPath id="swenka-zip-pull-crop"><path d="M244 65 L254 66 L263 72 L264 83 L270 107 L284 150 L280 157 L255 162 L248 159 L241 108 L239 100 L233 89 L232 78 L237 71 Z" /></clipPath></defs><g transform="rotate(15 247 75)"><g clipPath="url(#swenka-zip-pull-crop)"><image href={zipImage} width="500" height="500" transform="rotate(.8 250 250)" /></g></g></svg>
    </button>
    <button className="unzip-open" onClick={finish} disabled={opening || !copyReady}>{opening ? "Opening Swenka..." : copyReady ? "Unzip to enter" : "Read to unlock"}<span aria-hidden="true">{copyReady ? "\u2193" : "\u2026"}</span></button>
  </section>}
  </>;
}

