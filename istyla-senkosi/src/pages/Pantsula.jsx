import { useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import BeatGame from "../components/games/BeatGame";
import IspotiIntro from "../components/IspotiIntro";
import interviewVideo from "../assets/Chapter 2_Pantsula/Video/South African Ama Pantsula Dance culture (showYourLegs Ep.1).mp4";
import entryVideo from "../assets/video-clips/pantsula-movement.mp4";
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
        { label: "THE STREET MOVES", storyRole: "voices", video: entryVideo, videoOutro: "After watching them move, I began to notice what happened between the steps.", videoBridge: "To understand Pantsula, I had to see how the streets moved.", laceGate: true, playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "BETWEEN THE STEPS", storyRole: "observe", collage: [marketImage, seatedPortrait], motion: "crossfade", galleryStyle: "crossfade", text: "I watch the steps, the clothes and the space around the dancers. Trying the rhythm helps me notice how each movement fits with the others." },
        { label: "IN THEIR OWN WORDS", storyRole: "voices", video: interviewVideo, videoOutro: "Their words stayed with me as I tried to find the rhythm for myself.", videoBridge: "I could follow the steps. To understand their meaning, I had to listen to the people who lived them.", playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "TRYING TO KEEP TIME", storyRole: "memory", collage: [editorial2, editorial1, editorial3], motion: "crossfade", galleryStyle: "crossfade", text: "Step. Step. Step. I try to follow the rhythm. For a moment, I imagine telling my cousin about it, then remember that I cannot. I see how much I took for granted when he was here." },
        { label: "THE RHYTHM STAYS", storyRole: "reflection", collage: finaleCollage, collageLabel: "Pantsula finale collage", kind: "fashion-wall", scrapbookChapter: "02 / PANTSULA", galleryStyle: "crossfade", textStyle: "float", text: "After trying the steps, I notice Pantsula everywhere: in the shoes, the streetwear, the way people move together today. I think of my cousin and the rhythm he brought into a room. I make another scrapbook page, collecting the details that connect what I have learned to the world around me. I carry him into the next chapter.", caption: "UP NEXT: SKHOTHANE", nextChapter: "skhothane", nextChapterLabel: "Explore Skhothane next" },
      ]}
      gamePage={(onComplete) => <BeatGame sceneImages={sceneImages} onComplete={onComplete} />}
      onComplete={() => completeChapter("pantsula")}
    />
    </IspotiIntro>
  );
}

export default Pantsula;
