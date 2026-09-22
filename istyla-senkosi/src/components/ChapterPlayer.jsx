import VideoBridge from "./VideoBridge";
import FashionAlbum from "./FashionAlbum";
import CrossfadePhoto from "./CrossfadePhoto";
import ConverseLacing from "./games/ConverseLacing";
import { useSessionState } from "../hooks/useSessionState";
import { useEffect, useRef, useState } from "react";
import { useClickGesture, useDragGesture, useScrollGesture, useSwipeGesture } from "../hooks/useFrameGesture";
import { useSectionAudio } from "../hooks/useSectionAudio";
import { useNavigation } from "../context/NavigationContext";
import StitchedNarrative from "./StitchedNarrative";
import MemoryFlipbook from "./MemoryFlipbook";
import { reverseScroll } from "../utils/reverseScroll";
import SkhothaneOutfit from "./games/SkhothaneOutfit";

import ShoeShine from "./games/ShoeShine";
import { useContinuousZoom } from "../hooks/useContinuousZoom";
import "../styles/ChapterPlayer.css";

const LOCK_MS = 340;

const HINTS = {
  drag: "DRAG UP TO CONTINUE",
  click: "TAP TO CONTINUE",
  swipe: "SWIPE TO CONTINUE",
  scroll: "SCROLL TO CONTINUE",
};

const STORY_BEATS = {
  observe: "LOOK CLOSER",
  voices: "LET THEM SPEAK",
  memory: "JAMA'S MEMORY",
  reflection: "WHAT JAMA CARRIES FORWARD",
};

