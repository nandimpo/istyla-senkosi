import { useSessionState } from "../../hooks/useSessionState";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { MAP_VIEW, STOPS, advanceProgress, clampProgress, routePath, routePoint, travelledPath } from "./journeyMapData";
import "../../styles/JourneyMapGame.css";
import SowetoArrivalClip from "./SowetoArrivalClip";

const fashionPhotographs = import.meta.glob("../../assets/Additional Images/Johannesburg fashion/**/*.{jpg,jpeg,png,webp}", { eager: true, query: "?url", import: "default" });
const MEMORY_COPY = {
  Beginning: ["THE CITY I KNEW", "A familiar look, seen again while I search for the beginning of Ree’s story."],
  Middle: ["BETWEEN PLACES", "A detail from the journey that makes me pause and look beyond the clothes."],
  Soweto: ["LOOKING CLOSER", "A fashion memory from Soweto, bringing me nearer to the world Ree knew."],
};
const MEMORY_KICKERS = { Beginning: "JOHANNESBURG NORTH", Middle: "ALONG THE ROUTE", Soweto: "SOWETO" };
const MAP_MEMORIES = Object.entries(fashionPhotographs).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([path, src], index) => {
  const folder = ["Beginning", "Middle", "Soweto"].find((name) => path.includes(`/${name}/`)) || "Middle";
  const column = index % 7;
  const row = Math.floor(index / 7) % 4;
  return {
    id: path,
    src,
    folder,
    kicker: MEMORY_KICKERS[folder],
    title: MEMORY_COPY[folder][0],
    text: MEMORY_COPY[folder][1],
    x: 650 + column * 78 + ((index * 17) % 19) - 9,
    y: 910 + row * 68 + ((index * 11) % 15) - 7,
    tilt: [-5, 3, -2, 4, -4, 2, 1][index % 7],
  };
});

