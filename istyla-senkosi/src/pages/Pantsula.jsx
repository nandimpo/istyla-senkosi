import { useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import BeatGame from "../components/games/BeatGame";
import IspotiIntro from "../components/IspotiIntro";
import interviewVideo from "../assets/Chapter 2_Pantsula/Video/South African Ama Pantsula Dance culture (showYourLegs Ep.1).mp4";
import entryVideo from "../assets/Chapter 2_Pantsula/Video/Intro Video- Pantsula.mp4";
import readyImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-0-ready.jpg";
import stanceImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-1-stance.jpg";
import stepImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-2-step.jpg";
import rhythmImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-3-rhythm.jpg";
import swingImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-4-swing.jpg";
import finaleImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-5-finale.jpg";
import editorial1 from "../assets/Chapter 2_Pantsula/Images/Historical/Pantsula 1.jpg";
import editorial2 from "../assets/Chapter 2_Pantsula/Images/Historical/Pantsula 4.jpg";
import editorial3 from "../assets/Chapter 2_Pantsula/Images/Historical/Pantsula 5.jpg";
import marketImage from "../assets/Chapter 2_Pantsula/Images/Editorial/Light Summer Knits Dropping Friday Online - Link on bio.CPT- @brokeklubhouse (53 Wale street, Ca (1).jpg";
import seatedPortrait from "../assets/Chapter 2_Pantsula/Images/Historical/Pantsula 2.jpg";
import chapterImage from "../assets/images/Chapter images/pantsula chapter intro.jpg";
import backgroundTrack from "../assets/audio/New Music/TKZee - Dlala Mapantsula (archive and chapter intro song) _Pantsula.mp3";

const sceneImages = [readyImage, stanceImage, stepImage, rhythmImage, swingImage, finaleImage];
const finaleCollage = Object.entries(import.meta.glob("../assets/Chapter 2_Pantsula/Images/Editorial/Collage/Collage *.{jpg,jpeg,png,webp}", { eager: true, query: "?url", import: "default" }))
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, src]) => src);

function Pantsula() {
  const audioRef = useRef(null);
  const { completeChapter } = useNavigation();

  return (
    <IspotiIntro track={backgroundTrack} audioRef={audioRef}>
    <ChapterPlayer
      id="pantsula"
      chapter="02 / PANTSULA"
      title="Movement. Rhythm. Community."
      subtitle="This is how the streets speak."
      context="I’m still thinking about my cousin as I watch the dancers. With Swenka, I noticed the care in standing still. Here, I notice the care in every step. I want to try, instead of watching from a distance again."
      accent="olive"
      interaction="click"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="wipe"
      titleWipeDirection="left"
      track={backgroundTrack}
      sharedAudioRef={audioRef}
      frames={[
        { label: "THE STREET MOVES", storyRole: "voices", video: entryVideo, laceGate: true, playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "BETWEEN THE STEPS", storyRole: "observe", collage: [marketImage, seatedPortrait], motion: "crossfade", galleryStyle: "crossfade", text: "I watch the steps, the clothes and the space around the dancers. Trying the rhythm helps me notice how each movement fits with the others." },
        { label: "IN THEIR OWN WORDS", storyRole: "voices", video: interviewVideo, playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "TRYING TO KEEP TIME", storyRole: "memory", collage: [editorial2, editorial1, editorial3], motion: "crossfade", galleryStyle: "crossfade", text: "Step. Step. Step. I try to follow the rhythm. For a moment, I imagine telling my cousin about it, then remember that I cannot. I see how much I took for granted when he was here." },
        { label: "THE RHYTHM STAYS", storyRole: "reflection", collage: finaleCollage, collageLabel: "Pantsula finale collage", kind: "fashion-wall", galleryStyle: "crossfade", textStyle: "float", text: "I arrived watching from the edge. Now I’m leaving with the rhythm still in my feet. I wish I could tell my cousin about the hats, the clothes and the way people move together. As I turn towards Skhothane, I am getting closer to the part of this story that belonged to him.", caption: "UP NEXT: SKHOTHANE", nextChapter: "skhothane", nextChapterLabel: "Explore Skhothane next" },
      ]}
      gamePage={(onComplete) => <BeatGame sceneImages={sceneImages} onComplete={onComplete} />}
      onComplete={() => completeChapter("pantsula")}
    />
    </IspotiIntro>
  );
}

export default Pantsula;
