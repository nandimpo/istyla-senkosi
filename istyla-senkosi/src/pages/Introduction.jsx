import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import JourneyMapGame from "../components/games/JourneyMapGame";
import johannesburgMap from "../assets/Chapter 1_Swenka/Images/Editorial/map.jpg";
import johannesburgImage from "../assets/Additional Images/Street Visuals/Johannesburg/Johannesburg black and white.jpg";
import chapterImage from "../assets/Introduction/Enviroment/Johannesburg home image 1.png";
import backgroundTrack from "../assets/audio/New Music/Stimela (The Coal Train).mp3";
import streetImage from "../assets/Additional Images/Street Visuals/Soweto/Spaza shop.jpg";
import northImageOne from "../assets/Introduction/Enviroment/Johannesburg north 1.jpg";
import northImageTwo from "../assets/Introduction/Images/Johannesburg north 2.jpg";
import northImageThree from "../assets/Introduction/Images/Johannesburg north 3.jpg";
import johannesburgFashionFour from "../assets/Introduction/Images/Johannesburg Fashion 4.jpg";

function Introduction() {
  const { completeChapter } = useNavigation();

  return (
    <ChapterPlayer
      id="introduction"
      chapter="00 / INTRO"
      title="Why am I here?"
      subtitle="A slow journey from Johannesburg North to Soweto"
      context="I’m Jama. I grew up in Johannesburg North, thinking I knew this city. My cousin’s style always caught my eye, but I never asked what it meant to him. This journey towards Soweto begins with that question."
      accent="beige"
      interaction="scroll"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="dissolve"
      track={backgroundTrack}
      trackStart={240}
      frames={[
        { label: "1. Map of Johannesburg", image: johannesburgImage, motion: "zoom", kind: "mono", text: "I’ve always been from Johannesburg…" },
        { label: "2. Johannesburg North / Where I began", image: northImageOne, motion: "zoom", text: "I grew up in Johannesburg North. These were the streets I knew, the part of the city I called home." },
        { label: "3. Leaving the north / Towards Soweto", collage: [northImageTwo, northImageThree], motion: "gallery", text: "As we slowly leave the north behind, I begin to look beyond the Johannesburg I know. Soweto is still ahead of us." },
        { label: "4. First street", collage: [streetImage, johannesburgFashionFour], motion: "gallery", text: "Soweto always felt… separate. But my cousin is part of the reason I’m looking closer. What have I missed by only noticing the clothes?" },
      ]}
      gamePosition="afterFrames"
      gamePage={(onComplete) => <JourneyMapGame mapImage={johannesburgMap} onComplete={onComplete} />}
      onComplete={() => completeChapter("introduction")}
    />
  );
}

export default Introduction;