function Frame({ frame, galleryIndex = 0, galleryDragOffset = 0, galleryDragging = false, directGalleryDrag = false, visualOnly = false, showStory = true, onTextComplete, videoUnlocked = true, videoExiting = false, onVideoProgress, onVideoStarted, allowVideoSound = true, onNextChapter, interactionsReady = true }) {
  const { soundOn, setSoundOn } = useNavigation();
  const videoRef = useRef(null);
  const [videoNeedsStart, setVideoNeedsStart] = useState(false);
  const [clipStarted, setClipStarted] = useState(false);
  const watched = useRef(0);
  const lastVideoTime = useRef(frame.videoStart || 0);
  const photoRef = useRef(null);
  useContinuousZoom(photoRef, frame.motion === "zoom" && !visualOnly, frame.image);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = visualOnly || !allowVideoSound || !clipStarted || !soundOn;
    if (!videoExiting) video.volume = 1;
    if ((!videoUnlocked && !videoExiting) || visualOnly || (allowVideoSound && !clipStarted)) { video.pause(); return; }
    if (video.paused) video.play().then(() => setVideoNeedsStart(false)).catch(() => setVideoNeedsStart(true));
  }, [videoUnlocked, videoExiting, visualOnly, soundOn, allowVideoSound, clipStarted]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoExiting) return;
    const initialVolume = video.volume;
    const started = performance.now();
    let animation;
    const fade = (now) => {
      const progress = Math.min(1, (now - started) / 3000);
      video.volume = initialVolume * (1 - progress);
      if (progress < 1) animation = requestAnimationFrame(fade);
      else video.pause();
    };
    animation = requestAnimationFrame(fade);
    return () => cancelAnimationFrame(animation);
  }, [videoExiting]);
  const startClipWithSound = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video || !videoUnlocked) return;
    if (allowVideoSound) setSoundOn(true);
    video.defaultMuted = false;
    video.muted = !allowVideoSound;
    video.volume = 1;
    setClipStarted(true);
    video.play()
      .then(() => { setVideoNeedsStart(false); onVideoStarted?.(); })
      .catch(() => { setClipStarted(false); setVideoNeedsStart(true); });
  };
  const seekToStart = () => {
    if (frame.videoStart && videoRef.current) videoRef.current.currentTime = frame.videoStart;
  };
  const holdStart = () => {
    if (frame.videoStart && videoRef.current && videoRef.current.currentTime < frame.videoStart - 1) {
      videoRef.current.currentTime = frame.videoStart;
    }
    const video = videoRef.current;
    if (!frame.playSeconds || !video || !videoUnlocked || visualOnly || video.seeking) return;
    const delta = video.currentTime - lastVideoTime.current;
    lastVideoTime.current = video.currentTime;
    if (delta > 0 && delta < 1.5) watched.current += delta;
    onVideoProgress?.(Math.min(frame.playSeconds, watched.current));
  };
  return (
    <>
      <div inert={!visualOnly && !interactionsReady} className={`chapter-player__visual ${frame.motion ? `chapter-player__visual--${frame.motion}` : ""} ${frame.kind ? `chapter-player__visual--${frame.kind}` : ""}`}>
        {frame.kind === "fashion-wall" ? (
          <FashionAlbum images={frame.collage} label={frame.collageLabel || "Swenka fashion collage"} crossfade={frame.galleryStyle === "crossfade"} visualOnly={visualOnly}/>
        ) : frame.galleryStyle === "crossfade" && frame.collage ? (
          <div className="chapter-player__gallery-track" style={{ "--gallery-columns":frame.collage.length }}>
            {frame.collage.map((src, index) => <CrossfadePhoto key={src} images={frame.collage} index={index} alt={frame.alt || "Pantsula fashion photograph"} paused={visualOnly}/>) }
          </div>
        ) : frame.motion === "gallery" && frame.collage ? (
          <div className={`chapter-player__gallery-track ${frame.galleryStyle === "alternate" ? "chapter-player__gallery-track--alternate" : ""} ${directGalleryDrag ? "chapter-player__gallery-track--direct" : ""} ${galleryDragging ? "is-dragging" : ""}`} style={{ "--gallery-progress": Math.max(0, Math.min(frame.collage.length - 1, galleryIndex + galleryDragOffset / 160)) / Math.max(1, frame.collage.length - 1), "--gallery-columns": frame.collage.length }}>
            {frame.collage.map((src) => (
              <div className="chapter-player__gallery-photo" key={src}>
                <div className="chapter-player__gallery-scroll">
                <img src={src} alt={frame.alt || ""} loading="eager" decoding="async" />
                </div>
              </div>
            ))}
          </div>
        ) : frame.kind === "memory-album" && frame.collage ? (
          <MemoryFlipbook images={frame.collage} paused={visualOnly} photoAlbum={frame.photoAlbum} albumLabel={frame.albumLabel} titles={frame.albumTitles} />
        ) : frame.collage ? (
          <div className={`chapter-player__collage chapter-player__collage--${frame.collage.length}`}>
            {frame.collage.map((src, index) => (
              <img key={src} src={src} alt={frame.alt || ""} loading="lazy" decoding="async" style={{ animationDelay: `${index * -1.2}s` }} />
            ))}
          </div>
        ) : frame.video ? (
          <>
            <video ref={videoRef} src={frame.video} playsInline loop={!frame.playSeconds} preload="auto" onEnded={() => { if (!visualOnly && videoUnlocked) onVideoProgress?.(frame.playSeconds); }} onLoadedMetadata={seekToStart} onTimeUpdate={holdStart} onSeeked={() => { lastVideoTime.current = videoRef.current.currentTime; }} />
            {!visualOnly && videoUnlocked && ((allowVideoSound && !clipStarted) || videoNeedsStart) && <button className="chapter-player__video-start" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={startClipWithSound}>{allowVideoSound ? "Click to hear them speak" : "Play video"}</button>}
          </>
        ) : (
          <img ref={photoRef} src={frame.image} alt={frame.alt || ""} loading="lazy" decoding="async" />
        )}
      </div>
      {!visualOnly && showStory && !frame.video && <div className={`chapter-player__story ${frame.storyRole ? `chapter-player__story--${frame.storyRole}` : ""}`}>
      {frame.storyRole && <p className="chapter-player__story-beat">{STORY_BEATS[frame.storyRole]}</p>}
      {frame.label && <p className="chapter-player__label">{frame.label}</p>}
      {frame.text && <StitchedNarrative key={frame.text} text={frame.text} animation={frame.textStyle === "float" ? "float" : "needle"} highlightedPhrases={frame.highlightedPhrases || ["my cousin", "Jama", "Soweto", "rhythm", "style", "Johannesburg"]} chapterColour={frame.chapterColour} timing={frame.narrativeTiming} placement={frame.textPlacement || "lower-left"} onComplete={onTextComplete} />}
      {frame.caption && <p className="chapter-player__caption">{frame.caption}</p>}
      {frame.nextChapter && <button className="chapter-player__next-chapter" disabled={!interactionsReady} type="button" onPointerDown={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); onNextChapter?.(frame.nextChapter); }}>{frame.nextChapterLabel} <span aria-hidden="true">→</span></button>}
      {frame.kind === "hold" && <p className="chapter-player__hold">HOLD 6 TO 8 SECONDS</p>}
      </div>}
    </>
  );
}

