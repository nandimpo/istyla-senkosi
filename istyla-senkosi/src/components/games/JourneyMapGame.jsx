import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../../styles/ChapterGames.css";

const DRAG_RANGE = 340;
const NORTH_FOCUS = { x: 50, y: 16 };
const SOUTHWEST_FOCUS = { x: 21, y: 61 };
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function JourneyMapGame({ mapImage, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [handlePoint, setHandlePoint] = useState({ x: 172, y: 60 });
  const pathRef = useRef(null);
  const drag = useRef({ active: false, startY: 0, startProgress: 0 });
  const ready = progress >= 0.92;
  const completedRef = useRef(false);

  useEffect(() => {
    if (!ready || completedRef.current) return undefined;
    completedRef.current = true;
    const timer = setTimeout(onComplete, 900);
    return () => clearTimeout(timer);
  }, [ready, onComplete]);

  useLayoutEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setHandlePoint(pathRef.current.getPointAtLength(progress * length));
    }
  }, [progress]);

  const handlePointerDown = (event) => {
    setHasStarted(true);
    drag.current = { active: true, startY: event.clientY, startProgress: progress };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event) => {
    if (!drag.current.active) return;
    const deltaY = event.clientY - drag.current.startY;
    setProgress(clamp(drag.current.startProgress + deltaY / DRAG_RANGE, 0, 1));
  };
  const handlePointerUp = () => { drag.current.active = false; };
  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") { setHasStarted(true); setProgress((p) => clamp(p + 0.12, 0, 1)); }
    if (event.key === "ArrowUp") { setHasStarted(true); setProgress((p) => clamp(p - 0.12, 0, 1)); }
  };

  const mapX = NORTH_FOCUS.x + (SOUTHWEST_FOCUS.x - NORTH_FOCUS.x) * progress;
  const mapY = NORTH_FOCUS.y + (SOUTHWEST_FOCUS.y - NORTH_FOCUS.y) * progress;

  return (
    <div className="journey-stage">
      <div className="journey-mapbg">
        <img src={mapImage} alt="" loading="lazy" decoding="async" style={{ objectPosition: `${mapX}% ${mapY}%` }} />
      </div>
      <p className="journey-label">This is the route I&apos;m retracing now</p>
      <div className="journey-place journey-north"><b>Johannesburg</b><span>North</span><i /></div>
      <svg className="journey-line" viewBox="0 0 300 430" aria-hidden="true">
        <path ref={pathRef} d="M172 60 C162 128 146 173 185 215 S129 290 154 352" />
        <circle className="journey-end" cx="154" cy="352" r="12" />
        {!hasStarted && <text className="journey-drag-hint" x={handlePoint.x + 20} y={handlePoint.y + 4}>DRAG DOWN</text>}
        {!hasStarted && <circle className="journey-ping" cx={handlePoint.x} cy={handlePoint.y} r="9" />}
        {!hasStarted && <circle className="journey-ping journey-ping-delay" cx={handlePoint.x} cy={handlePoint.y} r="9" />}
        <circle className={`journey-handle ${!hasStarted ? "idle" : ""}`} cx={handlePoint.x} cy={handlePoint.y} r="9" aria-hidden="true" />
        <circle
          className="journey-handle-hit"
          cx={handlePoint.x}
          cy={handlePoint.y}
          r="22"
          tabIndex={0}
          role="slider"
          aria-label="Drag down to travel from Johannesburg North to Soweto"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
      </svg>
      <div className="journey-place journey-soweto"><b>Soweto</b><i /></div>
      <div className="journey-copy">
        <h1>I&apos;VE ALWAYS<br />BEEN FROM HERE<span>...</span></h1>
        <p>Every metre of this, I drove or walked myself. Dragging it here is the closest I can get to putting you in the seat next to me.</p>
      </div>
    </div>
  );
}

export default JourneyMapGame;
