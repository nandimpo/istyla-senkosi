import { useEffect, useRef, useState } from "react";
import StitchedNarrative from "../StitchedNarrative";
import "../../styles/ChapterGames.css";

const beats = ["STANCE", "STEP", "RHYTHM", "SWING", "FINALE"];
const beatNotes = [110, 147, 165, 196, 220];

function BeatGame({ sceneImages, onComplete }) {
  const [copyReady, setCopyReady] = useState(false);
  const [activeBeat, setActiveBeat] = useState(0);
  const audioContext = useRef(null);
  const ready = activeBeat === beats.length;

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [ready, onComplete]);

  const playBeat = (index) => {
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
    if (!copyReady || index !== activeBeat) return;
    playBeat(index);
    setActiveBeat(index + 1);
  };

  const currentScene = activeBeat === 0 ? "TAP THE FIRST BEAT" : activeBeat === beats.length ? "THE DANCE IS ALIVE" : `${beats[activeBeat - 1]} UNLOCKED`;

  return (
    <div className="game-stage game-stage--pantsula">
      <div className="game-copy">
        <p className="tag">02 / PANTSULA</p>
        <h1>I tried to feel it,<br />not just watch it.</h1>
        <StitchedNarrative onComplete={() => setCopyReady(true)} className="game-copy__narrative" text="Nobody could explain the rhythm to me in words. So I stopped asking and started trying to catch it myself, one beat at a time." placement="inline" />
        <strong role="status">{copyReady ? currentScene : "READ TO UNLOCK THE BEATS"}</strong>
        <i />
      </div>
      <div className={`pantsula-image beat-scene-${activeBeat}`}>
        <img src={sceneImages[activeBeat]} alt={`Pantsula dance scene: ${activeBeat ? beats[activeBeat - 1] : "ready"}`} loading="lazy" decoding="async" />
        <div className="beat-overlay"><span>BEAT {activeBeat} / {beats.length}</span><b>{activeBeat ? beats[activeBeat - 1] : "READY"}</b></div>
        <div className="beat-map" aria-label="Pantsula beat map">
          {beats.map((beat, index) => (
            <button
              key={beat}
              className={`beat beat-${index + 1} ${index < activeBeat ? "complete" : ""} ${index === activeBeat ? "ready" : ""}`}
              disabled={!copyReady || index !== activeBeat}
              onClick={() => activateBeat(index)}
              aria-label={`${beat}: ${index < activeBeat ? "complete" : index === activeBeat ? "tap now" : "locked"}`}
            >
              <span>{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BeatGame;
