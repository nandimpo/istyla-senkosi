import { useSessionState } from "../../hooks/useSessionState";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { MAP_VIEW, STOPS, advanceProgress, clampProgress, routePath, routePoint as sourceRoutePoint, travelledPath } from "./journeyMapData";
import "../../styles/JourneyMapGame.css";
import SowetoArrivalClip from "./SowetoArrivalClip";
import silhouetteSketch from "../../assets/Introduction/Images/Sketch 1.jpg";
import shoeSketch from "../../assets/Introduction/Images/Shoe_Sketch.jpg";
import floralSketch from "../../assets/Introduction/Images/Sketch_2.jpg";
import drapedSketch from "../../assets/Introduction/Images/Sketch_3.jpg";
import textileSketch from "../../assets/Introduction/Images/Sketch_4.jpg";
import platformSketch from "../../assets/Introduction/Images/Shoe sketch_2.jpg";
import { PHOTO_MEMORIES, GROUP_PHOTO_MEMORIES } from "./journeyPhotoMemories";

const fashionPhotographs = import.meta.glob("../../assets/Additional Images/Johannesburg fashion/**/*.{jpg,jpeg,png,webp}", { eager: true, query: "?url", import: "default" });
const MEMORY_COPY = {
  Beginning: ["THE CITY I KNEW", "A familiar look, seen again while I search for the beginning of Ree’s story."],
  Middle: ["BETWEEN PLACES", "A detail from the journey that makes me pause and look beyond the clothes."],
  Soweto: ["LOOKING CLOSER", "A fashion memory from Soweto, bringing me nearer to the world Ree knew."],
};
const MEMORY_KICKERS = { Beginning: "JOHANNESBURG NORTH", Middle: "ALONG THE ROUTE", Soweto: "SOWETO" };
const MEMORY_GROUPS = {
  Beginning: { name: "Home", thread: "home", label: [790, 930] },
  Middle: { name: "Memory", thread: "memory", label: [948, 930] },
  Soweto: { name: "Soweto", thread: "soweto", label: [790, 1072] },
};
// Deliberately staggered across the atlas, leaving space around the journey.
const PHOTO_POSITIONS = {
  Beginning: [[800, 953], [842, 951], [800, 999], [841, 998], [794, 1040], [864, 1038]],
  Middle: [[964, 953], [1006, 958], [1051, 950], [964, 1004], [990, 1006], [1045, 997], [1055, 1050]],
  Soweto: [[795, 1110], [849, 1099], [892, 1112], [938, 1100], [980, 1112], [1020, 1094], [1058, 1114]],
};
const MAP_MEMORIES = Object.entries(fashionPhotographs).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([path, src], index) => {
  const folder = ["Beginning", "Middle", "Soweto"].find((name) => path.includes(`/${name}/`)) || "Middle";
  const group = ["Beginning", "Middle", "Soweto"].indexOf(folder);
  const siblings = Object.keys(fashionPhotographs).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).filter((key) => key.includes(`/${folder}/`));
  const position = siblings.indexOf(path);
  const filename = path.split("/").pop();
  const reflection = folder === "Soweto" && ["5.jpg", "6.jpg"].includes(filename)
    ? GROUP_PHOTO_MEMORIES.Soweto[filename === "5.jpg" ? 0 : 1]
    : PHOTO_MEMORIES[filename] || MEMORY_COPY[folder];
  return {
    id: path,
    src,
    folder,
    kicker: MEMORY_KICKERS[folder],
    title: reflection[0],
    text: reflection[1],
    reference: `${group + 1}.${position + 1}`,
    x: PHOTO_POSITIONS[folder][position][0],
    y: PHOTO_POSITIONS[folder][position][1],
    scale: 1.1,
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
  const cameraRef = useRef(null);
  const [atlasWidth, setAtlasWidth] = useState(300);
  // Spread positions across the actual container without stretching photographs or writing.
  const spreadX = (x) => 930 + (x - 930) * atlasWidth / 300;
  const mapView = atlasWidth === 300 ? MAP_VIEW : `${930 - atlasWidth / 2} 920 ${atlasWidth} 220`;
  const routePoint = (value) => { const point = sourceRoutePoint(value); return { ...point, x: spreadX(point.x) }; };
  const spreadPath = (path) => path.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${spreadX(Number(x))} ${y}`);
  const activeIndex = progress >= 1 ? 2 : progress >= 0.5 ? 1 : 0;
  const activeStop = STOPS[activeIndex];
  const cardOpen = closedStop !== activeStop.id;
  const ready = progress >= 1;
  const point = routePoint(progress);

  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (height > 0) setAtlasWidth(Math.max(300, 220 * width / height));
    });
    observer.observe(camera);
    return () => observer.disconnect();
  }, [showArrivalClip]);

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
        <p className="journey-eyebrow">FIELD NOTES / 001 — A MAP, UNFOLDED</p>
        <h1 id="journey-title">TRACES OF REE<span>.</span></h1>
        <p>I thought being his cousin meant I knew him. Now I lay out these photographs and wonder how much I never asked. I follow a collar, a colour, the care in a pair of shoes. Somewhere between home and Soweto, I’m looking for the parts of Ree I didn’t know how to see.</p>
      </header>
      <div className="journey-layout">
        <div className="journey-map-column">
          <p className="journey-explore-note">20 photographs / a personal atlas<span>Explore the photographs. On smaller screens, swipe across the map.</span></p>
          <div className="journey-viewport" tabIndex={0} role="region" aria-label="Fashion atlas with 20 photographs. Scroll horizontally on smaller screens to explore." onPointerDown={(event) => event.stopPropagation()} onDragStart={(event) => event.preventDefault()}>
            <div className="journey-camera" ref={cameraRef}>
              <div className="journey-depth-shadow" aria-hidden="true" />
              <div className="journey-paper" aria-hidden="true" />
              <svg className="journey-map-image" viewBox={mapView} aria-hidden="true"><image href={mapImage} width="1920" height="1280" /></svg>
              <div className="journey-map-light" aria-hidden="true" />
              <svg className="journey-route-layer" viewBox={mapView} aria-label="Illustrative route from Johannesburg North to Soweto">
                <g className="journey-drafting" aria-hidden="true">
                  <path d="M820 960H980 M820 1100H980 M890 960V1100 M825 1005H980 M825 1045H980" />
                  <text x="821" y="964">N ↑</text><text x="945" y="1097">NOT TO SCALE</text>
                </g>
                {Object.entries(MEMORY_GROUPS).map(([folder, group]) => <g key={folder} className={`journey-cluster-label journey-thread-${group.thread}`} transform={`translate(${spreadX(group.label[0])} ${group.label[1]})`}><path d="M0 -1H12" /><text x="15" y="0" transform="rotate(-3 15 0)">{group.name}</text><path className="journey-label-underline" d={`M15 2 Q25 3 ${folder === "Beginning" ? 34 : 43} 1.5`} /></g>)}
                {MAP_MEMORIES.map((memory) => <path key={memory.id} className={`journey-reference-line journey-thread-${MEMORY_GROUPS[memory.folder].thread}`} d={`M${spreadX(memory.x)} ${memory.y} Q${spreadX((memory.x + 900) / 2)} ${memory.y + 12} ${routePoint([0, .5, 1][["Beginning", "Middle", "Soweto"].indexOf(memory.folder)]).x} ${routePoint([0, .5, 1][["Beginning", "Middle", "Soweto"].indexOf(memory.folder)]).y}`} />)}
                {MAP_MEMORIES.map((memory) => <g key={memory.id} className={`journey-map-photo ${selectedMemory?.id === memory.id ? "selected" : ""}`} role="button" tabIndex={0} aria-label={`Open fashion memory: ${memory.title}, ${memory.reference}`} transform={`translate(${spreadX(memory.x)} ${memory.y}) rotate(${memory.tilt}) scale(${memory.scale})`} onClick={(event) => { event.stopPropagation(); setSelectedMemory(memory); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); setSelectedMemory(memory); } }}>
                  <rect className="journey-photo-paper" x="-12" y="-16" width="24" height="35" />
                  <path className="journey-photo-tape" d="M-5 -17 L5 -18 L6 -14 L-4 -13 Z" />
                  <image href={memory.src} x="-11" y="-15" width="22" height="29" preserveAspectRatio="xMidYMid meet" />
                  <text x="-10" y="17">{memory.reference} / {MEMORY_GROUPS[memory.folder].name}</text>
                </g>)}
                <g className="journey-thought" transform={`translate(${spreadX(878)} 951)`} aria-label="My thought: The care in a collar, the way a jacket sits. Is this how Ree wanted to be seen?">
                  <path d="M0 1 Q28 -3 60 0 L59 25 L22 25 L16 30 L17 25 L0 26 Z" />
                  <text x="4" y="6"><tspan x="4">the care in a collar...</tspan><tspan x="4" dy="5">the way a jacket sits.</tspan><tspan x="4" dy="6">Is this how Ree wanted</tspan><tspan x="4" dy="5">to be seen?</tspan></text>
                </g>
                <g className="journey-thought journey-thought-memory" transform={`translate(${spreadX(937)} 1045)`} aria-label="My thought: Colour, confidence, belonging. What did the clothes say for Ree?">
                  <path d="M0 0 L69 -1 L70 23 L52 23 L48 28 L47 23 L1 24 Z" />
                  <text x="4" y="6"><tspan x="4">colour / confidence / belonging</tspan><tspan x="4" dy="6">What did the clothes</tspan><tspan x="4" dy="5">say for Ree?</tspan></text>
                </g>
                <g className="journey-thought journey-thought-soweto" transform={`translate(${spreadX(871)} 1072)`} aria-label="My thought: Follow the people, not just the look. A little closer to my cousin.">
                  <path d="M0 0 Q30 -3 63 0 L64 20 L12 20 L8 24 L8 20 L0 20 Z" />
                  <text x="4" y="6"><tspan x="4">follow the people,</tspan><tspan x="4" dy="5">not just the look.</tspan><tspan x="4" dy="5">a little closer to my cousin.</tspan></text>
                </g>
                <g className="journey-fashion-sketch" transform={`translate(${spreadX(876)} 984) rotate(-4)`} aria-label="Fashion illustration: patterned tailoring and a statement hat">
                  <image className="journey-sketch-image" href={silhouetteSketch} x="-16" y="0" width="32" height="50" preserveAspectRatio="xMidYMid meet" />
                  <text x="-14" y="53">a silhouette remembered</text>
                </g>
                <g className="journey-fashion-sketch" transform={`translate(${spreadX(916)} 1019) rotate(-7)`} aria-label="Fashion illustration: embellished patterned high-heeled boot">
                  <image className="journey-sketch-image" href={shoeSketch} x="-16" y="0" width="36" height="46" preserveAspectRatio="xMidYMid meet" />
                  <text x="-14" y="49">polish. pride. presence.</text>
                </g>
                <g className="journey-fashion-sketch" transform={`translate(${spreadX(1026)} 1018) rotate(5)`} aria-label="Fashion illustration: red floral outfit and oversized hat">
                  <image className="journey-sketch-image" href={floralSketch} x="-18" y="0" width="36" height="48" preserveAspectRatio="xMidYMid meet" />
                  <text x="-17" y="51">colour that stays with me</text>
                </g>
                <g className="journey-fashion-sketch" transform={`translate(${spreadX(828)} 1058) rotate(-5)`} aria-label="Fashion illustration: white draped gown with embellished sleeves">
                  <image className="journey-sketch-image" href={drapedSketch} x="-21" y="0" width="42" height="38" preserveAspectRatio="xMidYMid meet" />
                  <text x="-18" y="41">the way fabric remembers</text>
                </g>
                <g className="journey-fashion-sketch" transform={`translate(${spreadX(924)} 980) rotate(4)`} aria-label="Fashion illustration: monochrome patterned textile and draped silhouette">
                  <image className="journey-sketch-image" href={textileSketch} x="-15" y="0" width="30" height="38" preserveAspectRatio="xMidYMid meet" />
                  <text x="-14" y="41">the stories in a pattern</text>
                </g>
                <g className="journey-fashion-sketch" transform={`translate(${spreadX(821)} 1000) rotate(-6)`} aria-label="Fashion illustration: sculptural platform shoe with beaded fringe">
                  <image className="journey-sketch-image" href={platformSketch} x="-18" y="0" width="36" height="48" preserveAspectRatio="xMidYMid meet" />
                  <text x="-15" y="51">each detail, chosen</text>
                </g>
                <path className="journey-route-base" d={spreadPath(routePath)} />
                <path className="journey-route-glow" d={spreadPath(travelledPath(progress))} />
                <path className="journey-route-lit" d={spreadPath(travelledPath(progress))} />
                {STOPS.map((stop, index) => {
                  const location = routePoint(stop.progress);
                  return <g key={stop.id} className={`journey-map-stop ${progress >= stop.progress ? "reached" : ""} ${progress > stop.progress || ready ? "completed" : ""} ${index === activeIndex ? "active" : ""} ${index === 0 && progress === 0 ? "starting" : ""} ${index > activeIndex + 1 ? "locked" : ""}`} role="button" tabIndex={index > activeIndex + 1 ? -1 : 0} aria-disabled={index > activeIndex + 1} aria-label={`Remember ${stop.title}${progress > stop.progress || ready ? ", completed" : ""}`} onClick={() => selectStop(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); selectStop(index); } }}>
                    <path className="journey-stop-pin-stem" d={`M${location.x} ${location.y - 1} V${location.y + 9}`} />
                    <circle className="journey-stop-halo" cx={location.x} cy={location.y - 4} r="9" />
                    <circle className="journey-stop-pin" cx={location.x} cy={location.y - 4} r="7" />
                    <circle className="journey-stop-pin-core" cx={location.x} cy={location.y - 4} r="2.2" />
                    <text x={location.x + stop.label.dx} y={location.y + stop.label.dy} textAnchor={stop.label.dx < 0 ? "end" : "start"}>{index === 0 ? "Home" : index === 1 ? "Memory" : "Soweto"}</text>
                  </g>;
                })}
                <circle className="journey-traveller-shadow" cx={point.x} cy={point.y + 1} r="1.6" />
                <circle className={`journey-drag-pulse ${progress === 0 ? "starting" : ""}`} cx={point.x} cy={point.y} r="8" />
                <circle className="journey-traveller" cx={point.x} cy={point.y} r="3" />
                <circle ref={sliderRef} className="journey-drag-target" cx={point.x} cy={point.y} r="11" tabIndex={entering ? -1 : 0} role="slider"
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
            <span className="journey-map-caption">My working atlas / the things I never asked<br /><em>Clothes. People. Places. Ree.</em></span>
          </div>
          <div className="journey-controls">
            <p id="journey-instruction">Follow the gold thread towards Soweto.<small>Open a photograph to look closer. Drag the gold circle to follow the journey.</small></p>
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
            <div className="journey-story-body">
            <span className="journey-story-number">0{activeIndex + 1}</span>
            <h2 id={`story-${activeStop.id}`}>{activeStop.title}</h2>
            <p>{activeStop.text}</p>
            {activeStop.media && <div className="journey-story-media">
              {activeStop.media.image && <img src={activeStop.media.image} alt={activeStop.media.alt || ""} loading="lazy" />}
              {activeStop.media.audio && <audio src={activeStop.media.audio} controls preload="none" aria-label={`${activeStop.title} memory recording`} />}
            </div>}
            </div>
            {!ready && <button className="journey-continue" onClick={continueJourney} disabled={entering}>Follow the thread <span aria-hidden="true">&rarr;</span></button>}
          </article> : <button className="journey-reopen" onClick={() => setClosedStop(null)} disabled={entering}>Read this memory</button>}
          {ready && <button className="journey-enter" onClick={() => { setNavigationLocked(true); setEntering(true); }} disabled={entering}><span><small>THE NEXT PART OF MY SEARCH</small>{entering ? "Entering Soweto..." : "Enter Soweto"}</span><span aria-hidden="true">&rarr;</span></button>}
        </aside>
      </div>
    </section>
  );
}
export default JourneyMapGame;
