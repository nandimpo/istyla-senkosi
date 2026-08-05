import { useEffect, useRef, useState } from "react";
import { useActiveSection, useRegisterSection } from "../context/ActiveSectionContext";
import ChapterVideo from "../components/ChapterVideo";
import houseImage from "../assets/Additional Images/Street Visuals/Wattville/House.jpg";
import entryVideo from "../assets/Chapter 4_Reflection/Intro Video - Reflection.mp4";
import backgroundTrack from "../assets/audio/Music/Dudu Manhenga Turn music video by Ziblab (outro song).mp3";
import "../styles/Reflection.css";

const VOLUME_FADE_MS = 2500;
const VOLUME_FADE_STEP_MS = 50;

function Reflection() {
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef(null);
  const sectionRef = useRef(null);
  useRegisterSection("reflection", sectionRef);
  const activeId = useActiveSection();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.muted = !soundOn;
    if (activeId !== "reflection") {
      audio.pause();
      return undefined;
    }
    audio.volume = 0;
    audio.play().catch(() => {});

    const start = Date.now();
    const interval = setInterval(() => {
      const progress = Math.min(1, (Date.now() - start) / VOLUME_FADE_MS);
      audio.volume = progress;
      if (progress >= 1) clearInterval(interval);
    }, VOLUME_FADE_STEP_MS);
    return () => clearInterval(interval);
  }, [activeId, soundOn]);

  return (
    <section id="reflection" ref={sectionRef} className="reflection-page content-fade-in">
      <div className="chapter-opener">
        <ChapterVideo src={entryVideo} className="chapter-opener-video" />
        <div className="chapter-opener-copy">
          <span className="chapter-opener-label">04 / REFLECTION</span>
        </div>
      </div>
      <audio ref={audioRef} src={backgroundTrack} loop />
      <header className="reflection-header"><span>04 / REFLECTION</span><span>WHERE TOWNSHIP FASHION GOES NEXT</span></header>
      <section className="reflection-stage">
        <div className="reflection-copy">
          <p className="chapter-tag">04 / REFLECTION</p>
          <h1>BACK TO WHERE<br />IT ALL BEGAN</h1>
          <i />
          <p>Same streets.<br />Different eyes.<br />Deeper understanding.</p>
          <button className={`reflection-sound-toggle ${soundOn ? "on" : ""}`} onClick={() => setSoundOn(!soundOn)}>{soundOn ? "SOUND ON" : "SOUND OFF"}<span aria-hidden="true" /></button>
        </div>
        <div className="reflection-image">
          <img src={houseImage} alt="A township home in Wattville, where the story began" />
        </div>
      </section>
    </section>
  );
}

export default Reflection;
