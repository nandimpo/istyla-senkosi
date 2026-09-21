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
import tkzee1 from "../assets/Chapter 3_Skothane/Images/Editioral/tkzee.jpg";
import tkzee2 from "../assets/Chapter 3_Skothane/Images/Editioral/tkzee 2.jpg";
import pantsulaStyle from "../assets/Chapter 3_Skothane/Images/Editioral/A Closer Look at the Style of South Africa's Pantsula Dancers.jpg";
import vilaCoster from "../assets/Chapter 3_Skothane/Images/Editioral/Vila Coster dancers posing outside a member’s house. - ny times.jpg";
import blackLabel from "../assets/Chapter 3_Skothane/Images/Historical/Black label.jpg";
import manBending from "../assets/Chapter 3_Skothane/Images/Historical/Man bending.jpg";
import brotherhood1 from "../assets/Chapter 3_Skothane/Images/tkzee/BROTHERHOOD SOCIAL CLUB/BROTHERHOOD SOCIAL CLUB  HUMANS by Isabel Corthier Photographer.jpg";
import brotherhood2 from "../assets/Chapter 3_Skothane/Images/tkzee/BROTHERHOOD SOCIAL CLUB/BROTHERHOOD SOCIAL CLUB  HUMANS by Isabel Corthier Photographer 2.jpg";
import brotherhood3 from "../assets/Chapter 3_Skothane/Images/tkzee/BROTHERHOOD SOCIAL CLUB/BROTHERHOOD SOCIAL CLUB  HUMANS by Isabel Corthier Photographer 3.jpg";
import chapterImage from "../assets/images/Chapter images/skothane chapter.jpg";
import backgroundTrack from "../assets/audio/New Music/Moonchild Sanelly - Yebo Teacher _Skhothane.mp3";
import materialCultureVideo from "../assets/Chapter 3_Skothane/Video/Material Culture- Touch Down Tembisa (Dec 2016) Izikhothane.mp4";
import materialBoysVideo from "../assets/Chapter 3_Skothane/Video/South Africa's Material Boys 2.mp4";

const carouselImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9];
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
        { label: "THE LOOK SPEAKS", storyRole: "voices", video: materialCultureVideo, outfitGate: true, playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "COLOUR IN MOTION", storyRole: "observe", collage: [img1, img9, tkzee1, tkzee2, pantsulaStyle], kind: "memory-album", caption: "COLOUR. BRANDS. PERFORMANCE." },
        { label: "MADE TO BE SEEN", storyRole: "observe", collage: [img2, img3, img5, img7, blackLabel, manBending], kind: "memory-album", text: "I look at the colours, the confidence and the details. This time, I’m trying to see more than an outfit." },
        { label: "WHAT IT COSTS TO SHINE", storyRole: "voices", video: materialBoysVideo, playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "THE WAY HE TURNED", storyRole: "memory", collage: [img6, img4, img8, vilaCoster, brotherhood1, brotherhood2, brotherhood3], text: "I remember him turning at the door to show me his outfit. I laughed at the bright colours. I wish I had looked longer.", kind: "memory-album" },
        { label: "LOOKING AGAIN", storyRole: "reflection", collage: finaleCollage, collageLabel: "Skhothane finale collage", kind: "fashion-wall", galleryStyle: "crossfade", textStyle: "float", text: "I’m beginning to see expression where I once saw only brands. I cannot speak for my cousin, but I can hold his memory with more care. One last look at him is waiting at the end of this journey.", caption: "UP NEXT: REFLECTION", nextChapter: "reflection", nextChapterLabel: "Continue to the reflection" },
      ]}
      gamePage={(onComplete) => <SwipeCarouselGame images={carouselImages} onComplete={onComplete} />}
      onComplete={() => completeChapter("skhothane")}
    />
    </SkhothaneBurnIntro>
  );
}

export default Skhothane;
