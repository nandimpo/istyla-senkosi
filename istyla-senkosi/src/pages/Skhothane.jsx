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
import backgroundTrack from "../assets/audio/New Music/Moonchild Sanelly - Yebo Teacher _Skhothane.mp3";
import materialCultureVideo from "../assets/Chapter 3_Skothane/Video/Intro Video - Skothane.mp4";
import materialBoysVideo from "../assets/video-clips/skhothane-voices.mp4";

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
  .map(([, src]) => src);

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
      context="The colour and confidence bring back memories of my cousin. I once called his outfits showing off. Since he died, I have wondered what I failed to see in the way he dressed."
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
        ], videoOutro: "After seeing them express themselves, I wanted to look more closely at the colours and the clothes.", videoBridge: "To understand the style my cousin loved, I had to look beyond the clothes.", outfitGate: true, playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "WHAT IT COSTS TO SHINE", storyRole: "voices", video: materialBoysVideo, videoOutro: "Hearing their stories brought me back to the way my cousin wore his own style.", videoBridge: "I used to see only the spectacle. Now I wanted to hear what it meant to the people behind it.", playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "LOOKING AGAIN", storyRole: "reflection", collage: finaleCollage, collageLabel: "Skhothane finale collage", kind: "fashion-wall", scrapbookChapter: "03 / SKHOTHANE", galleryStyle: "crossfade", textStyle: "float", text: "After looking closer at Skhothane, I still see its colours and confidence in the styles around me today. And I see my cousin in them. I add these images to my book of him,  holding on to the joy and care I once overlooked. I cannot speak for him, but I can keep his memory with more tenderness." },
        { label: "THROUGH THE ALBUM", storyRole: "memory", collage: skhothaneAlbumImages, albumTitles: skhothaneAlbumTitles, albumNotes: skhothaneAlbumNotes, albumImagePositions: ["center", "center", "center"], photoMasks: ["portrait", "portrait", "square"], kind: "memory-album", photoAlbum: true, albumLabel: "My family photographs of Ree", text: "I turn back to our family photographs of Ree. After looking at Skhothane, I notice his choices with more care. These pictures hold my memories; they cannot answer every question I still have. I carry that closer attention into my final reflection on what Ree means to me.", caption: "UP NEXT: REFLECTION", nextChapter: "reflection", nextChapterLabel: "Continue to the reflection" },
      ]}
      gamePage={(onComplete) => <SwipeCarouselGame images={carouselImages} audioRef={audioRef} onComplete={onComplete} />}
      onComplete={() => completeChapter("skhothane")}
    />
    </SkhothaneBurnIntro>
  );
}

export default Skhothane;
