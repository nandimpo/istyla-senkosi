import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import SwipeCarouselGame from "../components/games/SwipeCarouselGame";
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

const carouselImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

function Skhothane() {
  const { completeChapter } = useNavigation();

  return (
    <ChapterPlayer
      id="skhothane"
      chapter="03 / SKHOTHANE"
      title="Expression. Pride. Spectacle."
      subtitle="It’s more than what you wear."
      context="This is where the journey feels closest to home. I think of my cousin’s outfits and how quickly I called them showing off. Before deciding what his clothes mean, I need to hear his side of the story."
      accent="red"
      interaction="swipe"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="wipe"
      titleWipeDirection="right"
      track={backgroundTrack}
      frames={[
        { label: "High energy / Smash cuts", collage: [img1, img9, tkzee1, tkzee2, pantsulaStyle], caption: "COLOUR. BRANDS. PERFORMANCE." },
        { label: "Build up collage", collage: [img2, img3, img5, img7, blackLabel, manBending], text: "The colours and confidence bring my cousin to mind. This time, I’m trying to look without deciding who someone is from an outfit." },
        { label: "Cousin moment / Slow down", collage: [img6, img4, img8, vilaCoster, brotherhood1, brotherhood2, brotherhood3], text: "I knew someone who dressed like this. My cousin. I never asked him why.", kind: "hold" },
        { label: "After interviews / Realisation", collage: [img8, img1, img2, img3, img4, img5, img7, img9], text: "I’m beginning to see expression where I once saw only brands. But my cousin’s reasons are his to tell. I want our next conversation to start with a question." },
      ]}
      gamePage={(onComplete) => <SwipeCarouselGame images={carouselImages} onComplete={onComplete} />}
      onComplete={() => completeChapter("skhothane")}
    />
  );
}

export default Skhothane;
