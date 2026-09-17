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
  const { completeChapter } = useNavigation();

  return (
    <IspotiIntro>
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
      frames={[
        { label: "Memory collage / Jama’s view", collage: [editorial2, editorial1, editorial3], motion: "gallery", galleryStyle: "alternate", text: "Step. Step. Step. I try to follow the rhythm, already imagining how I’ll describe this moment to my cousin." },
        { label: "Street energy / Fast cuts", video: entryVideo, playSeconds: 20, skipAfter: 10, caption: "MOVEMENT BUILDS / 20 SECOND CLIP" },
        { label: "Interview / Let them speak", video: interviewVideo, playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "Details + environment", collage: [marketImage, seatedPortrait], motion: "gallery", galleryStyle: "alternate", text: "I can’t just look anymore. Trying the steps reminds me how little I know about the things my cousin makes look effortless." },
        { label: "Taking the rhythm with me / Jama’s reflection", collage: finaleCollage, collageLabel: "Pantsula finale collage", kind: "fashion-wall", textStyle: "float", text: "I arrived watching from the edge. Now I’m leaving with the rhythm still in my feet. I want to tell my cousin about the hats, the clothes and the way people move together, then ask what he sees. As I turn towards Skhothane, that conversation feels closer than ever.", caption: "UP NEXT: SKHOTHANE", nextChapter: "skhothane", nextChapterLabel: "Explore Skhothane next" },
      ]}
      gamePage={(onComplete) => <BeatGame sceneImages={sceneImages} onComplete={onComplete} />}
      onComplete={() => completeChapter("pantsula")}
    />
    </IspotiIntro>
  );
}

export default Pantsula;
