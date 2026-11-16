import { useEffect, useRef } from "react";
import "../styles/JourneyGuide.css";
import ViewportFit from "./ViewportFit";

export default function JourneyGuide({ onStart, onBack }) {
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <section className="journey-guide" aria-labelledby="journey-guide-title">
    <ViewportFit className="journey-guide__sheet">
      <header className="journey-guide__heading">
      <p className="journey-guide__kicker">BEFORE WE BEGIN</p>
      <h1 id="journey-guide-title" ref={heading} tabIndex={-1}>Find your way.</h1>
      <p className="journey-guide__intro">A personal documentary through township fashion, told in photographs, film, memories and small interactions. You take part as the story unfolds.</p>
      </header>
      <div className="journey-guide__steps">
        <div><span aria-hidden="true">01</span><div><h2>Read, watch, then take part</h2><p><strong>Let the words finish.</strong> Follow the prompt to <strong>drag</strong>, <strong>tap</strong> or <strong>press and hold</strong>. Complete the interaction to unlock the next page. The control <strong>glows when ready</strong>.</p></div></div>
        <div><span aria-hidden="true">02</span><div><h2>Move at your own pace</h2><p><strong>Scroll down</strong> when invited to continue. <strong>Scroll up twice</strong>, with a brief pause between scrolls, to go back. Videos play through, with a <strong>skip option</strong> when available. Use a mouse, trackpad or touch. Buttons also work with the <strong>keyboard</strong>.</p></div></div>
        <div><span aria-hidden="true">03</span><div><h2>Listen to the story</h2><p>For the full experience, connect your <strong>headphones</strong> or listen aloud with your <strong>sound on</strong>.</p></div></div>
      </div>
      <dl className="journey-guide__navigation">
        <div><dt>HOME</dt><dd>Return to the opening screen.</dd></div>
        <div><dt>CHAPTERS +</dt><dd>Choose or revisit a chapter.</dd></div>
        <div><dt>MENU</dt><dd>Adjust sound, volume and motion.</dd></div>
        <div><dt>HELP ?</dt><dd>Stuck? Get guidance for the page you are on.</dd></div>
      </dl>
      <footer className="journey-guide__footer"><button className="journey-guide__back" onClick={onBack}>Back</button><button className="journey-guide__start" onClick={onStart}>Step into the story <span aria-hidden="true">→</span></button></footer>
    </ViewportFit>
  </section>;
}
