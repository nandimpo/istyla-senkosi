import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useRegisterSection } from "../context/ActiveSectionContext";
import { useSectionAudio } from "../hooks/useSectionAudio";
import backgroundTrack from "../assets/audio/Music/Moonchild Sanelly - Yebo Teacher (Intro Song).mp3";
import collage1 from "../assets/Introduction/Images/Black label.jpg";
import collage2 from "../assets/Introduction/Images/Converse.jpg";
import collage3 from "../assets/Introduction/Images/Glasses.jpg";
import collage4 from "../assets/Introduction/Images/Man bending.jpg";
import collage5 from "../assets/Introduction/Images/Wedding.jpg";
import collage6 from "../assets/Introduction/Images/Woman in Township Fashion.jpg";
import "./../styles/Hero.css";

const chapters = [["SWENKA", "Elegant competition and township style", "South Africa", "Past"], ["PANTSULA", "Movement, music and street expression", "South Africa", "1980s – now"], ["SKHOTHANE", "Luxury, confidence and performance", "Townships", "Present"], ["REFLECTION", "Where township fashion goes next", "South Africa", "Future"]];
const menuItems = [["ABOUT", "#about"], ["THE STORY", "#story"], ["CHAPTERS", "#chapters"], ["REFLECTION", "/reflection"]];
const collageImages = [collage1, collage2, collage3, collage4, collage5, collage6];

function Hero() {
  const [panel, setPanel] = useState(null);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);
  const sectionRef = useRef(null);
  const closePanel = () => setPanel(null);
  useRegisterSection("about", sectionRef);
  useSectionAudio({ id: "about", audioRef, soundOn: !muted });

  const toggleSound = () => setMuted((current) => !current);

  return <main className="documentary" id="about" ref={sectionRef}>
    <audio ref={audioRef} src={backgroundTrack} loop />
    <div className="hero-collage" aria-hidden="true">
      {collageImages.map((src, index) => (
        <img key={src} src={src} alt="" style={{ animationDelay: `${index * -1.5}s` }} />
      ))}
    </div>
    <header className="topbar">
      <div className="topbar-left">
        <button className={`sound-control ${muted ? "" : "on"}`} onClick={toggleSound} aria-label={muted ? "Turn background music on" : "Turn background music off"}>{muted ? "SOUND OFF" : "SOUND ON"}<span aria-hidden="true" /></button>
      </div>
      <span>ISTYLA SENKOSI / 01</span>
    </header>
    <section className="hero-content" id="story"><p className="hero-subtitle">Interactive Documentary</p><h1 className="hero-title">I&apos;STYLA<br />SENKOSI</h1><p className="hero-description">Past, Present and Future of Township Fashion</p><a className="hero-button" href="#introduction">Begin Journey <span>→</span></a></section>
    {panel && <div className="panel-backdrop" onClick={closePanel} />}
    <aside className={`side-panel ${panel ? "is-open" : ""}`} aria-hidden={!panel}><button className="close-panel" onClick={closePanel} aria-label="Close panel">×</button>
      {panel === "chapters" && <><p className="panel-kicker">Explore the story</p><h2>CHAPTERS</h2><div className="chapter-list" id="chapters">{chapters.map(([title, subtitle, place, date], index) => <Link className="chapter-row" to={`/${title.toLowerCase()}`} onClick={closePanel} key={title}><span className="chapter-number">0{index + 1}</span><span><strong>{title}</strong><small>{subtitle}</small></span><span className="chapter-place">{place}</span><span className="chapter-date">{date}</span></Link>)}</div></>}
      {panel === "menu" && <><p className="panel-kicker">I&apos;STYLA SENKOSI</p><h2>MENU</h2><nav className="main-menu">{menuItems.map(([label, url]) => url.startsWith("/") ? <Link to={url} onClick={closePanel} key={label}>{label}<span>↗</span></Link> : <a href={url} onClick={closePanel} key={label}>{label}<span>↗</span></a>)}</nav><p className="menu-note">A visual archive of township fashion, identity and imagination.</p></>}
    </aside>
  </main>;
}
export default Hero;



