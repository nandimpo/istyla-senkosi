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
import materialCultureVideo from "../assets/edited-clips/skhothane-expression.mp4";
import materialBoysVideo from "../assets/edited-clips/skhothane-voices.mp4";

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
        ], videoOutro: "The bold colours caught my eye. Now I want to slow down and notice what the clothes might communicate about identity, status and being recognised.", videoBridge: "To understand the style my cousin loved, I had to look beyond the clothes.", playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "THROUGH THE ALBUM", storyRole: "observe", collage: skhothaneAlbumImages, albumTitles: skhothaneAlbumTitles, albumNotes: skhothaneAlbumNotes, albumImagePositions: ["center bottom", "center 28%", "center 22%", "center 14%"], kind: "memory-album", photoAlbum: true, albumLabel: "Photographs of other Skhothanes", text: "I turn one photograph at a time, looking beyond my first impression. Their choices remind me of Ree, and the questions I never asked him.", caption: "LOOKING AT THEIR STYLE. THINKING OF HIM." },
        { label: "WHAT IT COSTS TO SHINE", storyRole: "voices", video: materialBoysVideo, outfitGate: true, videoOutro: "I first noticed the spectacle. Hearing their stories makes me question that first impression. I think of Ree and the meaning I never asked him to explain.", videoBridge: "Choosing the clothes made me wonder why a brand, a colour or a complete look might matter. I cannot answer for Ree. I want to hear how others describe the cost, the recognition and the meaning of their style.", playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "LOOKING AGAIN", storyRole: "reflection", collage: finaleCollage, collageLabel: "Skhothane finale collage", kind: "fashion-wall", scrapbookChapter: "03 / SKHOTHANE", galleryStyle: "crossfade", textStyle: "float", text: "I came here remembering what I once called showing off. Now the colours surprise me in another way: I notice the care, joy and connection around them. Ree's choices feel less distant. I cannot decide what every outfit meant to him, but I can look beyond my first impression and remember him with more understanding.", caption: "UP NEXT: REFLECTION", nextChapter: "reflection", nextChapterLabel: "Continue to the reflection" },
      ]}
      gamePosition="afterFirstFrame"
      gamePage={(onComplete) => <SwipeCarouselGame images={carouselImages} audioRef={audioRef} onComplete={onComplete} />}
      onComplete={() => completeChapter("skhothane")}
    />
    </SkhothaneBurnIntro>
  );
}

export default Skhothane;
