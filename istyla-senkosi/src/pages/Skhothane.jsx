import { useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import SwipeCarouselGame from "../components/games/SwipeCarouselGame";
import SkhothaneBurnIntro from "../components/SkhothaneBurnIntro";
import img1 from "../assets/Chapter 3_Skothane/Skothane/skhothane-1.jpg";
import img2 from "../assets/Chapter 3_Skothane/Skothane/skhothane-2.jpg";
import img3 from "../assets/Chapter 3_Skothane/Skothane/skhothane-3.jpg";
import img4 from "../assets/Chapter 3_Skothane/Skothane/skhothane-4.jpg";
import img5 from "../assets/Chapter 3_Skothane/Skothane/skhothane-5.jpg";
import img6 from "../assets/Chapter 3_Skothane/Skothane/skhothane-6.jpg";
import img7 from "../assets/Chapter 3_Skothane/Skothane/skhothane-7.jpg";
import img8 from "../assets/Chapter 3_Skothane/Skothane/skhothane-8.jpg";
import img9 from "../assets/Chapter 3_Skothane/Skothane/skhothane-9.jpg";
import chapterImage from "../assets/images/Chapter images/skothane chapter.jpg";
import backgroundTrack from "../assets/audio/New Music/Moonchild Sanelly - Yebo Teacher _Skhothane.mp3";
import materialCultureVideo from "../assets/Chapter 3_Skothane/Video/Intro Video - Skothane.mp4";
import materialBoysVideo from "../assets/video-clips/skhothane-voices.mp4";

const skhothaneAlbumImages = [img1, img9, img2, img3];
const skhothaneAlbumTitles = [
  "I turn the pages, looking for him.",
  "I notice the details I once missed.",
  "I think about his confidence.",
  "I wonder what his clothes meant to him.",
];

const skhothaneAlbumNotes = [
  "I notice the layers, right down to the belts and jeans.",
  "Different patterns come together. I notice how they pose as a group.",
  "The red and yellow catch my eye before I notice the rest.",
  "The hat, glasses and print feel carefully chosen.",
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
        { label: "THROUGH THE ALBUM", storyRole: "observe", collage: skhothaneAlbumImages, albumTitles: skhothaneAlbumTitles, albumNotes: skhothaneAlbumNotes, albumImagePositions: ["center bottom", "center 28%", "center 22%", "center 14%"], kind: "memory-album", photoAlbum: true, albumLabel: "Photographs of other Skhothanes", text: "I flip through photos of other Skhothanes, hoping to understand my cousin a little better. Their colours, their poses, the care in each outfit remind me of him. I look closer, wondering what his style meant to him and what I missed before.", caption: "LOOKING AT THEIR STYLE. THINKING OF HIM." },
        { label: "WHAT IT COSTS TO SHINE", storyRole: "voices", video: materialBoysVideo, videoOutro: "Hearing their stories brought me back to the way my cousin wore his own style.", videoBridge: "I used to see only the spectacle. Now I wanted to hear what it meant to the people behind it.", playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "LOOKING AGAIN", storyRole: "reflection", collage: finaleCollage, collageLabel: "Skhothane finale collage", kind: "fashion-wall", scrapbookChapter: "03 / SKHOTHANE", galleryStyle: "crossfade", textStyle: "float", text: "After looking closer at Skhothane, I still see its colours and confidence in the styles around me today. And I see my cousin in them. I add these images to my book of him,  holding on to the joy and care I once overlooked. I cannot speak for him, but I can keep his memory with more tenderness.", caption: "UP NEXT: REFLECTION", nextChapter: "reflection", nextChapterLabel: "Continue to the reflection" },
      ]}
      gamePage={(onComplete) => <SwipeCarouselGame images={carouselImages} audioRef={audioRef} onComplete={onComplete} />}
      onComplete={() => completeChapter("skhothane")}
    />
    </SkhothaneBurnIntro>
  );
}

export default Skhothane;
