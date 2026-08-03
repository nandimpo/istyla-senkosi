import { useEffect, useRef, useState } from "react";
import { useSetChapterReady } from "../context/ChapterReadyContext";
import VideoIntro from "../components/VideoIntro";
import houseImage from "../assets/Additional Images/Street Visuals/Wattville/House.jpg";
import entryVideo from "../assets/Chapter 4_Reflection/Intro Video - Reflection.mp4";
import backgroundTrack from "../assets/audio/Music/Dudu Manhenga Turn music video by Ziblab (outro song).mp3";
import "../styles/Reflection.css";

const VOLUME_FADE_MS = 2500;
const VOLUME_FADE_STEP_MS = 50;

function Reflection() {
  const [introSeen, setIntroSeen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef(null);
  useSetChapterReady(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.muted = !soundOn;
    audio.volume = 0;
    audio.play().catch(() => {});

    const start = Date.now();
    const interval = setInterval(() => {
      const progress = Math.min(1, (Date.now() - start) / VOLUME_FADE_MS);
      audio.volume = progress;
      if (progress >= 1) clearInterval(interval);
    }, VOLUME_FADE_STEP_MS);
    return () => clearInterval(interval);
  }, [soundOn]);

  return (
    <>
      <audio ref={audioRef} src={backgroundTrack} loop autoPlay />
      {!introSeen ? (
        <VideoIntro src={entryVideo} label="04 / REFLECTION" onFinish={() => setIntroSeen(true)} forceMuted />
      ) : (
        <main className="reflection-page content-fade-in">
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
        </main>
      )}
    </>
  );
}

export default Reflection;
