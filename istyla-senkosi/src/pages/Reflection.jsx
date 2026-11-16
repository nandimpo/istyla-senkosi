import { useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import ViewportFit from "../components/ViewportFit";
import ChapterPlayer from "../components/ChapterPlayer";
import MemoryStitchIntro from "../components/MemoryStitchIntro";
import cousin4 from "../assets/images/Cousin/Cousin 4.png";
import cousin2Old from "../assets/images/Cousin/Cousin_2_old.jpeg";
import chapterImage from "../assets/images/Cousin/Cousin 1.jpeg";
import houseImage from "../assets/Additional Images/Street Visuals/Wattville/House.jpg";
import streetImage from "../assets/Additional Images/Street Visuals/Wattville/Street sign.jpg";
import buildingImage from "../assets/Additional Images/Street Visuals/Wattville/Building.jpg";
import backgroundTrack from "../assets/normalized-audio/Kwesta - Spirit (Official Music Video) ft Wale ft. Wale _Conclusion.mp3";
import "../styles/Reflection.css";

const cousinPhotos = [cousin4, cousin2Old];

function Reflection() {
  const audioRef = useRef(null);
  const { completeChapter, goTo, restartJourney } = useNavigation();
  const creditsRef = useRef(null);
  const chaptersRef = useRef(null);

  const finalPage = (
    <section className="final-frame" aria-label="End of story">
      <ViewportFit className="final-frame__fit">
      <div className="final-frame__meeting">
        <img className="old-photo--portrait" src={chapterImage} alt="An old photograph of my cousin" />
        <div>
          <small>MY MEMORY</small>
          <h1>There he is.</h1>
          <p>You meet my cousin here, in the photographs I kept. He died before this journey began. I remember him stepping out in colour, asking me to really look.</p>
          <p>Ree was a Skhothane. This journey has helped me appreciate the care and joy in the way he dressed. I cannot ask him what it all meant to him, but I appreciate him and his style so much more. I return to the photograph I began with. The image has not changed, but the way I look at it has. I see more of the person I love. From Jama, with love.</p>
        </div>
      </div>
      <div className="final-frame__actions">
        <button onClick={restartJourney}>REPLAY JOURNEY <span>↑</span></button>
        <button onClick={() => chaptersRef.current.showModal()}>EXPLORE CHAPTERS <span>→</span></button>
        <button onClick={() => creditsRef.current.showModal()}>CREDITS <span>+</span></button>
      </div>
      </ViewportFit>
      <dialog ref={chaptersRef} className="ending-dialog" aria-labelledby="ending-chapters-title" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
        <h2 id="ending-chapters-title">Explore the chapters</h2>
        <nav aria-label="Choose a chapter">{[["Introduction", "introduction"], ["Swenka", "swenka"], ["Pantsula", "pantsula"], ["Skhothane", "skhothane"], ["Reflection", "reflection"]].map(([label, id]) => <button key={id} onClick={() => { chaptersRef.current.close(); goTo(id); }}>{label}</button>)}</nav>
        <button onClick={() => chaptersRef.current.close()}>Back to the reflection</button>
      </dialog>
      <dialog ref={creditsRef} className="ending-dialog" aria-labelledby="ending-credits-title" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
        <h2 id="ending-credits-title">Credits &amp; acknowledgements</h2>
        <p>A personal journey through township fashion, told from Jama's perspective in memory of Ree.</p>
        <h3>Photographs &amp; voices</h3>
        <p>Family photographs of Ree appear alongside archival and contemporary fashion imagery, interviews and dance footage exploring Swenka, Pantsula and Skhothane.</p>
        <h3>Music</h3>
        <ul>
          <li>Hugh Masekela: Stimela (The Coal Train), Mamoriri</li>
          <li>Miriam Makeba: Khawuleza (Live 1966), Nongqongqo (To Those We Love), Welela</li>
          <li>Dorothy Masuka: Magumede</li>
          <li>Unomeva (Isileyi Sami)</li>
          <li>TKZee: Dlala Mapantsula</li>
          <li>Mshoza and Mzambiya: Kortes (Kasi Luv)</li>
          <li>Ngeke Balunge (featuring Teargas, Brown Dash, Brickz, Skhokho and Madluphuthu)</li>
          <li>Moonchild Sanelly: Yebo Teacher</li>
          <li>HEAVY-K and Moonchild Sanelly: Yebo Mama</li>
          <li>Y-Tjukuja (featuring Professor, Oskido and DJ Bucks)</li>
          <li>Kwesta featuring Wale: Spirit</li>
          <li>Ehlatini</li>
        </ul>
        <p>Thank you to the people whose dress, movement and stories invite a closer look.</p>
        <button onClick={() => creditsRef.current.close()}>Back to the reflection</button>
      </dialog>
    </section>
  );

  return (
    <MemoryStitchIntro track={backgroundTrack} audioRef={audioRef}>
    <ChapterPlayer
      id="reflection"
      chapter="04 / REFLECTION"
      title="Memory. Identity. Future."
      subtitle="Where do I belong in all of this?"
      context="I started from Joburg North with memories of my cousin and questions I can no longer ask him. In Soweto, every style has made me look again. One last memory is waiting for me."
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
        { label: "AFTER THE NOISE", image: streetImage, text: "I thought this story was far from my life. My cousin was a connection I had overlooked while he was here.", kind: "quiet", layout: "quiet", storyRole: "reflection" },
        { label: "WHAT CHANGED", image: buildingImage, text: "Swenka helped me recognise pride and dignity. Pantsula let me feel the energy of moving together. Skhothane asked me to look beyond appearances. Each chapter changed how I looked at Ree.", kind: "quiet", layout: "quiet", storyRole: "reflection" },
        { label: "WHAT I CAN CARRY", image: houseImage, text: "I can remember Ree with a deeper appreciation of what mattered to him. I remember the care he put into his clothes, the joy he showed and the way he wanted to be seen. I still have questions, but I carry his memory more gently now.", kind: "quiet", layout: "quiet", storyRole: "reflection" },
        { label: "THERE HE IS", collage: cousinPhotos, photoMasks: ["portrait", "square"], text: "These are the photographs I kept of him. Come closer. I want you to meet the cousin I have been remembering." },
      ]}
      onComplete={() => completeChapter("reflection")}
    />
    </MemoryStitchIntro>
  );
}

export default Reflection;
