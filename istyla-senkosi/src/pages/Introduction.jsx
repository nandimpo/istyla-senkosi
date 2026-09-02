import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import JourneyMapGame from "../components/games/JourneyMapGame";
import johannesburgMap from "../assets/Introduction/Map of Johannesburg.png";
import johannesburgMapVector from "../assets/images/Johannesburg map 2.jpg";
import chapterImage from "../assets/images/Chapter images/Johannesburg.jpg";
import backgroundTrack from "../assets/audio/New Music/Stimela (The Coal Train).mp3";
import streetImage from "../assets/Additional Images/Street Visuals/Soweto/Spaza shop.jpg";
import taxiImage from "../assets/Additional Images/Street Visuals/Soweto/Taxi.jpg";
import towersImage from "../assets/Additional Images/Street Visuals/Soweto/Soweto towers.jpg";
import aerialImage from "../assets/Additional Images/Street Visuals/Soweto/Aerial view township.jpg";
import tourismImage from "../assets/Additional Images/Street Visuals/Soweto/A New Frontier In South Africa, Building Tourism In Soweto.jpg";

function Introduction() {
  const { completeChapter } = useNavigation();

  return (
    <ChapterPlayer
      id="introduction"
      chapter="00 / INTRO"
      title="Why am I here?"
      subtitle="A slow journey from Johannesburg North to Soweto"
      context="I grew up thinking I knew this city. It took looking properly — at the streets, the clothes, the people who dressed like it mattered — to realise how much I’d been missing, right where I was from."
      accent="beige"
      interaction="scroll"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="dissolve"
      track={backgroundTrack}
      trackStart={240}
      frames={[
        { label: "1. Map of Johannesburg", image: johannesburgMapVector, kind: "mono", text: "I’ve always been from Johannesburg…" },
        { label: "2. Movement towards Soweto", image: taxiImage, text: "But I realised I only really knew one part of it." },
        { label: "3. Arriving in Soweto", collage: [towersImage, aerialImage], text: "I grew up in the north." },
        { label: "4. First street", collage: [streetImage, tourismImage], text: "Soweto always felt… separate. This is my first time really trying to understand it." },
      ]}
      gamePage={(onComplete) => <JourneyMapGame mapImage={johannesburgMap} onComplete={onComplete} />}
      onComplete={() => completeChapter("introduction")}
    />
  );
}

export default Introduction;
