import { useEffect, useRef, useState } from "react";
import StitchedNarrative from "../StitchedNarrative";
import WardrobeThreads from "./WardrobeThreads";
import suitBackground from "../../assets/Chapter 1_Swenka/Images/Page Backgrounds/Suit_Background.jpg";
import "../../styles/ChapterGames.css";

const elements = [
  { id: "HAT", zone: { left: 44, top: 6, width: 32, height: 20 }, thumb: { x: 58, y: 15 } },
  { id: "SLEEVE", zone: { left: 14, top: 36, width: 52, height: 32 }, thumb: { x: 38, y: 50 } },
  { id: "SHOES", zone: { left: 18, top: 76, width: 46, height: 22 }, thumb: { x: 40, y: 87 } },
];

function WardrobeGame({ portraitImage, onComplete }) {
  const [copyReady, setCopyReady] = useState(false);
  const [placed, setPlaced] = useState([]);
  const [dragged, setDragged] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const threadRef = useRef(null);
  const spoolRef = useRef(null);
  const itemRefs = useRef({});
  const zoneRefs = useRef({});
  const pointerDrag = useRef(null);
  const ignoreClick = useRef(false);
  const ready = placed.length === elements.length;
  const center = (element) => {
    const bounds = element?.getBoundingClientRect();
    return bounds ? { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 } : { x: 0, y: 0 };
  };

  const placeElement = (id, targetId, point = center(zoneRefs.current[targetId])) => {
    if (!copyReady || !elements.some((element) => element.id === id) || placed.includes(id) || placed.includes(targetId)) return;
    const spool = spoolRef.current?.getBoundingClientRect();
    if (!targetId && spool && point.x >= spool.left && point.x <= spool.right && point.y >= spool.top && point.y <= spool.bottom) {
      threadRef.current?.cancel(id);
      setDragged(null);
      setFeedback(null);
      return;
    }
    if (id !== targetId) {
      threadRef.current?.miss(id, point);
      setFeedback((previous) => ({ type: "error", item: id, target: targetId, attempt: (previous?.attempt || 0) + 1,
        message: targetId ? `Not a match. The ${id.toLowerCase()} does not belong in the ${targetId.toLowerCase()} area. Pick it up and try again.` : `Not a match. Pick up the ${id.toLowerCase()} and try again.` }));
      return;
    }
    threadRef.current?.cut(id, point);
    setPlaced((current) => [...current, id]);
    setDragged(null);
    setFeedback({ type: "success", message: `${id.charAt(0)}${id.slice(1).toLowerCase()} matched. The thread is cut. ${placed.length + 1} of ${elements.length} details in place.` });
  };
  const selectElement = (id, point = center(itemRefs.current[id])) => {
    setDragged(id);
    setFeedback(null);
    threadRef.current?.begin(id, point);
  };

  const beginDrag = (id, event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerDrag.current = { id, x: event.clientX, y: event.clientY, moved: false };
    ignoreClick.current = false;
    selectElement(id, { x: event.clientX, y: event.clientY });
  };
  const moveDrag = (id, event) => {
    const drag = pointerDrag.current;
    if (!drag || drag.id !== id) return;
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 6) drag.moved = true;
    if (drag.moved) { event.preventDefault(); threadRef.current?.move(id, { x: event.clientX, y: event.clientY }); }
  };
  const endDrag = (event) => {
    const drag = pointerDrag.current;
    pointerDrag.current = null;
    if (!drag?.moved) return;
    ignoreClick.current = true;
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-wardrobe-zone]");
    placeElement(drag.id, target?.dataset.wardrobeZone, { x: event.clientX, y: event.clientY });
  };
  const returnDetail = (id) => { threadRef.current?.cancel(id); setDragged(null); setFeedback(null); };

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [ready, onComplete]);

  return (
    <div className="game-stage game-stage--swenka" style={{ "--suit-background": `url("${suitBackground}")` }}>
      <div className="game-copy">
        <p className="tag">01 / SWENKA</p>
        <h1>Piece by piece,<br />it came together.</h1>
        <StitchedNarrative onComplete={() => setCopyReady(true)} className="game-copy__narrative" text="I couldn't take in the whole outfit at once, not at first. So I broke it down the way I actually noticed it: the hat, the sleeve, the shoes, one detail at a time." placement="inline" />
        <strong role="status">{copyReady ? "PULL A DETAIL FROM THE SPOOL. A MATCH CUTS THE THREAD; A RED THREAD ASKS ME TO TRY AGAIN." : "READ TO UNLOCK THE OUTFIT"}</strong>
        <i />
      </div>
      <div className="fashion-portrait" inert={!copyReady}>
        <div className="portrait-frame">
          <img src={portraitImage} alt="A man in a yellow hat and dark suit, mid dance move" loading="lazy" decoding="async" />
          {elements.map(({ id, zone }) => {
            const isPlaced = placed.includes(id);
            return (
              <div
                key={id}
                ref={(node) => { zoneRefs.current[id] = node; }}
                data-wardrobe-zone={id}
                className={`puzzle-zone ${isPlaced ? "revealed" : ""} ${feedback?.type === "error" && feedback.target === id ? "is-mismatch" : ""}`}
                style={{ left: `${zone.left}%`, top: `${zone.top}%`, width: `${zone.width}%`, height: `${zone.height}%` }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => { event.preventDefault(); event.stopPropagation(); placeElement(event.dataTransfer.getData("text/plain") || dragged, id); }}
                onClick={() => dragged && placeElement(dragged, id)}
                onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); if (dragged) placeElement(dragged, id); } }}
                role="button"
                tabIndex={isPlaced ? -1 : 0}
                aria-label={isPlaced ? `${id} revealed` : `Drop ${id} here`}
              >
                {!isPlaced && <span>{id}{feedback?.type === "error" && feedback.target === id && <small>Not a match. Try again.</small>}</span>}
              </div>
            );
          })}
        </div>
      </div>
      <aside className="wardrobe" inert={!copyReady}>
        <div className="wardrobe-spool" ref={spoolRef}>
        <svg className="wardrobe-spool-backdrop" viewBox="0 0 200 600" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M15 3 Q100 -1 185 3 Q195 3 195 14 L195 34 Q195 43 184 43 L175 43 Q167 43 167 55 L167 545 Q167 557 175 557 L184 557 Q195 557 195 566 L195 586 Q195 597 185 597 Q100 601 15 597 Q5 597 5 586 L5 566 Q5 557 16 557 L25 557 Q33 557 33 545 L33 55 Q33 43 25 43 L16 43 Q5 43 5 34 L5 14 Q5 3 15 3 Z" fill="#080908" />
        </svg>
        <p>THREADS OF THE OUTFIT<small>PULL A DETAIL</small></p>
        {elements.map(({ id, thumb }) => {
          const isPlaced = placed.includes(id);
          return (
            <button
              key={id}
              ref={(node) => { itemRefs.current[id] = node; }}
              draggable={false}
              disabled={!copyReady || isPlaced}
              onPointerDown={(event) => beginDrag(id, event)}
              onPointerMove={(event) => moveDrag(id, event)}
              onPointerUp={endDrag}
              onPointerCancel={() => { pointerDrag.current = null; threadRef.current?.cancel(id); }}
              onClick={() => { if (ignoreClick.current) { ignoreClick.current = false; return; } selectElement(id); }}
              className={`${dragged === id ? "selected" : ""} ${isPlaced ? "used" : ""} ${feedback?.type === "error" && feedback.item === id ? "is-mismatch" : ""}`}
              aria-pressed={dragged === id}
            >
              <span className="item-preview" style={{ backgroundImage: `url(${portraitImage})`, backgroundPosition: `${thumb.x}% ${thumb.y}%` }} />
              <span>⠿</span>
              <b>{id}{isPlaced ? " ✓" : ""}</b>
            </button>
          );
        })}
        <small className="wardrobe-spool-note">Each detail has a thread.<br />I follow it into place.</small>
        </div>
      </aside>
      <WardrobeThreads ref={threadRef} items={elements} sourceRefs={itemRefs} spoolRef={spoolRef} portraitImage={portraitImage} onPickup={beginDrag} onMove={moveDrag} onRelease={endDrag} onReturn={returnDetail} />
    </div>
  );
}

export default WardrobeGame;
