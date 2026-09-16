import { useEffect, useRef, useState } from "react";
import "../../styles/ChapterGames.css";

const GROUP_SIZE = 3;
const SWIPE_THRESHOLD = 45;

function SwipeCarouselGame({ images, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const pointerStartX = useRef(null);
  const ready = current === images.length - 1;

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [ready, onComplete]);

  const goTo = (target) => {
    const next = Math.min(images.length - 1, Math.max(0, target));
    if (next === current) return;
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
  };

  const handlePointerDown = (event) => {
    pointerStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const releaseSwipe = (event) => {
    if (pointerStartX.current === null) return;
    const delta = pointerStartX.current - event.clientX;
    pointerStartX.current = null;
    if (delta > SWIPE_THRESHOLD) goTo(current + 1);
    else if (delta < -SWIPE_THRESHOLD) goTo(current - 1);
  };
  const handlePointerCancel = () => { pointerStartX.current = null; };
  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") goTo(current + 1);
    if (event.key === "ArrowLeft") goTo(current - 1);
  };

  const groupCount = Math.ceil(images.length / GROUP_SIZE);
  const activeGroup = Math.floor(current / GROUP_SIZE);

  return (
    <div className="game-stage game-stage--skhothane">
      <div className="game-copy">
        <p className="tag">03 / SKHOTHANE</p>
        <h1>Every photo<br />I took that day.</h1>
        <p className="body">I went back through everything I shot, one image after another, trying to see what I&apos;d missed the first time.</p>
        <strong>SWIPE THROUGH, THE WAY I DID, LOOKING BACK</strong>
        <div className="layer-stepper" aria-hidden="true">
          {Array.from({ length: groupCount }).map((_, index) => (
            <span key={index} className={index <= activeGroup ? "done" : ""} />
          ))}
        </div>
        <i />
      </div>
      <div
        className="skhothane-images"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="group"
        aria-label={`Skhothane style, look ${current + 1} of ${images.length}. Swipe an image left or right to reveal.`}
      >
        {current < images.length - 1 && <div className="swipe-hint" aria-hidden="true"><span>SWIPE</span></div>}
        {current > 0 && (
          <img
            key={`left-${current - 1}`}
            src={images[current - 1]}
            alt=""
            aria-hidden="true"
            className={`layer-photo pos-0 ${direction === 1 ? "enter-right" : "enter-left"}`}
            draggable={false}
            loading="lazy"
            decoding="async"
            onPointerDown={handlePointerDown}
            onPointerUp={releaseSwipe}
            onPointerCancel={handlePointerCancel}
          />
        )}
        <img
          key={`center-${current}`}
          src={images[current]}
          alt={`Skhothane style, look ${current + 1} of ${images.length}`}
          className={`layer-photo pos-1 ${direction === 1 ? "enter-right" : "enter-left"}`}
          style={{ animationDelay: "70ms" }}
          draggable={false}
          loading="lazy"
          decoding="async"
          onPointerDown={handlePointerDown}
          onPointerUp={releaseSwipe}
          onPointerCancel={handlePointerCancel}
        />
        {current < images.length - 1 && (
          <img
            key={`right-${current + 1}`}
            src={images[current + 1]}
            alt=""
            aria-hidden="true"
            className={`layer-photo pos-2 ${direction === 1 ? "enter-right" : "enter-left"}`}
            style={{ animationDelay: "140ms" }}
            draggable={false}
            loading="lazy"
            decoding="async"
            onPointerDown={handlePointerDown}
            onPointerUp={releaseSwipe}
            onPointerCancel={handlePointerCancel}
          />
        )}
      </div>
    </div>
  );
}

export default SwipeCarouselGame;
