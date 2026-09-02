import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import WardrobeGame from "../components/games/WardrobeGame";
import interviewVideo from "../assets/Chapter 1_Swenka/Video/BLACK GOSLING  EDGARS  REBRAND  SWENKAS (Intro video).mp4";
import interviewVideoTwo from "../assets/Chapter 1_Swenka/Video/The Swenkas (2004).mp4";
import editorial1 from "../assets/Chapter 1_Swenka/Images/Editorial/1976- Man with suit.jpg";
import editorial2 from "../assets/Chapter 1_Swenka/Images/Editorial/Fashion editorial September 2020.jpg";
import editorial4 from "../assets/Chapter 1_Swenka/Images/Editorial/Man with pinstripe jacket.jpg";
import editorial5 from "../assets/Chapter 1_Swenka/Images/Editorial/Inkabi nation.jpg";
import editorial6 from "../assets/Chapter 1_Swenka/Images/Editorial/South Africa 90's 80's aesthetic.jpg";
import portraitImage from "../assets/Chapter 1_Swenka/Images/Editorial/Man with yellow and blue suit.jpg";
import chapterImage from "../assets/images/Chapter images/swenka chapter image.jpg";
import backgroundTrack from "../assets/audio/New Music/Miriam Makeba - Khawuleza (Live 1966) _ Swenka.mp3";

function Swenka() {
  const { completeChapter } = useNavigation();

  return (
    <ChapterPlayer
      id="swenka"
      chapter="01 / SWENKA"
      title="Precision. Discipline. Respect."
      subtitle="More than style. It’s about how you carry yourself."
      context="The first time I really paid attention to a Swenka man, I wasn’t looking at the suit. I was looking at how still he stood in it — like the clothes were the least important part of what he was showing me."
      interaction="drag"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="cut"
      track={backgroundTrack}
      frames={[
        { label: "Memory collage / Jama’s view", collage: [editorial1, editorial2], text: "I’d seen this kind of style before." },
        { label: "Interview 1 / Let them speak", video: interviewVideo, lockSeconds: 12, badge: "● REC", caption: "10–15 SEC CLIP" },
        { label: "Detail shots", collage: [editorial4, editorial5, editorial6], text: "The suits, the detail… everything very put together." },
        { label: "Interview 2 / Let them speak", video: interviewVideoTwo, videoStart: 300, lockSeconds: 12, badge: "● REC", caption: "10–15 SEC CLIP" },
      ]}
      gamePage={(onComplete) => <WardrobeGame portraitImage={portraitImage} onComplete={onComplete} />}
      onComplete={() => completeChapter("swenka")}
    />
  );
}

export default Swenka;
