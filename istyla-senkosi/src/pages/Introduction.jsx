import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import JourneyMapGame from "../components/games/JourneyMapGame";
import johannesburgMap from "../assets/Chapter 1_Swenka/Images/Editorial/map.jpg";
import johannesburgImage from "../assets/Additional Images/Street Visuals/Johannesburg/Johannesburg black and white.jpg";
import reePhoto from "../assets/Chapter 4_Reflection/Images/Cousin_Old_Photo.png";
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
      context="My cousin Ree's Skhothane fashion always caught my eye, but I never asked what it meant to him. Since he died, that question has stayed with me. What did he find in the colours, the clothes and the people who shared his style? I travel from Johannesburg North towards Soweto, looking back at township fashion and hoping to understand a little more."
      accent="beige"
      interaction="scroll"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="dissolve"
      track={backgroundTrack}
      trackStart={240}
      frames={[
        { textStyle: "needle", label: "THE PHOTOGRAPH I KEPT", storyRole: "memory", image: reePhoto, backgroundImage: streetImage, kind: "memory-photo", layout: "quiet", alt: "The old photograph of Ree that Jama returns to throughout her journey", text: "This is one of the photographs I kept of Ree. His clothes caught my eye. Looking at him now, I wonder what I missed when I noticed only the outfit. That question is where my journey begins." },
        { textStyle: "needle", label: "HOME, BEFORE THE QUESTIONS", image: northImageOne, motion: "zoom", text: "I grew up in Johannesburg North. These were the streets I knew, the part of the city I called home." },
        { textStyle: "needle", label: "LOOKING SOUTH", collage: [northImageTwo, northImageThree], motion: "gallery", text: "As I begin to look beyond the Johannesburg I know, I turn to other places, other fashions and the people who wear them, hoping they might bring me closer to understanding my cousin, Ree." },
        { textStyle: "needle", label: "THE DISTANCE BETWEEN US", collage: [streetImage, johannesburgFashionFour], motion: "gallery", text: "Soweto always felt… separate. My cousin was part of this place, and I wish I had asked him more. What did I miss when I noticed only his clothes?" },
      ]}
      gamePosition="afterFrames"
      gamePage={(onComplete) => <JourneyMapGame mapImage={johannesburgMap} onComplete={onComplete} />}
      onComplete={() => completeChapter("introduction")}
    />
  );
}

export default Introduction;