function GamePage({ renderGame, onComplete }) {
  return renderGame(onComplete);
}

function ChapterPlayer({ id, chapter, title, subtitle, context, accent = "mustard", interaction, frames, outro, gamePage, gamePosition = "beforeFrames", finalPage, exitTransition = "fade", titleImage, titleTransition = "dissolve", titleWipeDirection = "left", track, nextTrack, trackStart, sharedAudioRef, onComplete }) {
  const [pageIndex, setPageIndex] = useSessionState(`${id}:page`, 0, (value) => Number.isInteger(value) && value >= 0 && value < 1 + frames.length + Number(Boolean(gamePage)) + Number(Boolean(finalPage)));
  const [videoBridge, setVideoBridge] = useState(null);
  const [threadLeaving, setThreadLeaving] = useState(false);
  const [videoSeconds, setVideoSeconds] = useState(0);
  const [videoStarted, setVideoStarted] = useState(false);
  const [shoeUnlocked, setShoeUnlocked] = useState(false);
  const [lacesUnlocked, setLacesUnlocked] = useState(false);
  const [outfitUnlocked, setOutfitUnlocked] = useState(false);
  const titlePhotoRef = useRef(null);
  const [finishedText, setFinishedText] = useState({});
  const goToPage = (target) => {
    setThreadLeaving(false);
    setVideoSeconds(0);
    setVideoStarted(false);
    setFinishedText({});
    setShoeUnlocked(false);
    setLacesUnlocked(false);
    setOutfitUnlocked(false);
    setLockExpiredFor(null);
    setPageIndex(target);
  };
  const finishText = (kind) => setFinishedText((done) => done[kind] ? done : { ...done, [kind]: true });
  const [exiting, setExiting] = useState(false);
  const pendingChapter = useRef(null);
  const { soundOn, setSoundOn, reducedMotion, goTo, goBackChapter } = useNavigation();
  useContinuousZoom(titlePhotoRef, (id === "introduction" || id === "swenka" || id === "pantsula") && pageIndex === 0, pageIndex);
  const [galleryIndex, setGalleryIndex] = useSessionState(`${id}:gallery`, 0, (value) => Number.isInteger(value) && value >= 0 && value < Math.max(1, ...frames.map((frame) => frame.collage?.length || 0)));
  const [frameTransition, setFrameTransition] = useState(null);
  const transitionTimer = useRef(null);
  const [lockExpiredFor, setLockExpiredFor] = useState(null);
  const lockedRef = useRef(false);
  const completedRef = useRef(false);
  const localAudioRef = useRef(null);
  const audioRef = sharedAudioRef || localAudioRef;
  const advanceRef = useRef(() => {});
  const hasGamePage = Boolean(gamePage);
  const gameAfterFrames = hasGamePage && gamePosition === "afterFrames";
  const gamePageIndex = hasGamePage ? (gameAfterFrames ? frames.length + 1 : 1) : null;
  const framesStart = 1 + (hasGamePage && !gameAfterFrames ? 1 : 0);
  const framesEnd = framesStart + frames.length - 1;
  const totalPages = 1 + frames.length + (hasGamePage ? 1 : 0) + (finalPage ? 1 : 0);
  const lastFrameIndex = totalPages - 1;
  useEffect(() => {
    try { sessionStorage.setItem(`istyla:${id}:last-page`, JSON.stringify(lastFrameIndex)); } catch { /* Optional navigation persistence. */ }
  }, [id, lastFrameIndex]);
  const currentFrame = pageIndex >= framesStart && pageIndex <= framesEnd ? frames[pageIndex - framesStart] : null;
  const lacesLocked = Boolean(currentFrame?.laceGate && !lacesUnlocked);
  const shoeLocked = Boolean(currentFrame?.shoeShine && !shoeUnlocked);
  const outfitLocked = Boolean(currentFrame?.outfitGate && !outfitUnlocked);
  const sewingLocked = Boolean(
    (pageIndex === 0 && context && !finishedText.context) ||
    (currentFrame?.text && !finishedText.frame) ||
    (pageIndex === framesEnd && outro && !finishedText.outro)
  );
  const calm = () => reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => () => clearTimeout(transitionTimer.current), []);
  useSectionAudio({ id, audioRef, soundOn, nextTrack, duckMusic: Boolean(currentFrame?.video && !outfitLocked && id !== "introduction"), continueWhileLocked: id === "introduction", fadeOut: exiting });

  useEffect(() => {
    if (!exiting || !(reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) || completedRef.current) return;
    completedRef.current = true;
    if (pendingChapter.current) goTo(pendingChapter.current, { intro:true });
    else onComplete();
  }, [exiting, reducedMotion, onComplete, goTo]);

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

  const transitionToPage = (target, direction) => {
    lockedRef.current = true;
    const next = frames[target - framesStart];
    const nextGalleryIndex = direction < 0 && next?.motion === "gallery" ? next.collage.length - 1 : 0;
    setFrameTransition({ next, nextGalleryIndex, direction, motion: currentFrame.motion });
    transitionTimer.current = setTimeout(() => {
      goToPage(target);
      setGalleryIndex(nextGalleryIndex);
      setFrameTransition(null);
      // Let residual wheel events settle after the visual transition.
      transitionTimer.current = setTimeout(() => { lockedRef.current = false; }, 250);
    }, 1400);
  };

  const followThreadToPage = (target) => {
    if (calm()) { goToPage(target); return; }
    lockedRef.current = true;
    setThreadLeaving(true);
    transitionTimer.current = setTimeout(() => {
      goToPage(target);
      lockedRef.current = false;
    }, 700);
  };

  const bridgeToVideo = (frame, reveal) => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setVideoBridge({ text: frame.videoBridge || "I wanted to understand the story behind the style. So I stopped to listen.", reveal });
  };
  const enterVideoPage = (target) => {
    const next = frames[target - framesStart];
    if (!next?.video || next.laceGate || next.outfitGate || next.shoeShine) return false;
    bridgeToVideo(next, () => { goToPage(target); setGalleryIndex(0); });
    return true;
  };

  const advance = () => {
    if (lockedRef.current || exiting || threadLeaving || sewingLocked || shoeLocked || lacesLocked || outfitLocked) return;
    if (currentFrame?.motion === "gallery" && galleryIndex < currentFrame.collage.length - 1) {
      lockedRef.current = true;
      setGalleryIndex((index) => index + 1);
      transitionTimer.current = setTimeout(() => { lockedRef.current = false; }, calm() ? 100 : interaction === "drag" ? 500 : 1450);
      return;
    }
    if (currentFrame?.video && currentFrame.videoOutro && pageIndex < lastFrameIndex) {
      lockedRef.current = true;
      setVideoBridge({
        text: currentFrame.videoOutro,
        outgoing: true,
        reveal: () => { goToPage(pageIndex + 1); setGalleryIndex(0); },
      });
      return;
    }
    if (enterVideoPage(pageIndex + 1)) return;
    if (currentFrame?.motion && pageIndex < lastFrameIndex && !calm()) {
      transitionToPage(pageIndex + 1, 1);
      return;
    }
    if (pageIndex < lastFrameIndex) {
      lock();
      setGalleryIndex(0);
      followThreadToPage(pageIndex + 1);
    } else {
      setExiting(true);
    }
  };

  useEffect(() => {
    advanceRef.current = advance;
  });

  const retreat = () => {
    if (lockedRef.current || exiting || threadLeaving) return;
    if (pageIndex === 0) { goBackChapter(); return; }
    if (currentFrame?.motion === "gallery" && galleryIndex > 0) {
      lockedRef.current = true;
      setGalleryIndex((index) => index - 1);
      transitionTimer.current = setTimeout(() => { lockedRef.current = false; }, calm() ? 100 : interaction === "drag" ? 500 : 1450);
      return;
    }
    if (currentFrame?.motion && pageIndex > framesStart && !calm()) {
      transitionToPage(pageIndex - 1, -1);
      return;
    }
    if (pageIndex > 0) {
      lock();
      const previous = frames[pageIndex - 1 - framesStart];
      setGalleryIndex(previous?.motion === "gallery" ? previous.collage.length - 1 : 0);
      followThreadToPage(pageIndex - 1);
    }
  };

  const timerLocked = Boolean(currentFrame?.playSeconds) || (Boolean(currentFrame?.lockSeconds) && lockExpiredFor !== pageIndex);
  const updateVideoProgress = (seconds) => {
    setVideoSeconds(Math.floor(seconds));
    // Begin the dissolve while the last three seconds are still playing.
    const fadeStart = currentFrame.playSeconds - (currentFrame.videoOutro ? 3 : 0);
    if (seconds >= fadeStart) advance();
  };

  const guardedAdvance = () => {
    if (timerLocked) return;
    advance();
  };
  const guardedRetreat = () => {
    retreat();
  };

  const completeGame = () => {
    if (exiting || lockedRef.current) return;
    if (enterVideoPage(pageIndex + 1)) return;
    if (pageIndex === lastFrameIndex) setExiting(true);
    else goToPage((p) => p + 1);
  };

  useEffect(() => {
    if (!currentFrame?.lockSeconds || shoeLocked || (currentFrame.video && !videoStarted)) return undefined;
    const lockedPage = pageIndex;
    const timer = setTimeout(() => {
      setLockExpiredFor(lockedPage);
      advanceRef.current();
    }, currentFrame.lockSeconds * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, shoeLocked, videoStarted]);

  const clickGesture = useClickGesture({ onAdvance: guardedAdvance });
  const swipeGesture = useSwipeGesture({ onAdvance: guardedAdvance, onRetreat: guardedRetreat });
  const dragGesture = useDragGesture({ onAdvance: guardedAdvance, onRetreat: guardedRetreat, enabled: !sewingLocked && !timerLocked && !shoeLocked && !lacesLocked && !outfitLocked && !exiting && !threadLeaving && !frameTransition && !videoBridge, canStart: () => !lockedRef.current });
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

  const handleExitEnd = (event) => {
    if (event.target !== event.currentTarget) return;
    if (completedRef.current) return;
    completedRef.current = true;
    if (pendingChapter.current) goTo(pendingChapter.current, { intro:true });
    else onComplete();
  };
  const leaveForChapter = (chapterId) => {
    if (exiting) return;
    pendingChapter.current = chapterId;
    setExiting(true);
  };

  const pageStyle = !sewingLocked && currentFrame?.motion !== "gallery" && interaction === "drag" && dragGesture.dragging
    ? { transform: `translateY(${-dragGesture.dragOffset}px)` }
    : undefined;

  const isTitleCard = pageIndex === 0;
  const isGamePage = hasGamePage && pageIndex === gamePageIndex;
  const isFinalPage = Boolean(finalPage) && pageIndex === totalPages - 1;
  const isLastFrame = pageIndex === framesEnd;
  const containAlbumScroll = (event) => {
    if (currentFrame?.kind === "memory-album" && window.matchMedia("(max-width: 1000px), (max-height: 700px)").matches) event.stopPropagation();
  };

  return (
    <section
      id={id}
      className={`chapter-player chapter-player--${accent} ${exiting ? `chapter-player--exiting chapter-player--exit-${exitTransition}` : ""}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onWheelCapture={(event) => reverseScroll(event, guardedRetreat)}
      onAnimationEnd={exiting ? handleExitEnd : undefined}
      aria-label={`${chapter}: ${title}, page ${pageIndex + 1} of ${totalPages}`}
      {...(!isGamePage ? { ...gesture.handlers, ...(interaction !== "drag" ? { onWheel: scrollGesture.handlers.onWheel } : {}), onDragStart: (event) => event.preventDefault() } : interaction !== "drag" ? { onWheel: (event) => { if (event.deltaY < 0) scrollGesture.handlers.onWheel(event); } } : {})}
    >
      {track && !sharedAudioRef && (
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
          type="button"
          className={`chapter-player__sound ${soundOn ? "on" : ""}`}
          onPointerDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setSoundOn((current) => !current);
          }}
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
          aria-pressed={soundOn}
        >
          {soundOn ? "SOUND ON" : "SOUND OFF"}
        </button>
      </header>

      {frameTransition?.next && !frameTransition.next.video && <div className="chapter-player__incoming" aria-hidden="true"><Frame frame={frameTransition.next} galleryIndex={frameTransition.nextGalleryIndex} visualOnly /></div>}
      {isGamePage && pageIndex > 0 && <button type="button" className="chapter-player__back-story" onClick={guardedRetreat}>← Back to the story</button>}
      <div className={`chapter-player__page ${currentFrame?.motion ? "chapter-player__page--cinematic" : ""} ${frameTransition ? `chapter-player__page--leaving-${frameTransition.motion}` : ""} ${threadLeaving ? "chapter-player__page--leaving-thread" : ""}`} key={pageIndex} style={pageStyle} data-travel={frameTransition?.direction} data-direction={interaction === "swipe" ? swipeGesture.direction : undefined} onWheel={containAlbumScroll} onPointerDown={containAlbumScroll} onPointerUp={containAlbumScroll}>
        {isTitleCard ? (
          <div className={`chapter-player__title-card ${titleImage ? `chapter-player__title-card--${titleTransition} chapter-player__title-card--wipe-${titleWipeDirection}` : ""}`}>
            {titleImage && (
              <div className="chapter-player__title-visual">
                <img ref={titlePhotoRef} src={titleImage} alt="" loading="eager" decoding="async" />
              </div>
            )}
            <small>{chapter}</small>
            <h2>{title}</h2>
            <p>{subtitle}</p>
            {context && <div className="chapter-player__title-context"><StitchedNarrative key={context} text={context} animation="float" placement="inline" highlightedPhrases={["my cousin", "Jama", "Soweto"]} onComplete={() => finishText("context")} /></div>}
            <i />
          </div>
        ) : isGamePage ? (
          <GamePage renderGame={gamePage} onComplete={completeGame} />
        ) : isFinalPage ? (
          finalPage
        ) : lacesLocked || outfitLocked ? null : (
          <Frame frame={currentFrame} showStory={!videoBridge?.outgoing} interactionsReady={!sewingLocked} galleryIndex={galleryIndex} directGalleryDrag={interaction === "drag"} galleryDragOffset={interaction === "drag" ? dragGesture.dragOffset : 0} galleryDragging={interaction === "drag" && dragGesture.dragging} videoExiting={Boolean(videoBridge?.outgoing)} videoUnlocked={!videoBridge && !shoeLocked && !lacesLocked && !outfitLocked} allowVideoSound={id !== "introduction"} onNextChapter={leaveForChapter} onVideoStarted={() => setVideoStarted(true)} onTextComplete={() => finishText("frame")} onVideoProgress={updateVideoProgress} />
        )}
        {isLastFrame && outro && <div className="chapter-player__outro"><StitchedNarrative key={outro} text={outro} placement="inline" onComplete={() => finishText("outro")} /></div>}
        {currentFrame?.kind === "memory-album" && <nav className="album-story-controls" aria-label="Continue the chapter" onClick={(event) => event.stopPropagation()} onPointerDown={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
          <button type="button" onClick={guardedRetreat}>Back to the story</button>
          <button type="button" disabled={sewingLocked} onClick={guardedAdvance}>Continue the story →</button>
        </nav>}
      </div>

      {videoBridge && <VideoBridge outgoing={videoBridge.outgoing} text={videoBridge.text} onCovered={videoBridge.reveal} onComplete={() => { setVideoBridge(null); lockedRef.current = false; }} />}
      {lacesLocked && <ConverseLacing key={pageIndex} onBack={guardedRetreat} onComplete={() => bridgeToVideo(currentFrame, () => setLacesUnlocked(true))} />}
      {outfitLocked && <SkhothaneOutfit audioRef={audioRef} onBack={guardedRetreat} onComplete={() => bridgeToVideo(currentFrame, () => setOutfitUnlocked(true))} />}
      {shoeLocked && <ShoeShine onComplete={() => bridgeToVideo(currentFrame, () => setShoeUnlocked(true))} />}
      {currentFrame?.playSeconds && !shoeLocked && !lacesLocked && !outfitLocked && <div className="chapter-player__video-skip" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
        <span>{Math.floor(videoSeconds)} / {currentFrame.playSeconds} seconds</span>
        <button type="button" disabled={videoSeconds < currentFrame.skipAfter} onClick={() => { if (videoSeconds >= currentFrame.skipAfter) advance(); }}>{videoSeconds < currentFrame.skipAfter ? `Skip in ${Math.ceil(currentFrame.skipAfter - videoSeconds)}s` : "Skip video →"}</button>
      </div>}
      <div className="chapter-player__dots" aria-hidden="true">
        {Array.from({ length: totalPages }).map((_, index) => (
          <span key={index} className={index <= pageIndex ? "done" : ""} />
        ))}
      </div>

      {!isFinalPage && !isGamePage && !shoeLocked && !lacesLocked && !outfitLocked && (
        <p className="chapter-player__hint">{currentFrame?.video && id !== "introduction" && !videoStarted ? "CLICK TO HEAR THEM SPEAK" : sewingLocked ? "FOLLOW THE THREAD…" : timerLocked ? "PLAYING…" : currentFrame?.motion === "gallery" && galleryIndex < currentFrame.collage.length - 1 ? HINTS[interaction].replace("CONTINUE", "EXPLORE PHOTOS") : HINTS[interaction]}</p>
      )}
    </section>
  );
}

export default ChapterPlayer;
