import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import BeatGame from "../components/games/BeatGame";
import interviewVideo from "../assets/Chapter 2_Pantsula/Video/South African Ama Pantsula Dance culture (showYourLegs Ep.1).mp4";
import entryVideo from "../assets/Chapter 2_Pantsula/Video/Intro Video- Pantsula.mp4";
import readyImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-0-ready.jpg";
import stanceImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-1-stance.jpg";
import stepImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-2-step.jpg";
import rhythmImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-3-rhythm.jpg";
import swingImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-4-swing.jpg";
import finaleImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-5-finale.jpg";
import editorial1 from "../assets/Chapter 2_Pantsula/Images/Editorial/Light Summer Knits Dropping Friday Online - Link on bio.CPT- @brokeklubhouse (53 Wale street, Ca (1).jpg";
import editorial2 from "../assets/Chapter 2_Pantsula/Images/Editorial/Light Summer Knits Dropping Friday Online - Link on bio.CPT- @brokeklubhouse (53 Wale street, Ca.jpg";
import editorial3 from "../assets/Chapter 2_Pantsula/Images/Editorial/Light Summer Knits Dropping Friday Online - Link on bio.CPT- @brokeklubhouse.jpg";
import chapterImage from "../assets/images/Chapter images/pantsula chapter intro.jpg";
import backgroundTrack from "../assets/audio/New Music/TKZee - Dlala Mapantsula (archive and chapter intro song) _Pantsula.mp3";

const sceneImages = [readyImage, stanceImage, stepImage, rhythmImage, swingImage, finaleImage];

function Pantsula() {
  const { completeChapter } = useNavigation();

  return (
    <ChapterPlayer
      id="pantsula"
      chapter="02 / PANTSULA"
      title="Movement. Rhythm. Community."
      subtitle="This is how the streets speak."
      context="Nobody taught the steps in a class. You learned them standing at the edge of a circle, watching, until your body understood before your mind did. That’s how the streets pass things down."
      accent="olive"
      interaction="click"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="wipe"
      titleWipeDirection="left"
      track={backgroundTrack}
      frames={[
        { label: "Memory collage / Jama’s view", collage: [editorial1, editorial2, editorial3], text: "Then everything started moving. Step. Step. Step." },
        { label: "Street energy / Fast cuts", video: entryVideo, caption: "MOVEMENT BUILDS" },
        { label: "Interview / Let them speak", video: interviewVideo, lockSeconds: 12, caption: "10 TO 15 SEC CLIP" },
        { label: "Details + environment", collage: [stanceImage, stepImage, rhythmImage, swingImage], text: "I couldn’t just look anymore." },
      ]}
      gamePage={(onComplete) => <BeatGame sceneImages={sceneImages} onComplete={onComplete} />}
      onComplete={() => completeChapter("pantsula")}
    />
  );
}

export default Pantsula;
