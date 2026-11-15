import { useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import BeatGame from "../components/games/BeatGame";
import IspotiIntro from "../components/IspotiIntro";
import secondVideo from "../assets/Chapter 2_Pantsula/Video/Pantsula_2.mov";
import entryVideo from "../assets/Chapter 2_Pantsula/Video/Pantsula_1.mov";
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
import collageBackground from "../assets/Chapter 2_Pantsula/Background images/Pantsula_Collage.jpg";
import backgroundTrack from "../assets/audio/New Music/TKZee - Dlala Mapantsula (archive and chapter intro song) _Pantsula.mp3";

const sceneImages = [readyImage, stanceImage, stepImage, rhythmImage, swingImage, finaleImage];
const collagePhotos = import.meta.glob("../assets/Chapter 2_Pantsula/Images/Editorial/Collage/Collage *.{jpg,jpeg,png,webp}", { eager: true, query: "?url", import: "default" });
const sketchImages = Object.entries(import.meta.glob("../assets/Chapter 2_Pantsula/Images/Sketches/*.{jpg,jpeg,png,webp}", { eager: true, query: "?url", import: "default" }))
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, src]) => src);
const photo = (number) => collagePhotos[`../assets/Chapter 2_Pantsula/Images/Editorial/Collage/Collage ${number}.jpg`];
const finaleCollage = [2, 13, 11, 10].map(photo).concat(sketchImages, [1, 3, 5, 8].map(photo));
const finaleKinds = ["photo", "photo", "photo", "photo", "detail", "article", "article", "article", "detail", "detail", "photo", "photo", "outfit", "photo"];
const finaleSlots = [
  [4,5,28,32,-3], [70,9,25,35,2], [36,5,28,33,2], [37,53,27,35,-2],
  [4,40,20,28,-6], [23,41,16,34,4], [4,77,27,17,-3],
  [69,80,26,14,2], [64,43,21,34,-4], [82,43,16,34,4],
  [17,31,20,29,4], [59,34,20,29,-4], [68,36,20,22,3], [5,62,20,28,-4],
];
const finaleNotes = [
  { text:"same hat, a different attitude ↘", x:66, y:17, tilt:5 },
  { text:"look at the colour!", x:37, y:52, tilt:-5 },
  { text:"workwear → streetwear", x:3, y:76, tilt:-4 },
  { text:"it starts with the feet…", x:68, y:80, tilt:3 },
  { text:"his world, still moving", x:35, y:92, tilt:-3 },
];

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
        { label: "THE STREET MOVES", storyRole: "voices", video: entryVideo, videoOutro: "I had made the shoes my own. Watching Pantsula, I began to think about the rhythm I wanted to bring to them.", videoBridge: "My shoes now carried a little of me. Before trying the steps, I wanted to watch Pantsula in motion and find where my own rhythm might fit.", laceGate: true, playToEnd: true, skipAfter: 35, caption: "PANTSULA IN MOTION / SKIP AVAILABLE AFTER 35 SECONDS" },
        { label: "BETWEEN THE STEPS", storyRole: "observe", collage: [marketImage, seatedPortrait], motion: "crossfade", galleryStyle: "crossfade", text: "I watch the steps, the clothes and the space around the dancers. Trying the rhythm helps me notice how each movement fits with the others." },
        { label: "LOOKING CLOSER", storyRole: "voices", video: secondVideo, videoOutro: "I returned to the rhythm with a little more patience. I thought of my cousin, and how much I still wanted to learn about the world he loved.", videoBridge: "I was beginning to find the rhythm, but there was still so much I had missed. I stayed a little longer, looking beyond the steps and thinking about what had drawn my cousin to Pantsula.", playToEnd: true, skipAfter: 15, caption: "PANTSULA / A CLOSER LOOK" },
        { label: "TRYING TO KEEP TIME", storyRole: "memory", collage: [editorial2, editorial1, editorial3], motion: "crossfade", galleryStyle: "crossfade", text: "I try to follow the rhythm. For a moment, I imagine telling my cousin about it, then remember that I cannot. I see how much I took for granted when he was here." },
        { label: "THE RHYTHM STAYS", storyRole: "reflection", collage: finaleCollage, backgroundImage: collageBackground, collageLabel: "Pantsula finale collage", kind: "fashion-wall", scrapbookChapter: "02 / PANTSULA", scrapbookSlots: finaleSlots, scrapbookNotes: finaleNotes, clippingKinds: finaleKinds, galleryStyle: "crossfade", textStyle: "float", text: "After trying the steps, I notice Pantsula everywhere: in the shoes, the streetwear, the way people move together today. I think of my cousin and the rhythm he brought into a room. I continue collecting the details that connect what I have learned to the world around me. I carry him into the next chapter.", caption: "UP NEXT: SKHOTHANE", nextChapter: "skhothane", nextChapterLabel: "Explore Skhothane next" },
      ]}
      gamePage={(onComplete) => <BeatGame sceneImages={sceneImages} onComplete={onComplete} />}
      onComplete={() => completeChapter("pantsula")}
    />
    </IspotiIntro>
  );
}

export default Pantsula;
