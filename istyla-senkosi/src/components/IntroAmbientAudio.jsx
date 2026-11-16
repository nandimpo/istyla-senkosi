import { useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import { useSectionAudio } from "../hooks/useSectionAudio";
import "../styles/IntroAmbientAudio.css";

export default function IntroAmbientAudio({ id, track, sharedAudioRef, volumeScale = 0.6, nextTrack }) {
  const localAudioRef = useRef(null);
  const audioRef = sharedAudioRef || localAudioRef;
  const { soundOn, setSoundOn } = useNavigation();
  const { autoplayBlocked, resumeAudio } = useSectionAudio({ id, audioRef, soundOn, volumeScale, nextTrack });

  if (!track) return null;
  return <>
    {!sharedAudioRef && <audio ref={audioRef} src={track} autoPlay loop={!nextTrack} preload="metadata" aria-hidden="true" />}
    <button type="button" className="intro-ambient-sound" aria-label={soundOn && autoplayBlocked ? "Resume sound" : soundOn ? "Turn sound off" : "Turn sound on"} aria-pressed={soundOn} onClick={() => { if (soundOn && autoplayBlocked) resumeAudio(); else setSoundOn((current) => !current); }}>
      {soundOn && autoplayBlocked ? "RESUME SOUND" : soundOn ? "SOUND ON" : "SOUND OFF"}
    </button>
  </>;
}
