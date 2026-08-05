import { useEffect } from "react";
import { useActiveSection } from "../context/ActiveSectionContext";

const resumeListeners = new Set();
let hasInteracted = false;
function markInteracted() {
  if (hasInteracted) return;
  hasInteracted = true;
  resumeListeners.forEach((fn) => fn());
}
if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", markInteracted, { once: true });
  window.addEventListener("keydown", markInteracted, { once: true });
}

export function useSectionAudio({ id, audioRef, soundOn }) {
  const activeId = useActiveSection();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.muted = !soundOn;

    if (activeId !== id) {
      audio.pause();
      return undefined;
    }

    audio.play().catch(() => {});
    const retry = () => {
      if (!audio.muted) audio.play().catch(() => {});
    };
    resumeListeners.add(retry);
    return () => resumeListeners.delete(retry);
  }, [activeId, id, soundOn, audioRef]);
}
