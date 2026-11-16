import { useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import BeatGame from "../components/games/BeatGame";
import IspotiIntro from "../components/IspotiIntro";
import secondVideo from "../assets/edited-clips/pantsula-performance.mp4";
import entryVideo from "../assets/edited-clips/pantsula-movement.mp4";
import readyImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-0-ready.jpg";
import stanceImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-1-stance.jpg";
import stepImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-2-step.jpg";
import rhythmImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-3-rhythm.jpg";
import swingImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-4-swing.jpg";
import finaleImage from "../assets/Chapter 2_Pantsula/Pantsula/pantsula-5-finale.jpg";
import marketImage from "../assets/Chapter 2_Pantsula/Images/Editorial/Light Summer Knits Dropping Friday Online - Link on bio.CPT- @brokeklubhouse (53 Wale street, Ca (1).jpg";
import seatedPortrait from "../assets/Chapter 2_Pantsula/Images/Historical/Pantsula 2.jpg";
import cousinPhoto from "../assets/images/Cousin/Cousin_2_old.jpeg";
import chapterImage from "../assets/images/Chapter images/pantsula chapter intro.jpg";
import collageBackground from "../assets/Chapter 2_Pantsula/Background images/Pantsula_Collage.jpg";
import backgroundTrack from "../assets/normalized-audio/TKZee - Dlala Mapantsula (archive and chapter intro song) _Pantsula.mp3";

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
      subtitle="An earlier influence. A step towards understanding Skhothane."
      context="After Swenka, I keep thinking about the time Ree took to get dressed. But a photograph holds him still. Pantsula, an earlier influence on Skhothane, asks me to look at clothes in motion. To understand more of his world, I need to follow the music, the steps and the people around them."
      accent="olive"
      interaction="click"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="wipe"
      titleWipeDirection="left"
      track={backgroundTrack}
      sharedAudioRef={audioRef}
      frames={[
        { label: "THE STREET MOVES", storyRole: "voices", video: entryVideo, videoOutro: "Watching Pantsula, I realise how much of Ree's world I have been searching for in a still photograph. This earlier influence on Skhothane gives me somewhere to begin. I want to try the steps myself.", videoBridge: "Putting something of myself into these shoes makes me think of Ree's choices. Pantsula came before his Skhothane style and helped shape it. I watch the dancers, looking for what a still photograph cannot show me.", laceGate: true, playToEnd: true, skipAfter: 35, caption: "PANTSULA IN MOTION / SKIP AVAILABLE AFTER 35 SECONDS" },
        { label: "BETWEEN THE STEPS", storyRole: "observe", collage: [marketImage, seatedPortrait], motion: "crossfade", galleryStyle: "crossfade", text: "I watch the dancers answer one another, then try to find the beat myself. The clothes are only part of what I see. There is confidence, company, a way of being noticed. I wonder what these things meant in Ree's Skhothane world, and why I never thought to ask." },
        { label: "LOOKING CLOSER", storyRole: "voices", video: secondVideo, videoNotes: [
          { start: 2, end: 8, text: "The white hats and gloves make each movement stand out." },
          { start: 10, end: 17, text: "I follow their feet, trying to catch the rhythm of each step." },
          { start: 19, end: 26, text: "They move together, then give each other room to shine." },
          { start: 28, end: 35, text: "The people watching are part of this moment too." },
        ], videoOutro: "I used to judge Ree by what I could see. Watching these dancers, I notice how much happens between people. There's a response, a shared rhythm, a moment of recognition. I want to carry that attention into Skhothane.", videoBridge: "Before turning to Skhothane, I watch how the Pantsula dancers make room for one another. I think of Ree, and the world I only saw from outside.", playToEnd: true, skipAfter: 15, caption: "PANTSULA / A CLOSER LOOK" },
        { label: "THE RHYTHM STAYS", storyRole: "reflection", collage: finaleCollage, backgroundImage: collageBackground, collageLabel: "Pantsula finale collage", kind: "fashion-wall", scrapbookChapter: "02 / PANTSULA", scrapbookSlots: finaleSlots, scrapbookNotes: finaleNotes, clippingKinds: finaleKinds, galleryStyle: "crossfade", textStyle: "float", text: "For a moment, I want to stop watching from a distance and really look at what I have gathered about Amapantsula. Pantsula brings me closer to the movement and shared performance that helped shape Skhothane, closer to Ree. I wish I could tell him what I am noticing, and ask what belonging felt like to him." },
        { label: "TRYING TO KEEP TIME", storyRole: "memory", image: cousinPhoto, backgroundImage: collageBackground, kind: "memory-photo", photoMask: "square", layout: "quiet", alt: "An old photograph of Ree from the family Cousin collection", text: "I come back to Ree's photograph with the rhythm still in my mind. Pantsula has helped me look beyond an outfit to movement, performance and belonging. Now I turn to Skhothane, the style he loved. I wish he were here to take me into that world himself.", caption: "UP NEXT: SKHOTHANE", nextChapter: "skhothane", nextChapterLabel: "Explore Skhothane next" },
      ]}
      gamePosition="afterFirstFrame"
      gamePage={(onComplete) => <BeatGame sceneImages={sceneImages} onComplete={onComplete} />}
      onComplete={() => completeChapter("pantsula")}
    />
    </IspotiIntro>
  );
}

export default Pantsula;
