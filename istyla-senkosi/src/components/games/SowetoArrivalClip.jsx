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
  const [leaving, setLeaving] = useState(false);
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
    const video = videoRef.current;
    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;
    video.play().then(() => setNeedsPlay(false)).catch(() => setNeedsPlay(true));
  };
  const completeClip = () => {
    if (finished.current || leaving) return;
    finished.current = true;
    videoRef.current.pause();
    setLeaving(true);
    window.dispatchEvent(new Event("istyla:fade-section-audio"));
    setTimeout(() => {
      setNavigationLocked(false);
      onComplete();
    }, 2200);
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
  return createPortal(<dialog ref={dialogRef} className={`soweto-arrival ${leaving ? "is-leaving" : ""}`} aria-labelledby="soweto-arrival-title" onCancel={(event) => event.preventDefault()}>
    <video ref={videoRef} src={arrivalVideo} autoPlay muted playsInline preload="auto" disablePictureInPicture
      onLoadedData={play} onTimeUpdate={updateProgress}
      onSeeking={() => { if (Math.abs(videoRef.current.currentTime - lastTime.current) > 0.5) videoRef.current.currentTime = lastTime.current; }}
      onPause={() => { if (!finished.current) setNeedsPlay(true); }}
      onPlaying={() => setNeedsPlay(false)}
      onEnded={() => { if (!finished.current) { lastTime.current = 0; videoRef.current.currentTime = 0; play(); } }}
      onError={() => setFailed(true)} />
    <div className="soweto-arrival-copy">
      <p>JAMA / ARRIVING IN SOWETO</p>
      <h1 id="soweto-arrival-title">A little closer to my cousin’s world</h1>
      <p>{failed ? "The clip could not load. Please retry." : "I’m arriving in Soweto with my cousin on my mind. He is gone, but I can still listen to the stories behind the clothes he loved."}</p>
      <progress max={CLIP_SECONDS} value={seconds} aria-label="Arrival clip playback progress" />
      <span>{seconds} / {CLIP_SECONDS} seconds</span>
      <button disabled={seconds < SKIP_AFTER_SECONDS} onClick={() => { if (watched.current >= SKIP_AFTER_SECONDS) completeClip(); }}>
        {seconds < SKIP_AFTER_SECONDS ? `Skip in ${SKIP_AFTER_SECONDS - seconds}s` : "Skip clip"}
      </button>
      {(needsPlay || failed) && <button onClick={() => { if (failed) { setFailed(false); videoRef.current.load(); } play(); }}>{failed ? "Retry clip" : "Play clip"}</button>}
    </div>
  </dialog>, document.body);
}
