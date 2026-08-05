import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/useInView";
import "../styles/ChapterVideo.css";

function ChapterVideo({ src, className = "" }) {
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const primed = useInView(wrapperRef, { rootMargin: "1000px 0px", threshold: 0 });
  const visible = useInView(wrapperRef, { threshold: 0.4 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    if (visible) video.play().catch(() => {});
    else video.pause();
  }, [visible]);

  const advance = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <div ref={wrapperRef} className={`chapter-video ${className}`}>
      <video
        ref={videoRef}
        src={primed ? src : undefined}
        muted={muted}
        playsInline
        preload="none"
        onEnded={advance}
      />
      <div className="chapter-video-actions">
        <button
          className="chapter-video-sound"
          onClick={() => setMuted((current) => !current)}
          aria-label={muted ? "Turn video sound on" : "Turn video sound off"}
        >
          {muted ? "SOUND OFF" : "SOUND ON"}
        </button>
        <button className="chapter-video-skip" onClick={advance}>
          SKIP <i aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default ChapterVideo;
