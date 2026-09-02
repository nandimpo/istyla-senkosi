import { useEffect, useRef, useState } from "react";
import { useClickGesture, useDragGesture, useScrollGesture, useSwipeGesture } from "../hooks/useFrameGesture";
import { useSectionAudio } from "../hooks/useSectionAudio";
import "../styles/ChapterPlayer.css";

const LOCK_MS = 340;

const HINTS = {
  drag: "DRAG UP TO CONTINUE",
  click: "TAP TO CONTINUE",
  swipe: "SWIPE TO CONTINUE",
  scroll: "SCROLL TO CONTINUE",
};

function Frame({ frame }) {
  const videoRef = useRef(null);
  const seekToStart = () => {
    if (frame.videoStart && videoRef.current) videoRef.current.currentTime = frame.videoStart;
  };
  const holdStart = () => {
    if (frame.videoStart && videoRef.current && videoRef.current.currentTime < frame.videoStart - 1) {
      videoRef.current.currentTime = frame.videoStart;
    }
  };
  return (
    <>
      <div className={`chapter-player__visual ${frame.kind ? `chapter-player__visual--${frame.kind}` : ""}`}>
        {frame.collage ? (
          <div className={`chapter-player__collage chapter-player__collage--${frame.collage.length}`}>
            {frame.collage.map((src, index) => (
              <img key={src} src={src} alt={frame.alt || ""} loading="lazy" decoding="async" style={{ animationDelay: `${index * -1.2}s` }} />
            ))}
          </div>
        ) : frame.video ? (
          <video ref={videoRef} src={frame.video} muted playsInline loop autoPlay preload="metadata" onLoadedMetadata={seekToStart} onTimeUpdate={holdStart} />
        ) : (
          <img src={frame.image} alt={frame.alt || ""} loading="lazy" decoding="async" />
        )}
        {frame.badge && <span className="chapter-player__badge">{frame.badge}</span>}
      </div>
      {frame.label && <p className="chapter-player__label">{frame.label}</p>}
      {frame.text && <p className="chapter-player__note">{frame.text}</p>}
      {frame.caption && <p className="chapter-player__caption">{frame.caption}</p>}
      {frame.kind === "hold" && <p className="chapter-player__hold">HOLD 6–8 SECONDS</p>}
    </>
  );
}

