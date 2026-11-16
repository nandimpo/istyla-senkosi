import { useEffect, useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import RhythmAdvance from "../RhythmAdvance";
import ViewportFit from "../ViewportFit";
import StitchedNarrative from "../StitchedNarrative";
import pantsulaBackground from "../../assets/Chapter 2_Pantsula/Background images/Pantsula_Collage.jpg";
import "../../styles/ChapterGames.css";

const beats = ["STANCE", "STEP", "RHYTHM", "SWING", "FINALE"];
const beatNarratives = [
  "I have spent so long looking at Ree's clothes in photographs. Now I want to feel a little of the movement in the culture that came before his Skhothane style. Read each observation, then tap the numbered beat that lights up. I begin one step at a time.",
  "First, I watched how he stood. Knees loose, weight low, ready to move. I softened my own stance and waited for the beat.",
  "Then I followed his feet. A quick step, a shift of weight, a pause. I tried it again until my shoes began to find their place.",
  "The rhythm started making sense in my body. I stopped counting every step and listened for the spaces between them.",
  "His arms swung with the steps, loose but deliberate. I let mine follow, adding a little of myself to the movement.",
  "For a moment, the steps come together. I am still learning, but I feel less like someone watching from outside. Pantsula gives me a way to approach Ree's Skhothane world through movement. I wish I could share this small moment with him.",
];

function BeatGame({ sceneImages, onComplete }) {
  const { reducedMotion } = useNavigation();
  const [copyReady, setCopyReady] = useState(false);
  const [activeBeat, setActiveBeat] = useState(0);
  const [replayFrame, setReplayFrame] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hasPlayedCycle, setHasPlayedCycle] = useState(false);
  const ready = activeBeat === beats.length;

  useEffect(() => {
    if (!ready || paused || reducedMotion) return undefined;
    let framesPlayed = 0;
    const timer = setInterval(() => {
      setReplayFrame((frame) => (frame + 1) % sceneImages.length);
      framesPlayed += 1;
      if (framesPlayed >= sceneImages.length) setHasPlayedCycle(true);
    }, 240);
    return () => clearInterval(timer);
  }, [ready, paused, reducedMotion, sceneImages.length]);

  const displayedFrame = Math.min(sceneImages.length - 1, ready ? replayFrame : activeBeat);

  const activateBeat = (index) => {
    if (!copyReady || index !== activeBeat) return;
    setCopyReady(false);
    setActiveBeat(index + 1);
  };

  const currentScene = activeBeat === 0 ? "TAP THE FIRST BEAT" : activeBeat === beats.length ? "FIVE MOVEMENTS, ONE SHARED RHYTHM" : `${activeBeat} OF ${beats.length} MOVEMENTS FOUND. NEXT: ${beats[activeBeat]}`;

  return (
    <div className="game-stage game-stage--pantsula" style={{ "--pantsula-background": `url("${pantsulaBackground}")` }}>
      <ViewportFit className="game-copy">
        <p className="tag">02 / PANTSULA</p>
        <h1>I tried to feel it,<br />not just watch it.</h1>
        <StitchedNarrative key={activeBeat} onComplete={() => setCopyReady(true)} className="game-copy__narrative" text={beatNarratives[activeBeat]} placement="inline" />
        <strong role="status">{copyReady ? currentScene : "READ TO UNLOCK THE BEATS"}</strong>
        <i />
        {ready && <><div className="beat-replay-controls"><button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? "Play animation" : "Pause animation"}</button></div><RhythmAdvance disabled={!copyReady || (!reducedMotion && !hasPlayedCycle)} onComplete={onComplete} /></>}
      </ViewportFit>
      <div className={`pantsula-image beat-scene-${activeBeat}`}>
        {sceneImages.map((src, index) => <img key={src} src={src} alt={index === displayedFrame ? (ready ? "The complete Pantsula dance sequence" : `Pantsula dance scene: ${activeBeat ? beats[activeBeat - 1] : "ready"}`) : ""} aria-hidden={index !== displayedFrame} style={{ display:index === displayedFrame ? "block" : "none" }} loading="eager" decoding="async" />)}
        <div className="beat-overlay"><span>{ready ? "COMPLETE SEQUENCE / LOOP" : `NEXT BEAT ${activeBeat + 1} / ${beats.length}`}</span></div>
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
