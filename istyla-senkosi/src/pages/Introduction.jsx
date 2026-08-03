import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetChapterReady } from "../context/ChapterReadyContext";
import VideoIntro from "../components/VideoIntro";
import johannesburgMap from "../assets/Introduction/Map of Johannesburg.png";
import welcomeVideo from "../assets/Introduction/Intro- Video.mp4";
import backgroundTrack from "../assets/audio/Music/Kwesta - Spirit (Official Music Video) ft Wale ft. Wale (Intro page).mp3";
import img1976 from "../assets/Chapter 1_Swenka/Images/Editorial/1976- Man with suit.jpg";
import imgFashionEditorial from "../assets/Chapter 1_Swenka/Images/Editorial/Fashion editorial September 2020.jpg";
import imgInkabiNation from "../assets/Chapter 1_Swenka/Images/Editorial/Inkabi nation.jpg";
import imgPinstripeJacket from "../assets/Chapter 1_Swenka/Images/Editorial/Man with pinstripe jacket.jpg";
import imgYellowBlueSuit from "../assets/Chapter 1_Swenka/Images/Editorial/Man with yellow and blue suit.jpg";
import imgKabeloWanda from "../assets/Chapter 1_Swenka/Images/Editorial/Portrait of Kabelo Kungwane and Wanda Lephoto.jpg";
import imgApartheidPortraits from "../assets/Chapter 1_Swenka/Images/Editorial/Portraits from apartheid-era South Africa - in pictures , Art and design , The Guardian.jpg";
import imgNinetiesAesthetic from "../assets/Chapter 1_Swenka/Images/Editorial/South Africa 90's 80's aesthetic.jpg";
import imgSterkfontein from "../assets/Chapter 1_Swenka/Images/Editorial/Sterkfontein. Cradle of Humankind..jpg";
import imgWandaKabeloBraam from "../assets/Chapter 1_Swenka/Images/Editorial/Wanda Lephoto x Kabelo Kungwane Location , Braamfontein, Johannesburg.jpg";
import imgXhosaInitiates from "../assets/Chapter 1_Swenka/Images/Editorial/Xhosa initiates after circumcision by Pieter Hugo.jpg";
import imgXhosaMen from "../assets/Chapter 1_Swenka/Images/Editorial/Xhosa men.jpg";
import imgAmadoda from "../assets/Chapter 1_Swenka/Images/Editorial/amadoda akwaXhosa.jpg";
import "../styles/Introduction.css";

const DRAG_RANGE = 340;
const NORTH_FOCUS = { x: 50, y: 16 };
const SOUTHWEST_FOCUS = { x: 21, y: 61 };
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const EDITORIAL_GALLERY = [
  img1976,
  imgFashionEditorial,
  imgInkabiNation,
  imgPinstripeJacket,
  imgYellowBlueSuit,
  imgKabeloWanda,
  imgApartheidPortraits,
  imgNinetiesAesthetic,
  imgSterkfontein,
  imgWandaKabeloBraam,
  imgXhosaInitiates,
  imgXhosaMen,
  imgAmadoda,
];

function Introduction() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [introSeen, setIntroSeen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const pathRef = useRef(null);
  const audioRef = useRef(null);
  const drag = useRef({ active: false, startY: 0, startProgress: 0 });
  const ready = progress >= 0.92;
  useSetChapterReady(ready);

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => setShowGallery(true), 1400);
    return () => clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    if (!introSeen) return undefined;
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.muted = muted;
    audio.play().catch(() => {});

    const resumeOnFirstInteraction = () => {
      if (!audio.muted) audio.play().catch(() => {});
    };
    window.addEventListener("pointerdown", resumeOnFirstInteraction, { once: true });
    window.addEventListener("keydown", resumeOnFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", resumeOnFirstInteraction);
      window.removeEventListener("keydown", resumeOnFirstInteraction);
    };
  }, [introSeen, muted]);

  const toggleSound = () => setMuted((current) => !current);

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

  const pathLength = pathRef.current ? pathRef.current.getTotalLength() : 0;
  const handlePoint = pathLength ? pathRef.current.getPointAtLength(progress * pathLength) : { x: 172, y: 60 };
  const mapX = NORTH_FOCUS.x + (SOUTHWEST_FOCUS.x - NORTH_FOCUS.x) * progress;
  const mapY = NORTH_FOCUS.y + (SOUTHWEST_FOCUS.y - NORTH_FOCUS.y) * progress;

  if (!introSeen) {
    return <VideoIntro src={welcomeVideo} label="THE JOURNEY BEGINS" onFinish={() => setIntroSeen(true)} />;
  }

  return (
    <main className="introduction content-fade-in">
      <audio ref={audioRef} src={backgroundTrack} loop muted={muted} autoPlay />
      <header className="intro-header">
        <div className="intro-header-left">
          <Link to="/">HOME</Link>
          <button className={`intro-sound-toggle ${muted ? "" : "on"}`} onClick={toggleSound} aria-label={muted ? "Turn background music on" : "Turn background music off"}>{muted ? "SOUND OFF" : "SOUND ON"}<span aria-hidden="true" /></button>
        </div>
        <span>INTRODUCTION / 02</span>
      </header>
      {showGallery ? (
        <section className="editorial-gallery">
          <div className="gallery-collage" aria-hidden="true">
            {EDITORIAL_GALLERY.map((src, index) => (
              <img key={src} src={src} alt="" style={{ animationDelay: `${index * -1.4}s` }} />
            ))}
          </div>
          <div className="gallery-overlay">
            <p className="gallery-kicker">A visual reference</p>
            <h2>EDITORIAL ARCHIVE</h2>
            <button className="gallery-continue" onClick={() => navigate("/swenka")}>CONTINUE <span>→</span></button>
          </div>
        </section>
      ) : (
      <section className="journey-map">
        <div className={`journey-mapbg ${hasStarted ? "visible" : ""}`} aria-hidden="true">
          <img src={johannesburgMap} alt="" style={{ objectPosition: `${mapX}% ${mapY}%` }} />
        </div>
        <p className="intro-label">A journey through place, style and identity</p>
        <div className="place north"><b>Johannesburg</b><span>North</span><i /></div>
        <svg className="journey-line" viewBox="0 0 300 430" aria-hidden="true">
          <path ref={pathRef} d="M172 60 C162 128 146 173 185 215 S129 290 154 352" />
          <circle className="journey-end" cx="154" cy="352" r="12" />
          {!hasStarted && <text className="drag-hint" x={handlePoint.x + 20} y={handlePoint.y + 4}>DRAG DOWN</text>}
          {!hasStarted && <circle className="journey-ping" cx={handlePoint.x} cy={handlePoint.y} r="9" />}
          {!hasStarted && <circle className="journey-ping journey-ping-delay" cx={handlePoint.x} cy={handlePoint.y} r="9" />}
          <circle
            className={`journey-handle ${!hasStarted ? "idle" : ""}`}
            cx={handlePoint.x}
            cy={handlePoint.y}
            r="9"
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
        <div className="place soweto"><b>Soweto</b><i /></div>
        <div className="intro-copy"><h1>I&apos;VE ALWAYS<br />BEEN FROM HERE<span>...</span></h1><p>This is my journey back to understand.</p></div>
        <button className="scroll-cue" onClick={() => setShowGallery(true)} aria-label="Continue to the editorial archive"><span>SCROLL</span><i aria-hidden="true" /></button>
      </section>
      )}
    </main>
  );
}
export default Introduction;
