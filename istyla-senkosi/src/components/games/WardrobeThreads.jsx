import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigation } from "../../context/NavigationContext";

const COUNT = 30;
const CUT_DURATION = 950;
const makeRope = (start, end) => Array.from({ length: COUNT }, (_, i) => {
  const t = i / (COUNT - 1);
  const x = start.x + (end.x - start.x) * t + Math.sin(t * Math.PI * 2) * 12;
  const y = start.y + (end.y - start.y) * t + Math.sin(t * Math.PI) * 65;
  return { x, y, oldX: x, oldY: y };
});

// A light Verlet rope keeps slack and momentum as the image is pulled.
const WardrobeThreads = forwardRef(function WardrobeThreads({ items, sourceRefs, spoolRef, portraitImage, onPickup, onMove, onRelease, onReturn }, ref) {
  const canvasRef = useRef(null);
  const previews = useRef({});
  const ropes = useRef({});
  const { reducedMotion } = useNavigation();

  const anchor = (id) => {
    const card = sourceRefs.current[id]?.getBoundingClientRect();
    const spool = spoolRef.current?.getBoundingClientRect();
    if (!card || !spool) return { x: 0, y: 0 };
    return { x: spool.left + spool.width * .17, y: card.top + card.height * .5 };
  };
  useImperativeHandle(ref, () => ({
    begin(id, point) {
      const start = anchor(id);
      ropes.current[id] = { id, start, end: point, points: makeRope(start, point), phase: "pulling", cutAt: 0 };
    },
    move(id, point) { if (ropes.current[id]) ropes.current[id].end = point; },
    miss(id, point) {
      const rope = ropes.current[id];
      if (rope) { rope.end = point; rope.phase = "wrong"; }
    },
    cut(id, point) {
      const rope = ropes.current[id];
      if (!rope) return;
      rope.end = point;
      rope.phase = "cut";
      rope.cutAt = performance.now();
      const middle = Math.floor(COUNT / 2);
      rope.points[middle - 1].oldX += 9;
      rope.points[middle].oldX -= 9;
    },
    cancel(id) { delete ropes.current[id]; if (previews.current[id]) previews.current[id].hidden = true; },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    let previous = performance.now();
    let width = 0;
    let height = 0;
    const stroke = (points, color, opacity = 1) => {
      if (points.length < 2) return;
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const next = points[i + 1];
        context.quadraticCurveTo(points[i].x, points[i].y, (points[i].x + next.x) / 2, (points[i].y + next.y) / 2);
      }
      context.lineTo(points.at(-1).x, points.at(-1).y);
      context.globalAlpha = opacity * .08;
      context.strokeStyle = "#e7decd";
      context.lineWidth = 1;
      context.stroke();
      context.globalAlpha = opacity;
      context.strokeStyle = color;
      context.lineWidth = .7;
      context.stroke();
      context.globalAlpha = 1;
    };
    const draw = (now) => {
      const calm = reducedMotion || query.matches;
      const dt = Math.min(1.8, (now - previous) / 16.67);
      previous = now;
      if (width !== window.innerWidth || height !== window.innerHeight) {
        width = window.innerWidth;
        height = window.innerHeight;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
      }
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";
      context.lineJoin = "round";
      for (const rope of Object.values(ropes.current)) {
        const cut = rope.phase === "cut";
        const elapsed = now - rope.cutAt;
        const ghost = previews.current[rope.id];
        if (cut && elapsed > (calm ? 120 : CUT_DURATION)) {
          delete ropes.current[rope.id];
          if (ghost) ghost.hidden = true;
          continue;
        }
        rope.start = anchor(rope.id);
        if (ghost) {
          ghost.hidden = false;
          ghost.dataset.phase = rope.phase;
          ghost.tabIndex = rope.phase === "wrong" ? 0 : -1;
          ghost.setAttribute("aria-hidden", rope.phase === "wrong" ? "false" : "true");
          ghost.style.transform = `translate(${rope.end.x - 58}px, ${rope.end.y - 48}px) rotate(${cut ? -3 : 2}deg)`;
          ghost.style.opacity = cut ? Math.max(0, 1 - elapsed / 500) : 1;
        }
        const color = rope.phase === "wrong" ? "#bb2925" : "#10100e";
        const middle = Math.floor(COUNT / 2);
        if (calm) {
          const points = makeRope(rope.start, rope.end);
          if (!cut) stroke(points, color);
          continue;
        }
        const points = rope.points;
        const distance = Math.hypot(rope.end.x - rope.start.x, rope.end.y - rope.start.y);
        const segment = Math.max(160, distance * 1.12 + 45) / (COUNT - 1);
        for (const point of points) {
          const vx = (point.x - point.oldX) * .975;
          const vy = (point.y - point.oldY) * .975;
          point.oldX = point.x;
          point.oldY = point.y;
          point.x += vx;
          point.y += vy + .28 * dt * dt;
        }
        for (let pass = 0; pass < 9; pass++) {
          points[0].x = rope.start.x;
          points[0].y = rope.start.y;
          if (!cut) { points.at(-1).x = rope.end.x; points.at(-1).y = rope.end.y; }
          for (let i = 0; i < COUNT - 1; i++) {
            if (cut && i === middle - 1) continue;
            const a = points[i];
            const b = points[i + 1];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const length = Math.hypot(dx, dy) || 1;
            const correction = (length - segment) / length * .5;
            if (i !== 0) { a.x += dx * correction; a.y += dy * correction; }
            if (cut || i + 1 !== COUNT - 1) { b.x -= dx * correction; b.y -= dy * correction; }
          }
        }
        points[0].x = rope.start.x;
        points[0].y = rope.start.y;
        if (!cut) { points.at(-1).x = rope.end.x; points.at(-1).y = rope.end.y; }
        if (cut) {
          const opacity = Math.max(0, 1 - elapsed / CUT_DURATION);
          stroke(points.slice(0, middle), color, opacity);
          stroke(points.slice(middle), color, opacity);
          for (const end of [points[middle - 1], points[middle]]) {
            for (let fiber = -1; fiber <= 1; fiber++) stroke([end, { x: end.x + fiber * 3, y: end.y + 5 }], color, opacity);
          }
        } else stroke(points, color);
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, sourceRefs, spoolRef]);

  return createPortal(<>
    <canvas ref={canvasRef} className="wardrobe-thread-canvas" aria-hidden="true" />
    {items.map(({ id, thumb }) => <div key={id} ref={(node) => { previews.current[id] = node; }} className="wardrobe-thread-preview" hidden aria-hidden="true" role="button" tabIndex={-1} aria-label={`Pick up misplaced ${id.toLowerCase()}, or press Enter to return it to the spool`}
      onPointerDown={(event) => onPickup(id, event)} onPointerMove={(event) => onMove(id, event)} onPointerUp={onRelease}
      onPointerCancel={() => onReturn(id)} onKeyDown={(event) => { if (["Enter", " ", "Escape"].includes(event.key)) { event.preventDefault(); onReturn(id); } }} >
      <span style={{ backgroundImage: `url(${portraitImage})`, backgroundPosition: `${thumb.x}% ${thumb.y}%` }} />
      <b>{id}</b>
    </div>)}
  </>, document.body);
});

export default WardrobeThreads;
