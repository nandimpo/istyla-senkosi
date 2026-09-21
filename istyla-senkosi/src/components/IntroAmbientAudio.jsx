import { useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import { useSectionAudio } from "../hooks/useSectionAudio";
import "../styles/IntroAmbientAudio.css";

export default function IntroAmbientAudio({ id, track, sharedAudioRef }) {
  const localAudioRef = useRef(null);
  const audioRef = sharedAudioRef || localAudioRef;
  const { soundOn, setSoundOn } = useNavigation();
  useSectionAudio({ id, audioRef, soundOn, volumeScale: 0.18 });

  if (!track) return null;
  return <>
    {!sharedAudioRef && <audio ref={audioRef} src={track} loop preload="metadata" aria-hidden="true" />}
    <button type="button" className="intro-ambient-sound" aria-pressed={soundOn} onClick={() => setSoundOn((current) => !current)}>
      {soundOn ? "SOUND ON" : "SOUND OFF"}
    </button>
  </>;
}