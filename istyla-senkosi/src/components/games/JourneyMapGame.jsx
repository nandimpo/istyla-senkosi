import JourneyMemory from "./JourneyMemory";
import { useSessionState } from "../../hooks/useSessionState";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { MAP_VIEW, STOPS, advanceProgress, clampProgress, routePath, routePoint, travelledPath } from "./journeyMapData";
import "../../styles/JourneyMapGame.css";
import SowetoArrivalClip from "./SowetoArrivalClip";

function JourneyMapGame({ mapImage, onComplete }) {
  const [progress, setProgress] = useSessionState("map:progress", 0, (value) => Number.isFinite(value) && value >= 0 && value <= 1);
  const [closedStop, setClosedStop] = useState(null);
  const [memories, setMemories] = useState([]);
  const memorySerial = useRef(0);
  const remember = (stop) => {
    const memory = { stop, key: ++memorySerial.current };
    setMemories((items) => [...items, memory]);
  };
  const finishMemory = useCallback(() => setMemories((items) => items.slice(1)), []);
  const [entering, setEntering] = useState(false);
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const { reducedMotion, setNavigationLocked } = useNavigation();
  const calm = reducedMotion || systemReduced;
  const drag = useRef(null);
  const progressRef = useRef(progress);
  const sliderRef = useRef(null);
  const viewportRef = useRef(null);
  const hoverFrame = useRef(null);
  const activeIndex = progress >= 1 ? 2 : progress >= 0.5 ? 1 : 0;
  const activeStop = STOPS[activeIndex];
  const cardOpen = closedStop !== activeStop.id;
  const ready = progress >= 1;
  const point = routePoint(progress);

  useEffect(() => () => cancelAnimationFrame(hoverFrame.current), []);

  const resetHover = () => {
    cancelAnimationFrame(hoverFrame.current);
    const viewport = viewportRef.current;
    if (!viewport) return;
    for (const property of ["--hover-x", "--hover-y", "--hover-lift", "--light-x", "--light-y", "--light-opacity"]) {
      viewport.style.removeProperty(property);
    }
  };
  const hoverMap = (event) => {
    if (calm || entering || drag.current || event.buttons || event.pointerType !== "mouse") return;
    const viewport = viewportRef.current;
    const bounds = viewport.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    cancelAnimationFrame(hoverFrame.current);
    hoverFrame.current = requestAnimationFrame(() => {
      viewport.style.setProperty("--hover-x", "0deg");
      viewport.style.setProperty("--hover-y", "0deg");
      viewport.style.setProperty("--hover-lift", "0px");
      viewport.style.setProperty("--light-x", `${50 + x * 35}%`);
      viewport.style.setProperty("--light-y", `${50 + y * 35}%`);
      viewport.style.setProperty("--light-opacity", "0.2");
    });
  };

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (event) => setSystemReduced(event.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);


  const move = (requested, pauseAtStop = true) => {
    if (entering) return;
    const next = pauseAtStop ? advanceProgress(progressRef.current, requested) : clampProgress(requested);
    const previousIndex = progressRef.current >= 1 ? 2 : progressRef.current >= .5 ? 1 : 0;
    const nextIndex = next >= 1 ? 2 : next >= .5 ? 1 : 0;
    if (nextIndex !== previousIndex) {
      const direction = nextIndex > previousIndex ? 1 : -1;
      for (let stop = previousIndex + direction; stop !== nextIndex + direction; stop += direction) remember(stop);
    }
    progressRef.current = next;
    setProgress(next);
    return next;
  };
  const selectStop = (index) => {
    if (index === activeIndex) remember(index);
    move(STOPS[index].progress, false);
    setClosedStop(null);
  };
  const pointerDown = (event) => {
    if (entering || (event.pointerType === "mouse" && event.button !== 0)) return;
    event.preventDefault();
    event.stopPropagation();
    cancelAnimationFrame(hoverFrame.current);
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    const bounds = event.currentTarget.ownerSVGElement.getBoundingClientRect();
    drag.current = { y: event.clientY, progress: progressRef.current, range: Math.max(130, bounds.height * 0.42) };
  };
  const pointerMove = (event) => {
    if (!drag.current) return;
    const requested = drag.current.progress + (event.clientY - drag.current.y) / drag.current.range;
    event.preventDefault();
    event.stopPropagation();
    move(requested, false);
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
  const cameraStyle = calm ? {} : {
    "--camera-scale": 1 + progress * 0.12,
    "--camera-x": `${progress * 2.5}%`,
    "--camera-y": `${progress * -4}%`,
    "--float-y": `${progress * -4}px`,
  };

  if (entering) return <SowetoArrivalClip onComplete={onComplete} />;

  return (
    <section className={`journey-stage ${calm ? "journey-calm" : ""} ${ready ? "journey-arrived" : ""} ${entering ? "journey-entering" : ""}`} aria-labelledby="journey-title" style={cameraStyle}>
      <header className="journey-heading">
        <p className="journey-eyebrow">Johannesburg North to Soweto</p>
        <h1 id="journey-title">THE ROUTE<br />THAT BRINGS ME CLOSER<span>.</span></h1>
        <p>I’m Jama. I grew up in Johannesburg North. Since my cousin died, memories of his style have drawn me towards Soweto. Follow the route with me. At each stop, familiar images return, then give way to something I had not noticed.</p>
      </header>
      <div className="journey-layout">
        <div className="journey-map-column">
          <div ref={viewportRef} className="journey-viewport" onPointerMove={hoverMap} onPointerLeave={(event) => { if (!event.buttons) resetHover(); }} onPointerUp={resetHover} onPointerCancel={resetHover}>
            <div className="journey-camera">
              <div className="journey-depth-shadow" aria-hidden="true" />
              <div className="journey-paper" aria-hidden="true" />
              <svg className="journey-map-image" viewBox={MAP_VIEW} aria-hidden="true"><image href={mapImage} width="1920" height="1280" /></svg>
              <div className="journey-map-light" aria-hidden="true" />
              <svg className="journey-route-layer" viewBox={MAP_VIEW} aria-label="Illustrative route from Johannesburg North to Soweto">
                <path className="journey-route-base" d={routePath} />
                <path className="journey-route-glow" d={travelledPath(progress)} />
                <path className="journey-route-lit" d={travelledPath(progress)} />
                {STOPS.map((stop, index) => {
                  const location = routePoint(stop.progress);
                  return <g key={stop.id} className={`journey-map-stop ${progress >= stop.progress ? "reached" : ""} ${index === activeIndex ? "active" : ""}`} role="button" tabIndex={0} aria-label={`Remember ${stop.title}`} onClick={() => selectStop(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); selectStop(index); } }}>
                    <circle className="journey-stop-halo" cx={location.x} cy={location.y} r={index === 2 && ready ? 8 : 5} />
                    <circle className="journey-stop-core" cx={location.x} cy={location.y} r={index === 2 && ready ? 3.5 : 2} />
                    <text x={location.x + stop.label.dx} y={location.y + stop.label.dy} textAnchor={stop.label.dx < 0 ? "end" : "start"}>{index === 0 ? "Johannesburg North" : index === 1 ? "The remembered route" : "Soweto"}</text>
                  </g>;
                })}
                <circle className="journey-traveller-shadow" cx={point.x} cy={point.y + 2} r="4" />
                <circle className="journey-traveller" cx={point.x} cy={point.y} r="3" />
                <circle ref={sliderRef} className="journey-drag-target" cx={point.x} cy={point.y} r="16" tabIndex={entering ? -1 : 0} role="slider"
                  aria-label="Journey marker" aria-describedby="journey-instruction" aria-orientation="vertical"
                  aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}
                  aria-valuetext={`${Math.round(progress * 100)} percent. ${activeStop.title}`} aria-disabled={entering}
                  onClick={(event) => event.stopPropagation()} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={(event) => { event.stopPropagation(); if (drag.current && Math.abs(event.clientY - drag.current.y) < 5) remember(activeIndex); drag.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
                  onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }} onKeyDown={keyDown} />
              </svg>
            </div>
            <span className="journey-map-caption">A personal geography</span>
          </div>
          <div className="journey-controls">
            <p id="journey-instruction">Drag down to retrace the journey to Soweto.<small>Use arrow keys on the marker, or the stop buttons below.</small></p>
            <div className="journey-stop-buttons" aria-label="Journey stops">
              {STOPS.map((stop, index) => <button key={stop.id} disabled={entering} aria-current={index === activeIndex ? "step" : undefined} onClick={() => selectStop(index)}><span>0{index + 1}</span>{stop.title}</button>)}
            </div>
            <small className="journey-map-note">Illustrative route. Locations are approximate on this regional map.</small>
          </div>
        </div>
        <aside className="journey-story-column" aria-label="Journey memories">
          <p className="journey-progress" role="status">{ready ? "You have arrived in Soweto" : `Stop ${activeIndex + 1} of 3. ${activeStop.title}`}</p>
          {cardOpen ? <article className="journey-story-card" key={activeStop.id} aria-labelledby={`story-${activeStop.id}`}>
            <button className="journey-card-close" onClick={closeCard} aria-label="Close narrative card" disabled={entering}>Close</button>
            <span className="journey-story-number">0{activeIndex + 1}</span>
            <h2 id={`story-${activeStop.id}`}>{activeStop.title}</h2>
            <p>{activeStop.text}</p>
            {activeStop.media && <div className="journey-story-media">
              {activeStop.media.image && <img src={activeStop.media.image} alt={activeStop.media.alt || ""} loading="lazy" />}
              {activeStop.media.audio && <audio src={activeStop.media.audio} controls preload="none" aria-label={`${activeStop.title} memory recording`} />}
            </div>}
            {!ready && <button className="journey-continue" onClick={continueJourney} disabled={entering}>Continue the journey <span aria-hidden="true">&rarr;</span></button>}
          </article> : <button className="journey-reopen" onClick={() => setClosedStop(null)} disabled={entering}>Read this memory</button>}
          {ready && <button className="journey-enter" onClick={() => { setNavigationLocked(true); setEntering(true); }} disabled={entering || memories.length > 0}>{entering ? "Entering Soweto..." : "Enter Soweto"}<span aria-hidden="true">&rarr;</span></button>}
        </aside>
      </div>
      {memories.length > 0 && <JourneyMemory key={memories[0].key} stop={memories[0].stop} calm={calm} onDone={finishMemory}/>}
    </section>
  );
}
export default JourneyMapGame;
