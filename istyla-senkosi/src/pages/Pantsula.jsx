import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetChapterReady } from "../context/ChapterReadyContext";
import VideoIntro from "../components/VideoIntro";
import entryVideo from "../assets/Chapter 2_Pantsula/Video/Intro Video- Pantsula.mp4";
import readyImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-0-ready.jpg";
import stanceImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-1-stance.jpg";
import stepImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-2-step.jpg";
import rhythmImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-3-rhythm.jpg";
import swingImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-4-swing.jpg";
import finaleImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-5-finale.jpg";
import editorial1 from "../assets/Chapter 2_Pantsula/Images/Editorial/Light Summer Knits Dropping Friday Online - Link on bio.CPT- @brokeklubhouse (53 Wale street, Ca (1).jpg";
import editorial2 from "../assets/Chapter 2_Pantsula/Images/Editorial/Light Summer Knits Dropping Friday Online - Link on bio.CPT- @brokeklubhouse (53 Wale street, Ca.jpg";
import editorial3 from "../assets/Chapter 2_Pantsula/Images/Editorial/Light Summer Knits Dropping Friday Online - Link on bio.CPT- @brokeklubhouse.jpg";
import editorial4 from "../assets/Chapter 2_Pantsula/Images/Editorial/Mafioso Season 4 exclusively dropping today at the BROKE BOOTSALECatch the drop @brokeklubhouse .jpg";
import backgroundTrack from "../assets/audio/Music/TKZee - Dlala Mapantsula (archive and chapter intro song).mp3";
import "../styles/Pantsula.css";

const beats = ["STANCE", "STEP", "RHYTHM", "SWING", "FINALE"];
const beatNotes = [110, 147, 165, 196, 220];
const sceneImages = [readyImage, stanceImage, stepImage, rhythmImage, swingImage, finaleImage];
const EDITORIAL_GALLERY = [editorial1, editorial2, editorial3, editorial4];

function Pantsula() {
  const navigate = useNavigate();
  const [activeBeat, setActiveBeat] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [introSeen, setIntroSeen] = useState(false);
  const [showGallery, setShowGallery] = useState(true);
  const audioContext = useRef(null);
  const audioRef = useRef(null);
  const ready = activeBeat === beats.length;
  useSetChapterReady(ready);

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => navigate("/skhothane"), 1400);
    return () => clearTimeout(timer);
  }, [ready, navigate]);

  useEffect(() => {
    if (!introSeen) return undefined;
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.muted = !soundOn;
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
  }, [introSeen, soundOn]);

  const playBeat = (index) => {
    if (!soundOn) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext.current ??= new AudioContext();
    const context = audioContext.current;
    if (context.state === "suspended") context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index % 2 ? "square" : "triangle";
    oscillator.frequency.setValueAtTime(beatNotes[index], context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.32, context.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.26);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.28);
  };

  const activateBeat = (index) => {
    if (index !== activeBeat) return;
    playBeat(index);
    setActiveBeat(index + 1);
  };

  const currentScene = activeBeat === 0 ? "TAP THE FIRST BEAT" : activeBeat === beats.length ? "THE DANCE IS ALIVE" : `${beats[activeBeat - 1]} UNLOCKED`;

  if (!introSeen) {
    return <VideoIntro src={entryVideo} label="02 / PANTSULA" onFinish={() => setIntroSeen(true)} />;
  }

  return <main className="pantsula-page content-fade-in">
    <audio ref={audioRef} src={backgroundTrack} loop muted={!soundOn} autoPlay />
    <header className="pantsula-header"><span>02 / PANTSULA</span><span>MOVE TO THE RHYTHM</span></header>
    {showGallery ? (
      <section className="pantsula-editorial">
        <div className="pantsula-editorial-collage" aria-hidden="true">
          {EDITORIAL_GALLERY.map((src, index) => (
            <img key={src} src={src} alt="" style={{ animationDelay: `${index * -1.4}s` }} />
          ))}
        </div>
        <div className="pantsula-editorial-overlay">
          <p className="pantsula-editorial-kicker">A visual reference</p>
          <h2>EDITORIAL ARCHIVE</h2>
          <button className="pantsula-editorial-continue" onClick={() => setShowGallery(false)}>BEGIN <span>→</span></button>
        </div>
      </section>
    ) : (
      <section className="pantsula-stage">
        <div className="pantsula-copy">
          <p className="chapter-tag">02 / PANTSULA</p>
          <h1>EVERY STEP<br />TELLS A<br />STORY<span>...</span></h1>
          <i />
          <p>TAP EACH BEAT IN ORDER<br />TO BRING MOVEMENT TO LIFE.</p>
          <strong>{currentScene}</strong>
          <button className={`sound-toggle ${soundOn ? "on" : ""}`} onClick={() => setSoundOn(!soundOn)}>{soundOn ? "SOUND ON" : "SOUND OFF"}<span aria-hidden="true" /></button>
        </div>
        <div className={`pantsula-image scene-${activeBeat}`}>
          <img src={sceneImages[activeBeat]} alt={`Pantsula dance scene: ${activeBeat ? beats[activeBeat - 1] : "ready"}`} />
          <div className="image-overlay"><span>BEAT {activeBeat} / {beats.length}</span><b>{activeBeat ? beats[activeBeat - 1] : "READY"}</b></div>
          <div className="beat-map" aria-label="Pantsula beat map">{beats.map((beat, index) => <button key={beat} className={`beat beat-${index + 1} ${index < activeBeat ? "complete" : ""} ${index === activeBeat ? "ready" : ""}`} disabled={index !== activeBeat} onClick={() => activateBeat(index)} aria-label={`${beat}: ${index < activeBeat ? "complete" : index === activeBeat ? "tap now" : "locked"}`}><span>{index + 1}</span></button>)}</div>
        </div>
      </section>
    )}
  </main>;
}

export default Pantsula;
