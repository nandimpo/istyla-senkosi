import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import NarrativeText from "./NarrativeText";
import IntroAmbientAudio from "./IntroAmbientAudio";
import "../styles/UnzipIntro.css";

export default function UnzipIntro({ image, track, audioRef, children }) {
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
    const start = performance.now();
    let animation;
    const tick = (now) => {
      const elapsed = now - start;
      const amount = Math.min(1, elapsed / 1200);
      setProgress(openingFrom.current + (1 - openingFrom.current) * (1 - (1 - amount) ** 2));
      if (calm || elapsed >= 2200) setOpened(true);
      else animation = requestAnimationFrame(tick);
    };
    animation = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation);
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
  const seam = (points, offset = 0) => `M ${points.map(([x, y]) => `${x * 10 + offset},${y * 10}`).join(" L ")} L ${500 + offset},1000`;

  return <>
    {track && <audio ref={audioRef} src={track} loop preload="metadata" aria-hidden="true" />}
    {opened ? children : <section className={`unzip-intro ${opening ? "is-opening" : ""} ${copyReady ? "is-ready" : "is-reading"}`} aria-label="Unzip the Swenka chapter" style={{ "--zip-progress": progress }}>
    <IntroAmbientAudio id="swenka" track={track} sharedAudioRef={audioRef} />
    <img className="unzip-preview" src={image} alt="" />
    <div className="unzip-fabric unzip-fabric-left" aria-hidden="true" style={{ clipPath: `polygon(${polygon([[0, 0], ...leftEdge, [50, 100], [0, 100]])})` }} />
    <div className="unzip-fabric unzip-fabric-right" aria-hidden="true" style={{ clipPath: `polygon(${polygon([...rightEdge, [50, 100], [100, 100], [100, 0]])})` }} />
    <svg className="unzip-seams" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
      {[leftEdge, rightEdge].map((points, index) => {
        const side = index === 0 ? -1 : 1;
        return <g key={index} className={`unzip-seam unzip-seam--${index}`}>
          <path className="unzip-seam-tape" d={seam(points, side * 13)} />
          <path className="unzip-seam-weave" d={seam(points, side * 13)} />
          <path className="unzip-seam-stitch" d={seam(points, side * 23)} />
          <path className="unzip-seam-coil" d={seam(points, side * 4)} />
          <path className="unzip-seam-teeth" d={seam(points, side * 3)} />
          <path className="unzip-seam-glint" d={seam(points, side * 3)} />
        </g>;
      })}
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
      <span className="unzip-slider" aria-hidden="true" /><span className="unzip-ring" aria-hidden="true" />
    </button>
    <button className="unzip-open" onClick={finish} disabled={opening || !copyReady}>{opening ? "Opening Swenka..." : copyReady ? "Unzip to enter" : "Read to unlock"}<span aria-hidden="true">{copyReady ? "\u2193" : "\u2026"}</span></button>
  </section>}
  </>;
}