function ChapterPlayer({ id, chapter, title, subtitle, context, accent = "mustard", interaction, frames, outro, gamePage, finalPage, exitTransition = "fade", titleImage, titleTransition = "dissolve", titleWipeDirection = "left", track, trackStart, onComplete }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [lockExpiredFor, setLockExpiredFor] = useState(null);
  const lockedRef = useRef(false);
  const completedRef = useRef(false);
  const audioRef = useRef(null);
  const advanceRef = useRef(() => {});
  const hasGamePage = Boolean(gamePage);
  const gamePageIndex = hasGamePage ? 1 : null;
  const framesStart = 1 + (hasGamePage ? 1 : 0);
  const framesEnd = framesStart + frames.length - 1;
  const totalPages = framesStart + frames.length + (finalPage ? 1 : 0);
  const lastFrameIndex = totalPages - 1;
  useSectionAudio({ id, audioRef, soundOn });

  const seekTrackToStart = () => {
    if (trackStart && audioRef.current) audioRef.current.currentTime = trackStart;
  };
  const holdTrackStart = () => {
    if (trackStart && audioRef.current && audioRef.current.currentTime < trackStart - 1) {
      audioRef.current.currentTime = trackStart;
    }
  };

  const lock = () => {
    lockedRef.current = true;
    setTimeout(() => {
      lockedRef.current = false;
    }, LOCK_MS);
  };

  const advance = () => {
    if (lockedRef.current || exiting) return;
    if (pageIndex < lastFrameIndex) {
      lock();
      setPageIndex((p) => p + 1);
    } else {
      setExiting(true);
    }
  };

  useEffect(() => {
    advanceRef.current = advance;
  });

  const retreat = () => {
    if (lockedRef.current || exiting) return;
    if (pageIndex > 0) {
      lock();
      setPageIndex((p) => p - 1);
    }
  };

  const currentFrame = pageIndex >= framesStart && pageIndex <= framesEnd ? frames[pageIndex - framesStart] : null;
  const timerLocked = Boolean(currentFrame?.lockSeconds) && lockExpiredFor !== pageIndex;

  const guardedAdvance = () => {
    if (timerLocked) return;
    advance();
  };
  const guardedRetreat = () => {
    if (timerLocked) return;
    retreat();
  };

  const completeGame = () => {
    if (exiting) return;
    setPageIndex((p) => p + 1);
  };

  useEffect(() => {
    if (!currentFrame?.lockSeconds) return undefined;
    const lockedPage = pageIndex;
    const timer = setTimeout(() => {
      setLockExpiredFor(lockedPage);
      advanceRef.current();
    }, currentFrame.lockSeconds * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  const clickGesture = useClickGesture({ onAdvance: guardedAdvance });
  const swipeGesture = useSwipeGesture({ onAdvance: guardedAdvance, onRetreat: guardedRetreat });
  const dragGesture = useDragGesture({ onAdvance: guardedAdvance, onRetreat: guardedRetreat });
  const scrollGesture = useScrollGesture({ onAdvance: guardedAdvance, onRetreat: guardedRetreat });
  const gesture = interaction === "drag" ? dragGesture : interaction === "swipe" ? swipeGesture : interaction === "scroll" ? scrollGesture : clickGesture;

  const handleKeyDown = (event) => {
    if (hasGamePage && pageIndex === gamePageIndex) return;
    if (["ArrowRight", "ArrowDown", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      guardedAdvance();
    } else if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      guardedRetreat();
    }
  };

  const handleExitEnd = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  const pageStyle = interaction === "drag" && dragGesture.dragging
    ? { transform: `translateY(${-dragGesture.dragOffset}px)` }
    : undefined;

  const isTitleCard = pageIndex === 0;
  const isGamePage = hasGamePage && pageIndex === gamePageIndex;
  const isFinalPage = Boolean(finalPage) && pageIndex === totalPages - 1;
  const isLastFrame = pageIndex === framesEnd;

  return (
    <section
      id={id}
      className={`chapter-player chapter-player--${accent} ${exiting ? `chapter-player--exiting chapter-player--exit-${exitTransition}` : ""}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onAnimationEnd={exiting ? handleExitEnd : undefined}
      aria-label={`${chapter}: ${title}, page ${pageIndex + 1} of ${totalPages}`}
      {...(!isGamePage ? gesture.handlers : {})}
    >
      {track && (
        <audio
          ref={audioRef}
          src={track}
          loop
          preload="none"
          onLoadedMetadata={seekTrackToStart}
          onTimeUpdate={holdTrackStart}
        />
      )}
      <header className="chapter-player__rail">
        <button
          className={`chapter-player__sound ${soundOn ? "on" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            setSoundOn((current) => !current);
          }}
          aria-label={soundOn ? "Turn background music off" : "Turn background music on"}
        >
          {soundOn ? "SOUND ON" : "SOUND OFF"}
        </button>
      </header>

      <div className="chapter-player__page" key={pageIndex} style={pageStyle} data-direction={interaction === "swipe" ? swipeGesture.direction : undefined}>
        {isTitleCard ? (
          <div className={`chapter-player__title-card ${titleImage ? `chapter-player__title-card--${titleTransition} chapter-player__title-card--wipe-${titleWipeDirection}` : ""}`}>
            {titleImage && (
              <div className="chapter-player__title-visual">
                <img src={titleImage} alt="" loading="eager" decoding="async" />
              </div>
            )}
            <small>{chapter}</small>
            <h2>{title}</h2>
            <p>{subtitle}</p>
            {context && <p className="chapter-player__title-context">{context}</p>}
            <i />
          </div>
        ) : isGamePage ? (
          gamePage(completeGame)
        ) : isFinalPage ? (
          finalPage
        ) : (
          <Frame frame={currentFrame} />
        )}
        {isLastFrame && outro && <p className="chapter-player__outro">{outro}</p>}
      </div>

      <div className="chapter-player__dots" aria-hidden="true">
        {Array.from({ length: totalPages }).map((_, index) => (
          <span key={index} className={index <= pageIndex ? "done" : ""} />
        ))}
      </div>

      {!isFinalPage && !isGamePage && (
        <p className="chapter-player__hint">{timerLocked ? "PLAYING…" : HINTS[interaction]}</p>
      )}
    </section>
  );
}

export default ChapterPlayer;
