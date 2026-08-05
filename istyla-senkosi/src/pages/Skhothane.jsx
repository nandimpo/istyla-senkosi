import { useEffect, useRef, useState } from "react";
import { useRegisterSection } from "../context/ActiveSectionContext";
import { useChapterReady } from "../context/ChapterGateContext";
import { useSectionAudio } from "../hooks/useSectionAudio";
import ChapterVideo from "../components/ChapterVideo";
import entryVideo from "../assets/Chapter 3_Skothane/Video/Intro Video - Skothane.mp4";
import img1 from "../assets/Chapter 3_Skothane/Skothane/skhothane-1.jpg";
import img2 from "../assets/Chapter 3_Skothane/Skothane/skhothane-2.jpg";
import img3 from "../assets/Chapter 3_Skothane/Skothane/skhothane-3.jpg";
import img4 from "../assets/Chapter 3_Skothane/Skothane/skhothane-4.jpg";
import img5 from "../assets/Chapter 3_Skothane/Skothane/skhothane-5.jpg";
import img6 from "../assets/Chapter 3_Skothane/Skothane/skhothane-6.jpg";
import img7 from "../assets/Chapter 3_Skothane/Skothane/skhothane-7.jpg";
import img8 from "../assets/Chapter 3_Skothane/Skothane/skhothane-8.jpg";
import img9 from "../assets/Chapter 3_Skothane/Skothane/skhothane-9.jpg";
import editorial1 from "../assets/Chapter 3_Skothane/Images/Editioral/A Closer Look at the Style of South Africa's Pantsula Dancers.jpg";
import editorial2 from "../assets/Chapter 3_Skothane/Images/Editioral/Vila Coster dancers posing outside a member’s house. - ny times.jpg";
import editorial3 from "../assets/Chapter 3_Skothane/Images/Editioral/tkzee 2.jpg";
import editorial4 from "../assets/Chapter 3_Skothane/Images/Editioral/tkzee.jpg";
import backgroundTrack from "../assets/audio/Music/WOZA MADZALA WOZA IZIKHOTHANE (skothane).mp3";
import "../styles/Skhothane.css";

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];
const EDITORIAL_GALLERY = [editorial1, editorial2, editorial3, editorial4];
const GROUP_SIZE = 3;
const SWIPE_THRESHOLD = 45;

function Skhothane() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showGallery, setShowGallery] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const pointerStartX = useRef(null);
  const audioRef = useRef(null);
  const sectionRef = useRef(null);
  const ready = current === images.length - 1;
  useRegisterSection("skhothane", sectionRef);
  useSectionAudio({ id: "skhothane", audioRef, soundOn });
  useChapterReady("skhothane", ready);

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => {
      document.getElementById("reflection")?.scrollIntoView({ behavior: "smooth" });
    }, 1400);
    return () => clearTimeout(timer);
  }, [ready]);

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
    <section id="skhothane" ref={sectionRef} className="skhothane-page content-fade-in">
      <div className="chapter-opener">
        <ChapterVideo src={entryVideo} className="chapter-opener-video" />
        <div className="chapter-opener-copy">
          <span className="chapter-opener-label">03 / SKHOTHANE</span>
        </div>
      </div>
      <audio ref={audioRef} src={backgroundTrack} loop />
      <header className="skhothane-header"><span>03 / SKHOTHANE</span><span>LUXURY AS LANGUAGE</span></header>
      {showGallery ? (
      <section className="skhothane-editorial">
        <div className="skhothane-editorial-collage" aria-hidden="true">
          {EDITORIAL_GALLERY.map((src, index) => (
            <img key={src} src={src} alt="" style={{ animationDelay: `${index * -1.4}s` }} />
          ))}
        </div>
        <div className="skhothane-editorial-overlay">
          <p className="skhothane-editorial-kicker">A visual reference</p>
          <h2>EDITORIAL ARCHIVE</h2>
          <button className="skhothane-editorial-continue" onClick={() => setShowGallery(false)}>BEGIN <span>→</span></button>
        </div>
      </section>
      ) : (
      <section className="skhothane-stage" id="skhothane-stage">
          <div className="skhothane-copy">
            <p className="chapter-tag">03 / SKHOTHANE</p>
            <h1>STATUS IS A<br />PERFORMANCE<span>...</span></h1>
            <i />
            <p>SKHOTHANE ISN&apos;T JUST ABOUT<br />WHAT YOU WEAR. IT&apos;S ABOUT<br />WHAT IT SAYS.</p>
            <strong>SWIPE THE IMAGE TO<br />REVEAL THE NEXT LOOK</strong>
            <div className="layer-stepper" aria-hidden="true">
              {Array.from({ length: groupCount }).map((_, index) => (
                <span key={index} className={index <= activeGroup ? "done" : ""} />
              ))}
            </div>
            <button className={`skhothane-sound-toggle ${soundOn ? "on" : ""}`} onClick={() => setSoundOn(!soundOn)}>{soundOn ? "SOUND ON" : "SOUND OFF"}<span aria-hidden="true" /></button>
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
                onPointerDown={handlePointerDown}
                onPointerUp={releaseSwipe}
                onPointerCancel={handlePointerCancel}
              />
            )}
          </div>
        </section>
      )}
    </section>
  );
}

export default Skhothane;
