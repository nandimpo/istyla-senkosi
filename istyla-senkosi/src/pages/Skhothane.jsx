import jewellerySketch from "../assets/Chapter 3_Skothane/Images/Textures/Jewelry_illustration.jpg";
import loafersSketch from "../assets/Chapter 3_Skothane/Images/Textures/loafers_drawing.jpg";
import backpackSketch from "../assets/Chapter 3_Skothane/Images/Textures/Backpack_Illustration.jpg";
import articleOne from "../assets/Chapter 3_Skothane/Images/Textures/Article_1.png";
import articleTwo from "../assets/Chapter 3_Skothane/Images/Textures/Article_2.png";
import articleThree from "../assets/Chapter 3_Skothane/Images/Textures/Article_3.png";
import { useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import SwipeCarouselGame from "../components/games/SwipeCarouselGame";
import SkhothaneBurnIntro from "../components/SkhothaneBurnIntro";
import img4 from "../assets/Chapter 3_Skothane/Skothane/skhothane-4.jpg";
import img5 from "../assets/Chapter 3_Skothane/Skothane/skhothane-5.jpg";
import img6 from "../assets/Chapter 3_Skothane/Skothane/skhothane-6.jpg";
import img7 from "../assets/Chapter 3_Skothane/Skothane/skhothane-7.jpg";
import img8 from "../assets/Chapter 3_Skothane/Skothane/skhothane-8.jpg";
import cousinOne from "../assets/images/Cousin/Cousin 1.jpeg";
import cousinFour from "../assets/images/Cousin/Cousin 4.png";
import cousinTwo from "../assets/images/Cousin/Cousin_2_old.jpeg";
import chapterImage from "../assets/images/Chapter images/skothane chapter.jpg";
import backgroundTrack from "../assets/normalized-audio/Moonchild Sanelly - Yebo Teacher _Skhothane.mp3";
import materialCultureVideo from "../assets/edited-clips/skhothane-expression.mp4";
import materialBoysVideo from "../assets/edited-clips/skhothane-voices.mp4";

const skhothaneAlbumImages = [cousinOne, cousinFour, cousinTwo];
const skhothaneAlbumTitles = [
  "I return to the photograph that started my journey.",
  "I look at the people beside him, as well as the clothes.",
  "I wish I had asked him more.",
];
const skhothaneAlbumNotes = [
  "Ree's outfit catches my eye. Now I take more time to look.",
  "These are photographs from our family collection, part of how I remember him.",
  "I cannot ask what every choice meant, but I can look with more care.",
];

const carouselImages = [img5, img6, img4, img8, img7];
const finaleCollage = Object.entries(import.meta.glob("../assets/Chapter 3_Skothane/Images/Photo Gallery/*.{jpg,jpeg,png,webp}", { eager: true, query: "?url", import: "default" }))
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, src]) => src).concat([jewellerySketch, loafersSketch, backpackSketch, articleOne, articleTwo, articleThree]);

const finaleSlots = [
  [8.5,7.6,27,46.2,-3], [37.3,8.75,25.2,29.4,2], [67,7.6,16.2,37.8,-2],
  [6.7,49,16.2,35.7,-5], [35.5,46.7,24.3,35.7,-2], [60.7,36.35,21.6,26.25,3],
  [61.6,67.4,18,17.85,-2], [72.4,73.15,19.8,15.75,-3], [48.1,30.6,11.7,22.05,-12],
  [91,35,8,19,-12], [31,35,13,22,12], [27,68,14,28,-9],
  [0,31,13,20,-5], [23,43,15,18,4], [84,57,14,32,3],
];

function Skhothane() {
  const audioRef = useRef(null);
  const { completeChapter } = useNavigation();

  return (
    <SkhothaneBurnIntro track={backgroundTrack} audioRef={audioRef}>
    <ChapterPlayer
      id="skhothane"
      chapter="03 / SKHOTHANE"
      title="Expression. Pride. Spectacle."
      subtitle="It’s more than what you wear."
      context="The colour and confidence bring me back to Ree. I used to judge his outfits as showing off. After looking at Swenka’s care and trying Pantsula’s steps, I arrive at Skhothane with different questions. What did he enjoy about being seen? What did I miss when I thought I already understood him?"
      accent="red"
      interaction="swipe"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="wipe"
      titleWipeDirection="right"
      track={backgroundTrack}
      sharedAudioRef={audioRef}
      frames={[
        { label: "THE LOOK SPEAKS", storyRole: "voices", video: materialCultureVideo, videoNotes: [
          { start: 2, end: 7, text: "I notice how the patterns carry through their outfits." },
          { start: 8, end: 13, text: "The clothes move with them. The style feels alive." },
          { start: 14, end: 20, text: "They take turns being seen. I notice the group around them." },
        ], videoOutro: "The colours catch my eye, just as Ree’s did. This time, I want to stay with the details instead of deciding what they mean too quickly.", videoBridge: "Swenka made me notice the care. Pantsula made me look at movement and the people around it. Now I watch the style Ree loved, trying to leave my judgement behind.", outfitGate: true, playSeconds: 20, skipAfter: 10, caption: "20-SECOND CLIP" },
        { label: "WHAT IT COSTS TO SHINE", storyRole: "voices", video: materialBoysVideo, videoOutro: "Their words are not Ree’s answers. Still, listening makes me wish I had given him the same chance to tell me about the clothes he loved.", videoBridge: "Looking closely at the clothes brings me back to how quickly I judged Ree. I cannot ask him what his style meant now. I turn to the people who share this world, and listen.", playSeconds: 20, skipAfter: 10, caption: "20-SECOND CLIP" },
        { label: "LOOKING AGAIN", storyRole: "reflection", collage: finaleCollage, scrapbookSlots: finaleSlots, clippingKinds: [...Array(finaleCollage.length - 6).fill("photo"), "sketch", "sketch", "sketch", "article", "article", "article"], collageLabel: "Skhothane finale collage", kind: "fashion-wall", scrapbookChapter: "03 / SKHOTHANE", galleryStyle: "crossfade", textStyle: "float", text: "After looking closer at Skhothane, I still see its colours and confidence in the styles around me today. And I see my cousin in them. I add these images to my book of him, holding on to the joy and care I once overlooked. I cannot speak for him, but I can keep his memory with me." },
        { label: "THROUGH THE ALBUM", storyRole: "memory", collage: skhothaneAlbumImages, albumTitles: skhothaneAlbumTitles, albumNotes: skhothaneAlbumNotes, albumImagePositions: ["center", "center", "center"], photoMasks: ["portrait", "portrait", "square"], kind: "memory-album", photoAlbum: true, albumLabel: "My family photographs of Ree", text: "I turn back to our family photographs of Ree. After looking at Skhothane, I notice his choices with more care. These pictures hold my memories. They cannot answer every question I still have. After everything I have learned, I can finally reflect on what Ree means to me.", caption: "UP NEXT: REFLECTION", nextChapter: "reflection", nextChapterLabel: "Continue to the reflection" },
      ]}
      gamePosition="afterFirstFrame"
      gamePage={(onComplete) => <SwipeCarouselGame images={carouselImages} audioRef={audioRef} onComplete={onComplete} />}
      onComplete={() => completeChapter("skhothane")}
    />
    </SkhothaneBurnIntro>
  );
}

export default Skhothane;
