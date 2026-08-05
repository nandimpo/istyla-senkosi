import { useEffect, useRef } from "react";
import { useInView } from "../hooks/useInView";
import "../styles/ChapterVideo.css";

function ChapterVideo({ src, className = "" }) {
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);
  const primed = useInView(wrapperRef, { rootMargin: "1000px 0px", threshold: 0 });
  const visible = useInView(wrapperRef, { threshold: 0.4 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    if (visible) video.play().catch(() => {});
    else video.pause();
  }, [visible]);

  return (
    <div ref={wrapperRef} className={`chapter-video ${className}`}>
      <video ref={videoRef} src={primed ? src : undefined} muted loop playsInline preload="none" />
    </div>
  );
}

export default ChapterVideo;
