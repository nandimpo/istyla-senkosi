import { useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import MemoryStitchIntro from "../components/MemoryStitchIntro";
import cousin1 from "../assets/images/Cousin/Cousin 1.jpeg";
import cousin2 from "../assets/images/Cousin/Cousin 2.jpeg";
import chapterImage from "../assets/images/Chapter images/reflection chapter intro.jpg";
import houseImage from "../assets/Additional Images/Street Visuals/Wattville/House.jpg";
import streetImage from "../assets/Additional Images/Street Visuals/Wattville/Street sign.jpg";
import buildingImage from "../assets/Additional Images/Street Visuals/Wattville/Building.jpg";
import backgroundTrack from "../assets/audio/New Music/Kwesta - Spirit (Official Music Video) ft Wale ft. Wale _Conclusion.mp3";
import "../styles/Reflection.css";

const cousinPhotos = [cousin1, cousin2];

function Reflection() {
  const audioRef = useRef(null);
  const { completeChapter, goTo } = useNavigation();

  const finalPage = (
    <section className="final-frame" aria-label="End of story">
      <div className="final-frame__meeting">
        <img src={cousin1} alt="Jama’s cousin, remembered in his Skhothane style" />
        <div>
          <small>JAMA / A MEMORY</small>
          <h1>There he is.</h1>
          <p>You meet my cousin here, in the photographs I kept. He died before this journey began. I remember him stepping out in colour, asking me to really look.</p>
          <p>Now I understand what I missed: my cousin was a Skhothane. I cannot ask him what it meant to him, but I can remember him without reducing his style to showing off.</p>
        </div>
      </div>
      <div className="final-frame__actions">
        <button onClick={() => goTo("about")}>REPLAY JOURNEY <span>↑</span></button>
        <button onClick={() => goTo("swenka")}>EXPLORE CHAPTERS <span>→</span></button>
        <button onClick={() => goTo("about")}>CREDITS <span>+</span></button>
      </div>
    </section>
  );

  return (
    <MemoryStitchIntro track={backgroundTrack} audioRef={audioRef}>
    <ChapterPlayer
      id="reflection"
      chapter="04 / REFLECTION"
      title="Memory. Identity. Future."
      subtitle="Where do I belong in all of this?"
      context="I set out from Johannesburg North with memories of my cousin and questions I can no longer ask him. In Soweto, every style has made me look again. One last memory is waiting for me."
      accent="beige"
      interaction="scroll"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="dissolve"
      track={backgroundTrack}
      sharedAudioRef={audioRef}
      outro="Back to where it all began…"
      finalPage={finalPage}
      frames={[
        { label: "AFTER THE NOISE", image: streetImage, text: "I thought this story was far from my life. My cousin was a connection I had overlooked while he was here.", kind: "quiet" },
        { label: "WHAT CHANGED", image: buildingImage, text: "The more I paid attention, the more I questioned my own assumptions about him, about Soweto, and about belonging.", kind: "quiet" },
        { label: "WHAT I CAN CARRY", image: houseImage, text: "I’m still Jama, still learning. I cannot tell his story for him. I can honour what I remember and keep asking others what their style means to them.", kind: "quiet" },
        { label: "THERE HE IS", collage: cousinPhotos, text: "These are the photographs I kept of him. Come closer. I want you to meet the cousin I have been remembering." },
      ]}
      onComplete={() => completeChapter("reflection")}
    />
    </MemoryStitchIntro>
  );
}

export default Reflection;
