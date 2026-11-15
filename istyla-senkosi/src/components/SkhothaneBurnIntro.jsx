import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import shirt from "../assets/Chapter 3_Skothane/Images/Extra/Shirt.png";
import matchStick from "../assets/Chapter 3_Skothane/Images/Textures/Match_Stick.jpg";
import flameOne from "../assets/Chapter 3_Skothane/Images/Textures/Flame_1.jpg";
import flameTwo from "../assets/Chapter 3_Skothane/Images/Textures/Flame_2.jpg";
import skhothaneBackground from "../assets/Chapter 3_Skothane/Images/Background/Skhotane_Background.jpg";
import NarrativeText from "./NarrativeText";
import IntroAmbientAudio from "./IntroAmbientAudio";
import OutfitAmbience from "./games/OutfitAmbience";
import "../styles/SkhothaneBurnIntro.css";

export default function SkhothaneBurnIntro({ track, audioRef, children }) {
  const [finishedCopy, setFinishedCopy] = useState({});
  const copyReady = Object.keys(finishedCopy).length === 3;
  const { reducedMotion } = useNavigation();
  const [opened, setOpened] = useState(() => {
    try {
      const savedPage = JSON.parse(sessionStorage.getItem("istyla:skhothane:page"));
      return Number.isInteger(savedPage) && savedPage > 0;
    } catch { return false; }
  });
  const [armed, setArmed] = useState(false);
  const [burning, setBurning] = useState(false);
  const [burnProgress, setBurnProgress] = useState(0);
  const [matchOffset, setMatchOffset] = useState({ x:0, y:0 });
  const [notice, setNotice] = useState("Drag the lit match onto the shirt, or select it and tap the shirt.");
  const shirtRef = useRef(null);
  const drag = useRef(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    if (!burning) return undefined;
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = setTimeout(() => setOpened(true), 0);
      return () => clearTimeout(timer);
    }
    let animation;
    let finishTimer;
    const start = performance.now();
    const tick = (now) => {
      const next = Math.min(1, (now - start) / 1700);
      setBurnProgress(next);
      if (next < 1) animation = requestAnimationFrame(tick);
      else finishTimer = setTimeout(() => setOpened(true), 350);
    };
    animation = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(animation); clearTimeout(finishTimer); };
  }, [burning, reducedMotion]);

  const ignite = () => {
    if (!copyReady || burning) return;
    setBurning(true);
    setNotice("The chapter is being revealed.");
  };
  const startDrag = (event) => {
    if (!copyReady) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    suppressClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x:event.clientX, y:event.clientY, moved:false };
    setArmed(true);
  };
  const moveDrag = (event) => {
    if (!drag.current) return;
    const x = event.clientX - drag.current.x;
    const y = event.clientY - drag.current.y;
    if (Math.hypot(x, y) > 5) drag.current.moved = true;
    setMatchOffset({ x, y });
  };
  const endDrag = (event) => {
    if (!drag.current) return;
    const moved = drag.current.moved;
    drag.current = null;
    suppressClick.current = moved;
    const bounds = shirtRef.current?.getBoundingClientRect();
    if (moved && bounds && event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom) ignite();
    else setNotice("Match ready. Tap the shirt to set it alight.");
    setMatchOffset({ x:0, y:0 });
  };


  const burnRadius = burnProgress * 95;
  const mask = burning ? `radial-gradient(circle at 50% 57%, transparent ${burnRadius}%, #000 ${Math.min(100, burnRadius + 9)}%)` : undefined;
  return <>
    {track && <audio ref={audioRef} src={track} loop preload="metadata" aria-hidden="true" />}
    {opened ? children : <section className={`skhothane-burn-intro ${burning ? "is-burning" : ""}`} aria-label="Set the Skhothane shirt alight to reveal the chapter">
    <IntroAmbientAudio id="skhothane" track={track} sharedAudioRef={audioRef} />
    <div className="skhothane-burn-intro__background" style={{ "--skhothane-background":`url("${skhothaneBackground}")` }} aria-hidden="true" />
    <OutfitAmbience audioRef={audioRef} />
    <div className="skhothane-burn-intro__copy">
      <small><NarrativeText speed={0.12} onComplete={() => setFinishedCopy((done) => done[0] ? done : { ...done, [0]: true })} text="03 / SKHOTHANE · MY JOURNEY" delay={0} /></small>
      <h1><NarrativeText speed={0.12} onComplete={() => setFinishedCopy((done) => done[1] ? done : { ...done, [1]: true })} text="A look made to be seen." delay={100} /></h1>
      <p><NarrativeText speed={0.12} onComplete={() => setFinishedCopy((done) => done[2] ? done : { ...done, [2]: true })} text="I set this shirt alight to enter a world of colour, performance and memories I am still trying to understand." delay={250} /></p>
      <p className="skhothane-burn-intro__instruction" role="status">{copyReady ? notice : "Read to unlock the match."}</p>
    </div>
    <div className="skhothane-burn-intro__stage">
      <button ref={shirtRef} type="button" className="skhothane-burn-intro__shirt" disabled={!copyReady || burning} aria-label={armed ? "Set the shirt alight" : "Shirt. Select the match first, then tap here."} onClick={() => { if (armed) ignite(); else setNotice("Pick up the match first, then tap the shirt."); }}>
        <img src={shirt} alt="" style={{ maskImage:mask, WebkitMaskImage:mask }} />
        {burning && <span className="skhothane-burn-intro__embers" aria-hidden="true" style={{ "--burn-radius":`${burnRadius}%` }} />}
      </button>
      <button type="button" className={`skhothane-burn-intro__match ${copyReady ? "is-lit" : ""}`} disabled={!copyReady || burning} aria-label="Pick up the lit match. Drag it onto the shirt or press Enter, then select the shirt." aria-pressed={armed} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={() => { drag.current = null; setMatchOffset({ x:0, y:0 }); }} onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } setArmed(true); setNotice("Match ready. Tap the shirt to set it alight."); }}>
        <span className="skhothane-burn-intro__real-match" style={{ transform:`translate(${matchOffset.x}px,${matchOffset.y}px)` }} aria-hidden="true">
          <svg viewBox="145 135 145 145">
            <defs>
              <filter id="match-background-cutout" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  2 2 2 0 -0.08"/></filter>
              <filter id="flame-background-cutout" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  3 0 -3 0 0"/></filter>
            </defs>
            <image href={matchStick} width="612" height="407" filter="url(#match-background-cutout)"/>
          </svg>
          <span className="skhothane-burn-intro__travelling-flame"><span className="skhothane-burn-intro__flame-glow"/><img className="skhothane-burn-intro__flame skhothane-burn-intro__flame--one" src={flameOne} alt="" draggable={false}/><img className="skhothane-burn-intro__flame skhothane-burn-intro__flame--two" src={flameTwo} alt="" draggable={false}/></span>
        </span><b>{armed ? "MATCH READY" : "PICK UP THE MATCH"}</b>
      </button>
    </div>
  </section>}
  </>;
}
