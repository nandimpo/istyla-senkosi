import { useEffect, useRef, useState } from "react";
import { useContinuousZoom } from "../../hooks/useContinuousZoom";
import { createPortal } from "react-dom";
import { useNavigation } from "../../context/NavigationContext";
import arrivalVideo from "../../assets/Additional Videos/Enviroment/Enter Soweto Video.mp4";
import "../../styles/SowetoArrivalClip.css";

const CLIP_SECONDS = 20;
const SKIP_AFTER_SECONDS = 10;
export default function SowetoArrivalClip({ onComplete }) {
  const dialogRef = useRef(null);
  const videoRef = useRef(null);
  const watched = useRef(0);
  const lastTime = useRef(0);
  const finished = useRef(false);
  const [seconds, setSeconds] = useState(0);
  const [needsPlay, setNeedsPlay] = useState(false);
  const [failed, setFailed] = useState(false);
  const { setNavigationLocked } = useNavigation();

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => {
      dialog.close();
      setNavigationLocked(false);
    };
  }, [setNavigationLocked]);
  useContinuousZoom(videoRef, true);
  const play = () => {
    videoRef.current.play().then(() => setNeedsPlay(false)).catch(() => setNeedsPlay(true));
  };
  const completeClip = () => {
    if (finished.current) return;
    finished.current = true;
    videoRef.current.pause();
    setNavigationLocked(false);
    onComplete();
  };
  const updateProgress = () => {
    const video = videoRef.current;
    if (finished.current || video.seeking) return;
    const delta = video.currentTime - lastTime.current;
    if (delta >= 0 && delta < 1.5) watched.current += delta;
    lastTime.current = video.currentTime;
    setSeconds(Math.min(CLIP_SECONDS, Math.floor(watched.current)));
    if (watched.current >= CLIP_SECONDS) {
      completeClip();
    }
  };
  return createPortal(<dialog ref={dialogRef} className="soweto-arrival" aria-labelledby="soweto-arrival-title" onCancel={(event) => event.preventDefault()}>
    <video ref={videoRef} src={arrivalVideo} autoPlay playsInline muted preload="auto" disablePictureInPicture
      onLoadedData={play} onTimeUpdate={updateProgress}
      onSeeking={() => { if (Math.abs(videoRef.current.currentTime - lastTime.current) > 0.5) videoRef.current.currentTime = lastTime.current; }}
      onPause={() => { if (!finished.current) setNeedsPlay(true); }}
      onPlaying={() => setNeedsPlay(false)}
      onEnded={() => { if (!finished.current) { lastTime.current = 0; videoRef.current.currentTime = 0; play(); } }}
      onError={() => setFailed(true)} />
    <div className="soweto-arrival-copy">
      <p>THE JOURNEY CONTINUES</p>
      <h1 id="soweto-arrival-title">You are now entering Soweto</h1>
      <p>{failed ? "The clip could not load. Please retry." : "Take in the streets. Your story continues after this 20 second clip."}</p>
      <progress max={CLIP_SECONDS} value={seconds} aria-label="Arrival clip playback progress" />
      <span>{seconds} / {CLIP_SECONDS} seconds</span>
      <button disabled={seconds < SKIP_AFTER_SECONDS} onClick={() => { if (watched.current >= SKIP_AFTER_SECONDS) completeClip(); }}>
        {seconds < SKIP_AFTER_SECONDS ? `Skip in ${SKIP_AFTER_SECONDS - seconds}s` : "Skip clip"}
      </button>
      {(needsPlay || failed) && <button onClick={() => { if (failed) { setFailed(false); videoRef.current.load(); } play(); }}>{failed ? "Retry clip" : "Play clip"}</button>}
    </div>
    <span className="soweto-arrival-sound">VIDEO MUTED</span>
  </dialog>, document.body);
}
