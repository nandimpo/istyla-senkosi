import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../context/NavigationContext";

const TURN_MS = 1050;

const albumTitles = [
  "I turn the pages, looking for him.",
  "I notice the details I once missed.",
  "I think about his confidence.",
  "I wonder what his clothes meant to him.",
  "I wish I had asked him more.",
];

const albumSubtitle = "Their colours and confidence remind me of my cousin.";
function AlbumNote({ pageIndex, titles, notes, count = Infinity }) {
  const title = titles[pageIndex] ?? "I keep looking, trying to understand him.";
  const subtitle = notes[pageIndex] ?? albumSubtitle;
  return <div className="memory-flipbook__album-note">
    <p className="album-typewriter"><span className="album-typewriter__reserve" aria-hidden="true">{title}</span><span className="album-typewriter__visible" aria-hidden="true">{title.slice(0, count)}</span><span className="narrative-text__accessible">{title}</span></p>
    <span className="album-typewriter"><span className="album-typewriter__reserve" aria-hidden="true">{subtitle}</span><span className="album-typewriter__visible" aria-hidden="true">{subtitle.slice(0, Math.max(0, count - title.length))}</span><span className="narrative-text__accessible">{subtitle}</span></span>
  </div>;
}

export default function MemoryFlipbook({ images, paused = false, photoAlbum = false, albumLabel = "My memory album", titles = albumTitles, notes = [], imagePositions = [], photoMasks = [], onWritingReady }) {
  const { reducedMotion } = useNavigation();
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const quietMotion = reducedMotion || systemReducedMotion;
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  const [page, setPage] = useState({ current: 0, previous: null, turn: 0, direction: 1 });
  const currentPage = page.current;
  const [typing, setTyping] = useState({ page: -1, count: 0 });
  const count = quietMotion ? Infinity : typing.page === currentPage ? typing.count : 0;
  const title = titles[currentPage] ?? "I keep looking, trying to understand him.";
  const subtitle = notes[currentPage] ?? albumSubtitle;
  const writingReady = !photoAlbum || count >= title.length + subtitle.length;
  const completedPages = useRef(new Set());
  const readyCallback = useRef(onWritingReady);
  useEffect(() => { readyCallback.current = onWritingReady; });
  useEffect(() => {
    if (!paused) completedPages.current.add(currentPage);
    readyCallback.current?.(writingReady, completedPages.current.size === images.length);
  }, [writingReady, currentPage, paused, images.length]);
  useEffect(() => {
    if (!photoAlbum || paused || quietMotion) return;
    let written = 0;
    const timer = setInterval(() => {
      written += 1;
      setTyping({ page: currentPage, count: written });
      if (written >= title.length + subtitle.length) clearInterval(timer);
    }, 35);
    return () => clearInterval(timer);
  }, [currentPage, photoAlbum, paused, quietMotion, title, subtitle]);

  const busy = useRef(false);
  const startX = useRef(null);
  const turnTimer = useRef(null);
  const flipRef = useRef(null);

  useEffect(() => () => clearTimeout(turnTimer.current), []);
  useEffect(() => {
    if (paused || images.length < 2) return;
    // Decode only the adjacent pages so turning never waits for a cold photo.
    const adjacent = [1, -1].map((direction) => {
      const image = new Image();
      image.decoding = "async";
      image.src = images[(currentPage + direction + images.length) % images.length];
      image.decode?.().catch(() => {});
      return image;
    });
    return () => adjacent.forEach((image) => { image.onload = null; });
  }, [images, currentPage, paused]);

  const flip = (direction) => {
    if (paused || busy.current || images.length < 2) return;
    const target = photoAlbum ? Math.max(0, Math.min(images.length - 1, currentPage + direction)) : (currentPage + direction + images.length) % images.length;
    if (target === currentPage) return;
    busy.current = true;
    setPage(({ current, turn }) => ({ current: target, previous: current, turn: turn + 1, direction }));
    clearTimeout(turnTimer.current);
    turnTimer.current = setTimeout(() => {
      setPage((value) => ({ ...value, previous: null }));
      busy.current = false;
    }, quietMotion ? 0 : TURN_MS);
  };
  useEffect(() => { flipRef.current = flip; });

  useEffect(() => {
    if (paused) return undefined;
    const handleArrow = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target?.tagName)) return;
      event.preventDefault();
      event.stopPropagation();
      flipRef.current(event.key === "ArrowRight" ? 1 : -1);
    };
    window.addEventListener("keydown", handleArrow, true);
    return () => window.removeEventListener("keydown", handleArrow, true);
  }, [paused]);

  const handlePointerDown = (event) => {
    event.stopPropagation();
    if (paused || event.isPrimary === false || event.button !== 0) return;
    startX.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event) => {
    event.stopPropagation();
    if (startX.current === null) return;
    const distance = event.clientX - startX.current.x;
    const vertical = event.clientY - startX.current.y;
    startX.current = null;
    if (Math.abs(vertical) > Math.max(12, Math.abs(distance))) return;
    flip(Math.abs(distance) > 45 && distance > 0 ? -1 : 1);
  };

  return (
    <div className={`memory-flipbook ${photoAlbum ? "memory-flipbook--photo-album" : ""}`} role="group" tabIndex={paused ? -1 : 0} aria-label={`${albumLabel}, photograph ${page.current + 1} of ${images.length}. Drag or use the buttons to turn a page.`}
      onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}
      onPointerCancel={(event) => { event.stopPropagation(); startX.current = null; }}
      onClick={(event) => event.stopPropagation()} onWheel={(event) => event.stopPropagation()}
      onKeyDown={(event) => { event.stopPropagation(); if (event.key === "ArrowRight") { event.preventDefault(); flip(1); } if (event.key === "ArrowLeft") { event.preventDefault(); flip(-1); } }}>
      {page.turn > 0 && <div className="memory-flipbook__settled-page" aria-hidden="true" />}
      <div className="memory-flipbook__stack" aria-hidden="true" />
      <div className="memory-flipbook__page">
        {photoAlbum && <AlbumNote pageIndex={page.current} titles={titles} notes={notes} count={count} />}
        <img className={photoMasks[page.current] ? `old-photo--${photoMasks[page.current]}` : undefined} src={images[page.current]} style={{ objectPosition: imagePositions[page.current] || "center top" }} alt={`${albumLabel}, photograph ${page.current + 1} of ${images.length}`} decoding="async" />
      </div>
      {page.previous !== null && !paused && !quietMotion && (
        <div key={page.turn} className={`memory-flipbook__turning memory-flipbook__turning--${page.direction > 0 ? "forward" : "back"}`} aria-hidden="true">
          <div className="memory-flipbook__front">
          {photoAlbum && <AlbumNote pageIndex={page.previous} titles={titles} notes={notes} />}
          <img className={photoMasks[page.previous] ? `old-photo--${photoMasks[page.previous]}` : undefined} src={images[page.previous]} style={{ objectPosition: imagePositions[page.previous] || "center top" }} alt="" />
          </div>
          <span className="memory-flipbook__paper-back" />
        </div>
      )}
      <div className="memory-flipbook__controls" onPointerDown={(event) => event.stopPropagation()} onPointerUp={(event) => event.stopPropagation()}>
        <button type="button" disabled={paused || (photoAlbum && currentPage === 0)} onClick={(event) => { event.stopPropagation(); flip(-1); }} aria-label="Previous photograph">←</button>
        <span aria-live="polite">{String(page.current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        <button type="button" disabled={paused || (photoAlbum && currentPage === images.length - 1)} onClick={(event) => { event.stopPropagation(); flip(1); }} aria-label="Next photograph">→</button>
      </div>
      <p className="memory-flipbook__hint">{photoAlbum ? "View every photo to continue. Drag or use the arrows to turn the page." : "Drag or tap to turn a memory."}</p>
    </div>
  );
}
