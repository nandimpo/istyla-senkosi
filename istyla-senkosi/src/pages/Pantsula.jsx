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
        { label: "THE STREET MOVES", storyRole: "voices", video: entryVideo, videoNotes: [
          { start: 2, end: 9, text: "The matching colours make the group feel connected before I follow the steps." },
          { start: 12, end: 19, text: "I follow the hands and feet, trying to find the shared rhythm." },
          { start: 23, end: 30, text: "A step forward, a shift of weight. The clothes move with the dancers." },
          { start: 35, end: 43, text: "They make room for individual movement inside the group." },
        ], videoOutro: "I see how the shoes, clothes and movements work together. Now I want to try following that rhythm, one step at a time.", videoBridge: "My shoes now carried a little of me. Before trying the steps, I wanted to watch Pantsula in motion and find where my own rhythm might fit.", laceGate: true, playToEnd: true, skipAfter: 35, caption: "PANTSULA IN MOTION / SKIP AVAILABLE AFTER 35 SECONDS" },
        { label: "BETWEEN THE STEPS", storyRole: "observe", collage: [marketImage, seatedPortrait], motion: "crossfade", galleryStyle: "crossfade", text: "I watch the shoes, the clothes and the way the dancers answer one another. The music gives their movements a shared pulse. Trying the rhythm, I begin to feel the energy of being part of something together." },
        { label: "LOOKING CLOSER", storyRole: "voices", video: secondVideo, videoNotes: [
          { start: 2, end: 8, text: "The white hats and gloves make each movement stand out." },
          { start: 10, end: 17, text: "I follow their feet, trying to catch the rhythm of each step." },
          { start: 19, end: 26, text: "They move together, then give each other room to shine." },
          { start: 28, end: 35, text: "The people watching are part of this moment too." },
        ], videoOutro: "I returned to the rhythm with a little more patience. I thought of my cousin, and how much I still wanted to learn about the world he loved.", videoBridge: "I was beginning to find the rhythm, but there was still so much I had missed. I stayed a little longer, looking beyond the steps and thinking about what had drawn my cousin to Pantsula.", playToEnd: true, skipAfter: 15, caption: "PANTSULA / A CLOSER LOOK" },
        { label: "THE RHYTHM STAYS", storyRole: "reflection", collage: finaleCollage, backgroundImage: collageBackground, collageLabel: "Pantsula finale collage", kind: "fashion-wall", scrapbookChapter: "02 / PANTSULA", scrapbookSlots: finaleSlots, scrapbookNotes: finaleNotes, clippingKinds: finaleKinds, galleryStyle: "crossfade", textStyle: "float", text: "After trying the steps, I hear the rhythm differently. The shoes and clothes belong to a moving scene of music, dancers and people watching together. For a moment, I feel less like someone looking in from outside. I think of Ree and wonder where he found that feeling of belonging." },
        { label: "TRYING TO KEEP TIME", storyRole: "memory", image: cousinPhoto, backgroundImage: collageBackground, kind: "memory-photo", photoMask: "square", layout: "quiet", alt: "An old photograph of Ree from the family Cousin collection", text: "The clothes were only part of it. Trying the steps made me notice the music, the movement and the way people respond to one another. For a moment, I imagine telling Ree about that feeling of belonging, then remember that I cannot. I carry that feeling with me as I turn to Skhothane and the style Ree loved.", caption: "UP NEXT: SKHOTHANE", nextChapter: "skhothane", nextChapterLabel: "Explore Skhothane next" },
      ]}
      gamePosition="afterFirstFrame"
      gamePage={(onComplete) => <BeatGame sceneImages={sceneImages} onComplete={onComplete} />}
      onComplete={() => completeChapter("pantsula")}
    />
    </IspotiIntro>
  );
}

export default Pantsula;
