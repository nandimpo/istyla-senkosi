import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import UnzipIntro from "../components/UnzipIntro";
import WardrobeGame from "../components/games/WardrobeGame";
import interviewVideo from "../assets/Chapter 1_Swenka/Video/BLACK GOSLING  EDGARS  REBRAND  SWENKAS (Intro video).mp4";
import interviewVideoTwo from "../assets/Chapter 1_Swenka/Video/The Swenkas (2004).mp4";
import editorial1 from "../assets/Chapter 1_Swenka/Images/Editorial/Portraits from apartheid-era South Africa - in pictures , Art and design , The Guardian.jpg";
import editorial4 from "../assets/Chapter 1_Swenka/Images/Editorial/Man with pinstripe jacket.jpg";
import editorial5 from "../assets/Chapter 1_Swenka/Images/Editorial/Inkabi nation.jpg";
import editorial6 from "../assets/Chapter 1_Swenka/Images/Editorial/South Africa 90's 80's aesthetic.jpg";
import xhosaMen from "../assets/Chapter 1_Swenka/Images/Editorial/Xhosa men.jpg";
import portraitImage from "../assets/Chapter 1_Swenka/Images/Editorial/Man with yellow and blue suit.jpg";
import chapterImage from "../assets/images/Chapter images/swenka chapter image.jpg";
import boysOfSowetoImage from "../assets/Chapter 1_Swenka/Images/Fashion Visuals/Boys of Soweto/@leddi_g wears our apple green double breasted subtle logo mania suit -- @_mosabrown wears our r.jpg";
import brokeImage from "../assets/Chapter 1_Swenka/Images/Fashion Visuals/Broke/Sonwabiso, Cape Town, 2025Today we are out in Braamfontein , 70 juta street , From 15h00 (SAST).jpg";
import backgroundTrack from "../assets/audio/New Music/Miriam Makeba - Khawuleza (Live 1966) _ Swenka.mp3";

function Swenka() {
  const { completeChapter } = useNavigation();

  return (
    <UnzipIntro image={chapterImage}>
    <ChapterPlayer
      id="swenka"
      chapter="01 / SWENKA"
      title="Precision. Discipline. Respect."
      subtitle="More than style. It’s about how you carry yourself."
      context="The first time I really paid attention to a Swenka man, I wasn’t looking at the suit. I was looking at how still he stood in it, like the clothes were the least important part of what he was showing me."
      interaction="drag"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="cut"
      track={backgroundTrack}
      frames={[
        { label: "Memory collage / Jama’s view", collage: [editorial1, editorial6], motion: "gallery", text: "I’d seen this kind of style before." },
        { label: "Interview 1 / Let them speak", video: interviewVideo, lockSeconds: 12, caption: "10 TO 15 SEC CLIP" },
        { label: "Detail shots", collage: [editorial5, editorial4, xhosaMen], motion: "gallery", text: "The suits, the detail… everything very put together." },
        { label: "Interview 2 / Let them speak", video: interviewVideoTwo, videoStart: 300, shoeShine: true, lockSeconds: 12, caption: "10 TO 15 SEC CLIP" },
        { label: "From pride in dress to pride in movement / Towards Pantsula", collage: [boysOfSowetoImage, brokeImage], textStyle: "float", text: "Watching them, I began to see more than polished shoes and careful suits. I saw pride, discipline and a need to be seen. In Pantsula, I would look for that same spirit channelled into something different: quick feet, rhythm and a style made together on the streets.", caption: "NEXT CHAPTER / PANTSULA" },
      ]}
      gamePage={(onComplete) => <WardrobeGame portraitImage={portraitImage} onComplete={onComplete} />}
      onComplete={() => completeChapter("swenka")}
    />
    </UnzipIntro>
  );
}

export default Swenka;
