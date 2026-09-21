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
import backgroundTrack from "../assets/audio/New Music/Miriam Makeba - Khawuleza (Live 1966) _ Swenka.mp3";

const fashionImages = Object.entries(import.meta.glob("../assets/Chapter 1_Swenka/Images/Fashion Visuals/{Boys of Soweto,Broke}/*.{jpg,jpeg,png,webp}", { eager: true, query: "?url", import: "default" })).sort(([a], [b]) => a.localeCompare(b)).map(([, src]) => src);

function Swenka() {
  const { completeChapter } = useNavigation();

  return (
    <UnzipIntro image={chapterImage}>
    <ChapterPlayer
      id="swenka"
      chapter="01 / SWENKA"
      title="Precision. Discipline. Respect."
      subtitle="More than style. It’s about how you carry yourself."
      context="Watching a Swenka man, I notice how carefully he carries himself. I remember my cousin getting dressed. I used to notice only the finished outfit. Now I’m looking at the care behind it."
      interaction="drag"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="cut"
      track={backgroundTrack}
      frames={[
        { label: "Interview 1 / Let them speak", storyRole: "voices", video: interviewVideo, playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "Detail shots", storyRole: "observe", collage: [editorial5, editorial4, xhosaMen], motion: "gallery", text: "The suits, the detail… nothing feels accidental. I begin to notice the care behind each choice." },
        { label: "Interview 2 / Let them speak", storyRole: "voices", video: interviewVideoTwo, videoStart: 300, shoeShine: true, playSeconds: 20, skipAfter: 10, caption: "20 SECOND CLIP" },
        { label: "Memory collage / Jama’s view", storyRole: "memory", collage: [editorial1, editorial6], motion: "gallery", text: "That attention to an outfit feels familiar. I remember my cousin checking every detail before he stepped outside. I never asked him which details mattered most." },
        { label: "From pride in dress to pride in movement / Towards Pantsula", storyRole: "reflection", collage: fashionImages, kind: "fashion-wall", textStyle: "float", text: "Looking at these outfits, I keep thinking about my cousin. I cannot ask him now, so I listen to the people who carry these styles forward. As my journey turns towards Pantsula, I wonder what movement can tell me that clothes alone cannot.", caption: "UP NEXT: PANTSULA", nextChapter: "pantsula", nextChapterLabel: "Explore Pantsula next" },
      ]}
      gamePage={(onComplete) => <WardrobeGame portraitImage={portraitImage} onComplete={onComplete} />}
      onComplete={() => completeChapter("swenka")}
    />
    </UnzipIntro>
  );
}

export default Swenka;
