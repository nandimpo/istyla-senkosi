import { useSessionState } from "../hooks/useSessionState";
import { useRef, useState } from "react";
import hatImage from "../assets/images/Chapter images/Bucket-Hat.jpg";
import "../styles/IspotiIntro.css";

export default function IspotiIntro({ children }) {
  const [wear, setWear] = useState(0);
  const [bend, setBend] = useState(0);
  const [opened, setOpened] = useSessionState("pantsula:opened", false);
  const pointer = useRef(null);
  const ready = wear >= 100 && bend >= 100;
  const begin = (event, part) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointer.current = { x: event.clientX, y: event.clientY, part };
  };
  const move = (event) => {
    const previous = pointer.current;
    if (!previous) return;
    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    pointer.current = { ...previous, x: event.clientX, y: event.clientY };
    if (previous.part === "crown") setWear((value) => Math.min(100, value + Math.min(40, Math.hypot(dx, dy)) / 12));
    else setBend((value) => Math.max(0, Math.min(100, value - dy * .55)));
  };
  const end = () => { pointer.current = null; };
  if (opened) return children;
  return <section className="ispoti-intro" aria-label="Break in your ispoti to enter Pantsula" style={{ "--wear": wear / 100, "--bend": bend / 100 }}>
    <div className="ispoti-copy"><small>02 / PANTSULA · JAMA’S JOURNEY</small><h1>Make it<br/><em>your own.</em></h1><p>I think of my cousin and the care he takes with every detail. Now it’s my turn to try.</p><p>Help Jama rub the crown and pull the brim upward to shape her ispoti.</p></div>
    <div className="ispoti-workbench">
      <svg className="ispoti-hat" viewBox="0 130 570 400" role="img" aria-label="Olive bucket hat, becoming worn with a bent brim">
        <defs>
          <clipPath id="ispoti-silhouette"><path d="M43 416 Q47 400 89 359 L121 215 Q119 179 174 169 Q290 145 383 173 Q430 183 439 215 L470 357 Q490 379 520 405 Q541 430 504 447 Q412 475 282 475 Q136 475 67 443 Q40 433 43 416Z"/></clipPath>
          <filter id="ispoti-wear"><feTurbulence type="fractalNoise" baseFrequency=".025 .08" numOctaves="2" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale={wear / 40} xChannelSelector="R" yChannelSelector="G"/></filter>
          <pattern id="ispoti-scuffs" width="43" height="29" patternUnits="userSpaceOnUse"><path d="M4 11 l11 -3 M29 22 l6 -2" stroke="#c4b895" strokeWidth="1.2" opacity=".5"/></pattern>
        </defs>
        <ellipse cx="285" cy="479" rx="220" ry="21" fill="#171710" opacity=".24"/>
        <g className="ispoti-brim"><g clipPath="url(#ispoti-silhouette)"><g filter="url(#ispoti-wear)"><image href={hatImage} width="570" height="672"/><path d="M30 150 H540 V500 H30Z" fill="url(#ispoti-scuffs)" opacity={wear / 100}/></g></g></g>
      </svg>
      <button className="ispoti-target ispoti-target--crown" aria-label="Wear in the crown. Rub here or press Enter repeatedly." onPointerDown={(event) => begin(event, "crown")} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onClick={(event) => { if (event.detail === 0) setWear((value) => Math.min(100, value + 10)); }}><span>01 · RUB THE CROWN</span></button>
      <button className="ispoti-target ispoti-target--brim" aria-label="Shape the brim. Drag upward or press Enter repeatedly." onPointerDown={(event) => begin(event, "brim")} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onClick={(event) => { if (event.detail === 0) setBend((value) => Math.min(100, value + 20)); }}><span>02 · PULL THE BRIM UP ↑</span></button>
      <div className="ispoti-shadow-label">THE ISPOTI BREAK-IN</div>
    </div>
    <div className="ispoti-controls"><div><label htmlFor="ispoti-wear-progress">Worn in <b>{Math.round(wear)}%</b></label><progress id="ispoti-wear-progress" max="100" value={wear}/></div><div><label htmlFor="ispoti-bend-progress">Brim shaped <b>{Math.round(bend)}%</b></label><progress id="ispoti-bend-progress" max="100" value={bend}/></div><button className="ispoti-enter" disabled={!ready} onClick={() => setOpened(true)}>{ready ? "Enter Pantsula →" : "Break it in to enter"}</button><p aria-live="polite">{ready ? "Your ispoti is ready. Step into the chapter." : "Use your mouse or touch. Keyboard: Tab to the hat, then Enter or Space."}</p></div>
  </section>;
}
