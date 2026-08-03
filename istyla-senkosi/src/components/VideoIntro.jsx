import { useEffect, useRef, useState } from "react";
import "../styles/VideoIntro.css";

function VideoIntro({ src, label, onFinish }) {
  const videoRef = useRef(null);
  const [leaving, setLeaving] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const finish = () => {
    setLeaving((already) => {
      if (already) return true;
      setTimeout(onFinish, 650);
      return true;
    });
  };

  return (
    <div className={`video-intro ${leaving ? "leaving" : ""}`}>
      <video ref={videoRef} src={src} muted={muted} autoPlay playsInline onEnded={finish} />
      <div className="video-intro-overlay">
        <span className="video-intro-label">{label}</span>
        <div className="video-intro-actions">
          <button className="video-intro-mute" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute video" : "Mute video"}>{muted ? "SOUND OFF" : "SOUND ON"}</button>
          <button className="video-intro-skip" onClick={finish}>SKIP <i aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}

export default VideoIntro;
