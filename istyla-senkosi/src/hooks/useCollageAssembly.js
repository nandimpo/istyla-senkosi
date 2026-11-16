import { useEffect, useState } from "react";
import { soundtrackBeats } from "../utils/musicRhythm";

export default function useCollageAssembly({ count, noteCount, audioRef, paused, reducedMotion }) {
  const [complete, setComplete] = useState(false);
  const [placed, setPlaced] = useState(0);
  const [papers, setPapers] = useState(0);
  const [notes, setNotes] = useState(0);
  const [decorated, setDecorated] = useState(false);
  useEffect(() => {
    setComplete(false); setPlaced(0); setPapers(0); setNotes(0); setDecorated(false);
    if (paused) return;
    if (reducedMotion) {
      setPlaced(count); setPapers(3); setNotes(noteCount); setDecorated(true); setComplete(true);
      return;
    }
    let disposed = false;
    let frame;
    let beats = [];
    let previousAudioTime;
    let index = 0;
    let paperCount = 0;
    let noteIndex = 0;
    let lastPlacement;
    let lastNote;
    const start = performance.now();
    const audio = audioRef?.current;
    soundtrackBeats(audio?.currentSrc || audio?.src).then((result) => { if (!disposed) beats = result; });
    const tick = (now) => {
      if (disposed) return;
      const elapsed = now - start;
      const current = audio?.currentTime ?? 0;
      const playing = audio && !audio.paused && !audio.muted && audio.volume > .001;
      const beat = playing && previousAudioTime !== undefined && beats.some((time) => time > previousAudioTime && time <= current);
      previousAudioTime = current;
      if (paperCount < 3 && elapsed >= 300 + paperCount * 300) setPapers(++paperCount);
      if (elapsed >= 1300 && index < count) {
        const gap = lastPlacement === undefined ? 1150 : now - lastPlacement;
        if ((gap >= 750 && beat) || gap >= 1150) {
          setPlaced(++index);
          lastPlacement = now;
        }
      }
      if (index === count && now - lastPlacement >= 1150) {
        setDecorated(true);
        if (noteIndex < noteCount && (lastNote === undefined || now - lastNote >= 950)) {
          setNotes(++noteIndex);
          lastNote = now;
        }
        if (noteIndex === noteCount && now - lastPlacement >= 2850 && (lastNote === undefined || now - lastNote >= 1200)) { setComplete(true); return; }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { disposed = true; cancelAnimationFrame(frame); };
  }, [count, noteCount, audioRef, paused, reducedMotion]);
  return { placed, papers, notes, decorated, complete };
}
