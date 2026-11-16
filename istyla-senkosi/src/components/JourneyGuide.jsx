import { useEffect, useRef } from "react";
import "../styles/JourneyGuide.css";

export default function JourneyGuide({ onStart, onBack }) {
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <section className="journey-guide" aria-labelledby="journey-guide-title">
    <div className="journey-guide__sheet">
      <p className="journey-guide__kicker">BEFORE WE BEGIN</p>
      <h1 id="journey-guide-title" ref={heading} tabIndex={-1}>Find your way.</h1>
      <p className="journey-guide__intro">A personal documentary through township fashion, told in photographs, film, memories and small interactions. You take part as the story unfolds.</p>
      <div className="journey-guide__steps">
        <div><span aria-hidden="true">01</span><div><h2>Read, watch, then take part</h2><p>Let the words finish. Follow the prompt to drag, tap or press and hold. Complete the interaction to unlock the next page; the control glows when ready.</p></div></div>
        <div><span aria-hidden="true">02</span><div><h2>Move at your own pace</h2><p>Scroll down when invited to continue. Scroll up to go back. Videos play through, with a skip option when available. Use a mouse, trackpad or touch; buttons also work with the keyboard.</p></div></div>
      </div>
      <dl className="journey-guide__navigation">
        <div><dt>HOME</dt><dd>Return to the opening screen.</dd></div>
        <div><dt>CHAPTERS +</dt><dd>Choose or revisit a chapter.</dd></div>
        <div><dt>MENU</dt><dd>Adjust sound, volume and motion.</dd></div>
        <div><dt>HELP ?</dt><dd>Stuck? Get guidance for the page you are on.</dd></div>
      </dl>
      <footer className="journey-guide__footer"><button className="journey-guide__back" onClick={onBack}>Back</button><button className="journey-guide__start" onClick={onStart}>Step into the story <span aria-hidden="true">→</span></button></footer>
    </div>
  </section>;
}
