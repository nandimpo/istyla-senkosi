import { useEffect, useRef, useState } from "react";
import StitchedNarrative from "../StitchedNarrative";
import "../../styles/ChapterGames.css";

const beats = ["STANCE", "STEP", "RHYTHM", "SWING", "FINALE"];
const beatNotes = [110, 147, 165, 196, 220];
const beatNarratives = [
  "Nobody could explain the rhythm to me in words. So I stopped asking and started trying to catch it myself, one beat at a time.",
  "First, I watched how he stood. Knees loose, weight low, ready to move. I softened my own stance and waited for the beat.",
  "Then I followed his feet. A quick step, a shift of weight, a pause. I tried it again until my shoes began to find their place.",
  "The rhythm started making sense in my body. I stopped counting every step and listened for the spaces between them.",
  "His arms swung with the steps, loose but deliberate. I let mine follow, adding a little of myself to the movement.",
  "For a moment, everything came together: the stance, the steps, the swing. I was still learning, but now I was part of the dance.",
];

function BeatGame({ sceneImages, onComplete }) {
  const [copyReady, setCopyReady] = useState(false);
  const [activeBeat, setActiveBeat] = useState(0);
  const [replayFrame, setReplayFrame] = useState(0);
  const [paused, setPaused] = useState(false);
  const audioContext = useRef(null);
  const ready = activeBeat === beats.length;

  useEffect(() => {
    if (!ready || paused) return undefined;
    const timer = setInterval(() => setReplayFrame((frame) => (frame + 1) % sceneImages.length), 240);
    return () => clearInterval(timer);
  }, [ready, paused, sceneImages.length]);

  const displayedFrame = ready ? replayFrame : activeBeat;

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
    setCopyReady(false);
    setActiveBeat(index + 1);
  };

  const currentScene = activeBeat === 0 ? "TAP THE FIRST BEAT" : activeBeat === beats.length ? "THE DANCE IS ALIVE" : `${beats[activeBeat - 1]} UNLOCKED`;

  return (
    <div className="game-stage game-stage--pantsula">
      <div className="game-copy">
        <p className="tag">02 / PANTSULA</p>
        <h1>I tried to feel it,<br />not just watch it.</h1>
        <StitchedNarrative key={activeBeat} onComplete={() => setCopyReady(true)} className="game-copy__narrative" text={beatNarratives[activeBeat]} placement="inline" />
        <strong role="status">{copyReady ? currentScene : "READ TO UNLOCK THE BEATS"}</strong>
        <i />
        {ready && <div className="beat-replay-controls"><button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? "Play animation" : "Pause animation"}</button><button type="button" disabled={!copyReady} onClick={() => { if (copyReady) onComplete(); }}>Continue the story →</button></div>}
      </div>
      <div className={`pantsula-image beat-scene-${activeBeat}`}>
        {sceneImages.map((src, index) => <img key={src} src={src} alt={index === displayedFrame ? (ready ? "The complete Pantsula dance sequence" : `Pantsula dance scene: ${activeBeat ? beats[activeBeat - 1] : "ready"}`) : ""} aria-hidden={index !== displayedFrame} style={{ display:index === displayedFrame ? "block" : "none" }} loading="eager" decoding="async" />)}
        <div className="beat-overlay"><span>{ready ? "COMPLETE SEQUENCE / LOOP" : `BEAT ${activeBeat} / ${beats.length}`}</span><b>{ready ? (paused ? "PAUSED" : "THE DANCE IS ALIVE") : activeBeat ? beats[activeBeat - 1] : "READY"}</b></div>
        {!ready && <div className="beat-map" aria-label="Pantsula beat map">
          {beats.map((beat, index) => (
            <button
              key={beat}
              className={`beat beat-${index + 1} ${index < activeBeat ? "complete" : ""} ${index === activeBeat ? "ready" : ""}`}
              disabled={!copyReady || index !== activeBeat}
              onClick={() => activateBeat(index)}
              aria-label={`${beat}: ${index < activeBeat ? "complete" : index === activeBeat && copyReady ? "tap now" : "locked"}`}
            >
              <span>{index + 1}</span>
            </button>
          ))}
        </div>}
      </div>
    </div>
  );
}

export default BeatGame;