function JourneyMapGame({ mapImage, onComplete }) {
  const [progress, setProgress] = useSessionState("map:progress", 0, (value) => Number.isFinite(value) && value >= 0 && value <= 1);
  const [closedStop, setClosedStop] = useState(null);
  const [entering, setEntering] = useState(false);
  const [showArrivalClip, setShowArrivalClip] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const { reducedMotion, setNavigationLocked } = useNavigation();
  const calm = reducedMotion || systemReduced;
  const drag = useRef(null);
  const progressRef = useRef(progress);
  const sliderRef = useRef(null);
  const activeIndex = progress >= 1 ? 2 : progress >= 0.5 ? 1 : 0;
  const activeStop = STOPS[activeIndex];
  const cardOpen = closedStop !== activeStop.id;
  const ready = progress >= 1;
  const point = routePoint(progress);

  useEffect(() => {
    if (!entering) return undefined;
    const timer = setTimeout(() => setShowArrivalClip(true), calm ? 0 : 1800);
    return () => clearTimeout(timer);
  }, [entering, calm]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (event) => setSystemReduced(event.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);


  const move = (requested, pauseAtStop = true) => {
    if (entering) return progressRef.current;
    const next = pauseAtStop ? advanceProgress(progressRef.current, requested) : clampProgress(requested);
    const previousIndex = progressRef.current >= 1 ? 2 : progressRef.current >= .5 ? 1 : 0;
    const nextIndex = next >= 1 ? 2 : next >= .5 ? 1 : 0;
    if (nextIndex !== previousIndex) setClosedStop(null);
    progressRef.current = next;
    setProgress(next);
    return next;
  };
  const selectStop = (index) => {
    if (index > activeIndex + 1) return;
    move(STOPS[index].progress, false);
    setClosedStop(null);
  };
  const pointerDown = (event) => {
    if (entering || (event.pointerType === "mouse" && event.button !== 0)) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    const bounds = event.currentTarget.ownerSVGElement.getBoundingClientRect();
    drag.current = { y: event.clientY, progress: progressRef.current, stopIndex: activeIndex, range: Math.max(130, bounds.height * 0.42) };
  };
  const pointerMove = (event) => {
    if (!drag.current) return;
    const requested = drag.current.progress + (event.clientY - drag.current.y) / drag.current.range;
    event.preventDefault();
    event.stopPropagation();
    const next = move(requested, true);
    const nextIndex = next >= 1 ? 2 : next >= .5 ? 1 : 0;
    if (nextIndex !== drag.current?.stopIndex) {
      drag.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const keyDown = (event) => {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.key === "Home") move(0);
    else if (event.key === "End") move(1, false);
    else move(progressRef.current + (["ArrowDown", "ArrowRight"].includes(event.key) ? 0.05 : -0.05));
  };
  const continueJourney = () => {
    move(STOPS[Math.min(2, activeIndex + 1)].progress);
    setClosedStop(null);
    sliderRef.current?.focus();
  };
  const closeCard = () => {
    setClosedStop(activeStop.id);
    sliderRef.current?.focus();
  };
  if (showArrivalClip) return <SowetoArrivalClip onComplete={onComplete} />;

  return (
    <section className={`journey-stage ${calm ? "journey-calm" : ""} ${ready ? "journey-arrived" : ""} ${entering ? "journey-entering" : ""}`} aria-labelledby="journey-title">
      <header className="journey-heading">
        <p className="journey-eyebrow">A MAP, UNFOLDED</p>
        <h1 id="journey-title">TRACES OF REE<span>.</span></h1>
        <p>I pick up the map and let my eyes wander beyond the city I know. In its streets, clothes and photographs, I look for traces of Ree. Explore the pins, then follow the gold thread with me towards Soweto.</p>
      </header>
      <div className="journey-layout">
        <div className="journey-map-column">
          <div className="journey-viewport" onPointerDown={(event) => event.stopPropagation()} onWheel={(event) => event.stopPropagation()} onDragStart={(event) => event.preventDefault()}>
            <div className="journey-camera">
              <div className="journey-depth-shadow" aria-hidden="true" />
              <div className="journey-paper" aria-hidden="true" />
              <svg className="journey-map-image" viewBox={MAP_VIEW} aria-hidden="true"><image href={mapImage} width="1920" height="1280" /></svg>
              <div className="journey-map-light" aria-hidden="true" />
              <svg className="journey-route-layer" viewBox={MAP_VIEW} aria-label="Illustrative route from Johannesburg North to Soweto">
                {MAP_MEMORIES.map((memory) => <g key={memory.id} className={`journey-map-photo ${selectedMemory?.id === memory.id ? "selected" : ""}`} role="button" tabIndex={0} aria-label={`Open fashion memory: ${memory.title}`} transform={`translate(${memory.x} ${memory.y})`} onClick={(event) => { event.stopPropagation(); setSelectedMemory(memory); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); setSelectedMemory(memory); } }}>
                  <circle r="7" />
                  <path d="M-3.5 -1.5 H3.5 V3 H-3.5 Z M-1.5 -3.5 H1.5 L2.5 -1.5 H-2.5 Z" />
                </g>)}
                <path className="journey-route-base" d={routePath} />
                <path className="journey-route-glow" d={travelledPath(progress)} />
                <path className="journey-route-lit" d={travelledPath(progress)} />
                {STOPS.map((stop, index) => {
                  const location = routePoint(stop.progress);
                  return <g key={stop.id} className={`journey-map-stop ${progress >= stop.progress ? "reached" : ""} ${index === activeIndex ? "active" : ""} ${index > activeIndex + 1 ? "locked" : ""}`} role="button" tabIndex={index > activeIndex + 1 ? -1 : 0} aria-disabled={index > activeIndex + 1} aria-label={`Remember ${stop.title}`} onClick={() => selectStop(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); selectStop(index); } }}>
                    <path className="journey-stop-pin-stem" d={`M${location.x} ${location.y - 1} V${location.y + 9}`} />
                    <circle className="journey-stop-pin" cx={location.x} cy={location.y - 4} r="6" />
                    <circle className="journey-stop-pin-core" cx={location.x} cy={location.y - 4} r="2" />
                    <text x={location.x + stop.label.dx} y={location.y + stop.label.dy} textAnchor={stop.label.dx < 0 ? "end" : "start"}>{index === 0 ? "HOME" : index === 1 ? "A MEMORY" : "SOWETO"}</text>
                  </g>;
                })}
                <circle className="journey-traveller-shadow" cx={point.x} cy={point.y + 2} r="4" />
                <circle className="journey-drag-pulse" cx={point.x} cy={point.y} r="7" />
                <circle className="journey-traveller" cx={point.x} cy={point.y} r="3" />
                <circle ref={sliderRef} className="journey-drag-target" cx={point.x} cy={point.y} r="16" tabIndex={entering ? -1 : 0} role="slider"
                  aria-label="Journey marker" aria-describedby="journey-instruction" aria-orientation="vertical"
                  aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}
                  aria-valuetext={`${Math.round(progress * 100)} percent. ${activeStop.title}`} aria-disabled={entering}
                  onClick={(event) => event.stopPropagation()} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={(event) => { event.stopPropagation(); drag.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
                  onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }} onKeyDown={keyDown} />
              </svg>
            </div>
            {selectedMemory && <article className="journey-pin-card journey-photo-card">
              <button className="journey-pin-close" onClick={() => setSelectedMemory(null)} aria-label="Close fashion memory">×</button>
              <img src={selectedMemory.src} alt={`Fashion memory from ${selectedMemory.folder}`} />
              <div><small>{selectedMemory.kicker}</small><h2>{selectedMemory.title}</h2><p>{selectedMemory.text}</p></div>
            </article>}
            <span className="journey-map-caption">A personal geography</span>
          </div>
          <div className="journey-controls">
            <p id="journey-instruction">Follow the gold thread towards Soweto.<small>Open the green pins to explore. Drag the glowing circle to travel along the gold thread.</small></p>
            <div className="journey-stop-buttons" aria-label="Journey stops">
              {STOPS.map((stop, index) => <button key={stop.id} disabled={entering || index > activeIndex + 1} aria-current={index === activeIndex ? "step" : undefined} onClick={() => selectStop(index)}><span>0{index + 1}</span>{stop.title}</button>)}
            </div>
            <small className="journey-map-note">Choose the next pin. Each stop opens another part of the memory.</small>
          </div>
        </div>
        <aside className="journey-story-column" aria-label="Journey memories">
          <p className="journey-progress" role="status">{ready ? "SOWETO, AT LAST" : `A MEMORY SURFACES — ${activeStop.title}`}</p>
          {cardOpen ? <article className="journey-story-card" key={activeStop.id} aria-labelledby={`story-${activeStop.id}`}>
            <button className="journey-card-close" onClick={closeCard} aria-label="Close narrative card" disabled={entering}>Back to map</button>
            <span className="journey-story-number">0{activeIndex + 1}</span>
            <h2 id={`story-${activeStop.id}`}>{activeStop.title}</h2>
            <p>{activeStop.text}</p>
            {activeStop.media && <div className="journey-story-media">
              {activeStop.media.image && <img src={activeStop.media.image} alt={activeStop.media.alt || ""} loading="lazy" />}
              {activeStop.media.audio && <audio src={activeStop.media.audio} controls preload="none" aria-label={`${activeStop.title} memory recording`} />}
            </div>}
            {!ready && <button className="journey-continue" onClick={continueJourney} disabled={entering}>Follow the thread <span aria-hidden="true">&rarr;</span></button>}
          </article> : <button className="journey-reopen" onClick={() => setClosedStop(null)} disabled={entering}>Read this memory</button>}
          {ready && <button className="journey-enter" onClick={() => { setNavigationLocked(true); setEntering(true); }} disabled={entering}>{entering ? "Entering Soweto..." : "Enter Soweto"}<span aria-hidden="true">&rarr;</span></button>}
        </aside>
      </div>
    </section>
  );
}
export default JourneyMapGame;
