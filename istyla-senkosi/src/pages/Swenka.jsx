import { useEffect, useRef, useState } from "react";
import { useRegisterSection } from "../context/ActiveSectionContext";
import { useChapterReady } from "../context/ChapterGateContext";
import { useSectionAudio } from "../hooks/useSectionAudio";
import { scrollToChapter } from "../utils/scrollToChapter";
import ChapterVideo from "../components/ChapterVideo";
import entryVideo from "../assets/Chapter 1_Swenka/Video/BLACK GOSLING  EDGARS  REBRAND  SWENKAS (Intro video).mp4";
import portraitImage from "../assets/Chapter 1_Swenka/Images/Editorial/Man with yellow and blue suit.jpg";
import backgroundTrack from "../assets/audio/Music/Miriam Makeba - Welela (Official Video).mp3";
import editorial1 from "../assets/Chapter 1_Swenka/Images/Editorial/1976- Man with suit.jpg";
import editorial2 from "../assets/Chapter 1_Swenka/Images/Editorial/Fashion editorial September 2020.jpg";
import editorial3 from "../assets/Chapter 1_Swenka/Images/Editorial/Inkabi nation.jpg";
import editorial4 from "../assets/Chapter 1_Swenka/Images/Editorial/Man with pinstripe jacket.jpg";
import editorial5 from "../assets/Chapter 1_Swenka/Images/Editorial/Man with yellow and blue suit.jpg";
import editorial6 from "../assets/Chapter 1_Swenka/Images/Editorial/Portrait of Kabelo Kungwane and Wanda Lephoto.jpg";
import editorial7 from "../assets/Chapter 1_Swenka/Images/Editorial/Portraits from apartheid-era South Africa - in pictures , Art and design , The Guardian.jpg";
import editorial8 from "../assets/Chapter 1_Swenka/Images/Editorial/South Africa 90's 80's aesthetic.jpg";
import editorial9 from "../assets/Chapter 1_Swenka/Images/Editorial/Sterkfontein. Cradle of Humankind..jpg";
import editorial10 from "../assets/Chapter 1_Swenka/Images/Editorial/Wanda Lephoto x Kabelo Kungwane Location , Braamfontein, Johannesburg.jpg";
import editorial11 from "../assets/Chapter 1_Swenka/Images/Editorial/Xhosa initiates after circumcision by Pieter Hugo.jpg";
import editorial12 from "../assets/Chapter 1_Swenka/Images/Editorial/Xhosa men.jpg";
import editorial13 from "../assets/Chapter 1_Swenka/Images/Editorial/amadoda akwaXhosa.jpg";
import "../styles/Swenka.css";

const elements = [
  { id: "HAT", zone: { left: 44, top: 6, width: 32, height: 20 }, thumb: { x: 58, y: 15 } },
  { id: "SLEEVE", zone: { left: 14, top: 36, width: 52, height: 32 }, thumb: { x: 38, y: 50 } },
  { id: "SHOES", zone: { left: 18, top: 76, width: 46, height: 22 }, thumb: { x: 40, y: 87 } },
];

const EDITORIAL_GALLERY = [
  editorial1, editorial2, editorial3, editorial4, editorial5, editorial6,
  editorial7, editorial8, editorial9, editorial10, editorial11, editorial12, editorial13,
];

function Swenka() {
  const [placed, setPlaced] = useState([]);
  const [dragged, setDragged] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef(null);
  const sectionRef = useRef(null);
  const ready = placed.length === elements.length;
  useRegisterSection("swenka", sectionRef);
  useSectionAudio({ id: "swenka", audioRef, soundOn });
  useChapterReady("swenka", ready);
  const placeElement = (id) => {
    if (!id || placed.includes(id)) return;
    setPlaced((current) => [...current, id]);
    setDragged(null);
  };

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => scrollToChapter("pantsula"), 1400);
    return () => clearTimeout(timer);
  }, [ready]);

  return <section id="swenka" ref={sectionRef} className="swenka-page content-fade-in">
    <div className="chapter-opener">
      <ChapterVideo src={entryVideo} className="chapter-opener-video" />
      <div className="chapter-opener-copy">
        <span className="chapter-opener-label">01 / SWENKA</span>
      </div>
    </div>
    <audio ref={audioRef} src={backgroundTrack} loop />
    <header className="swenka-header"><span>01 / SWENKA</span><span>THE ART OF PRESENTATION</span></header>
    <section className="swenka-editorial">
      <div className="swenka-editorial-collage" aria-hidden="true">
        {EDITORIAL_GALLERY.map((src, index) => (
          <img key={src} src={src} alt="" style={{ animationDelay: `${index * -1.4}s` }} />
        ))}
      </div>
      <div className="swenka-editorial-overlay">
        <p className="swenka-editorial-kicker">A visual reference</p>
        <h2>EDITORIAL ARCHIVE</h2>
        <a className="swenka-editorial-continue" href="#swenka-stage">BEGIN <span>→</span></a>
      </div>
    </section>
    <section className="swenka-stage" id="swenka-stage">
        <div className="swenka-copy">
          <p className="chapter-tag">01 / SWENKA</p>
          <h1>PRECISION.<br />DISCIPLINE.<br />RESPECT.</h1>
          <p>Swenka is more than style.<br />It&apos;s about how you carry<br />yourself.</p>
          <strong>DRAG THE ELEMENTS<br />ONTO THE PHOTO</strong>
          <i></i>
          <button className={`swenka-sound-toggle ${soundOn ? "on" : ""}`} onClick={() => setSoundOn(!soundOn)}>{soundOn ? "SOUND ON" : "SOUND OFF"}<span aria-hidden="true" /></button>
        </div>
        <div className="fashion-portrait">
          <div className="portrait-frame">
            <img src={portraitImage} alt="A man in a yellow hat and dark suit, mid dance move" />
            {elements.map(({ id, zone }) => {
              const isPlaced = placed.includes(id);
              return (
                <div
                  key={id}
                  className={`puzzle-zone ${isPlaced ? "revealed" : ""}`}
                  style={{ left: `${zone.left}%`, top: `${zone.top}%`, width: `${zone.width}%`, height: `${zone.height}%` }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => placeElement(dragged)}
                  onClick={() => dragged && placeElement(dragged)}
                  role="button"
                  tabIndex={isPlaced ? -1 : 0}
                  aria-label={isPlaced ? `${id} revealed` : `Drop ${id} here`}
                >
                  {!isPlaced && <span>{id}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <aside className="wardrobe">
          <p>ELEMENTS</p>
          {elements.map(({ id, thumb }) => {
            const isPlaced = placed.includes(id);
            return (
              <button
                key={id}
                draggable={!isPlaced}
                disabled={isPlaced}
                onDragStart={() => setDragged(id)}
                onClick={() => setDragged(id)}
                className={`${dragged === id ? "selected" : ""} ${isPlaced ? "used" : ""}`}
              >
                <span className="item-preview" style={{ backgroundImage: `url(${portraitImage})`, backgroundPosition: `${thumb.x}% ${thumb.y}%` }} />
                <span>⠿</span>
                <b>{id}{isPlaced ? " ✓" : ""}</b>
              </button>
            );
          })}
        </aside>
      </section>
  </section>;
}
export default Swenka;
