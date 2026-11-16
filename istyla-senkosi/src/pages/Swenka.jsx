import nextTrack from "../assets/audio/Music/Nongqongqo (To Those We Love).mp3";
import { useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import UnzipIntro from "../components/UnzipIntro";
import WardrobeGame from "../components/games/WardrobeGame";
import interviewVideo from "../assets/edited-clips/swenka-intro.mp4";
import interviewVideoTwo from "../assets/edited-clips/swenka-interview.mp4";
import blackLabelBackground from "../assets/Chapter 3_Skothane/Images/Historical/Black label.jpg";
import reePhoto from "../assets/images/Cousin/Cousin 1.jpeg";
import editorial4 from "../assets/Chapter 1_Swenka/Images/Editorial/Man with pinstripe jacket.jpg";
import editorial5 from "../assets/Chapter 1_Swenka/Images/Editorial/Inkabi nation.jpg";
import xhosaMen from "../assets/Chapter 1_Swenka/Images/Editorial/Xhosa men.jpg";
import portraitImage from "../assets/Chapter 1_Swenka/Images/Editorial/Man with yellow and blue suit.jpg";
import chapterImage from "../assets/images/Chapter images/swenka chapter image.jpg";
import collageBackground from "../assets/Chapter 1_Swenka/Images/Historical Images/Collage background image.jpg";
import backgroundTrack from "../assets/audio/New Music/Miriam Makeba - Khawuleza (Live 1966) _ Swenka.mp3";

const fashionImages = Object.entries(
  import.meta.glob(
    "../assets/Chapter 1_Swenka/Images/Fashion Visuals/{Boys of Soweto,Broke}/*.{jpg,jpeg,png,webp}",
    { eager: true, query: "?url", import: "default" },
  ),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

const scrapbookDetails = import.meta.glob(
  "../assets/Chapter 1_Swenka/Images/Fashion Visuals/*.{jpg,png}",
  { eager: true, query: "?url", import: "default" },
);
const clipping = (name) => scrapbookDetails[`../assets/Chapter 1_Swenka/Images/Fashion Visuals/${name}`];
const scrapbookImages = [
  fashionImages[0], clipping("Article.png"), clipping("Dandy.jpg"),
  clipping("Suit Sketch _1.jpg"), fashionImages[16], clipping("Article 4.png"),
  fashionImages[20], clipping("Shoes.jpg"), clipping("Tie.jpg"),
  clipping("Info_1.jpg"),
  fashionImages[9], fashionImages[17], clipping("Article 2.png"),
  clipping("Article 3.png"), fashionImages[4], fashionImages[18],
];
const clippingKinds = ["portrait", "article", "detail", "detail", "photo", "article", "outfit", "detail", "detail", "article", "photo", "outfit", "article", "article", "photo", "outfit"];

function Swenka() {
  const { completeChapter } = useNavigation();
  const audioRef = useRef(null);

  return (
    <UnzipIntro
      image={chapterImage}
      track={backgroundTrack}
      nextTrack={nextTrack}
      audioRef={audioRef}
    >
      <ChapterPlayer
        id="swenka"
        chapter="01 / SWENKA"
        title="Precision. Discipline. Respect."
        subtitle="Looking back at the roots of township style."
        context="I keep coming back to Ree getting ready. I noticed the finished outfit, but rarely thought about the care behind it. To understand his Skhothane style, I need to begin further back, with Swenka, one of the roots of township fashion. I watch these men and wonder what I missed in my own cousin."
        interaction="scroll"
        exitTransition="fade"
        titleImage={chapterImage}
        titleTransition="cut"
        track={backgroundTrack}
        nextTrack={nextTrack}
        sharedAudioRef={audioRef}
        frames={[
          {
            label: "THE MEN SPEAK",
            storyRole: "voices",
            video: interviewVideo,
            videoOutro:
              "Listening to them, I think of the questions I never asked Ree. I cannot hear his answers now, but I can learn to notice the care in a hat, a sleeve, a pair of shoes.",
            videoBridge: "Before I can look at Ree's style differently, I need to look at what came before it. My search begins with Swenka, and the men who give these clothes meaning.",
            playToEnd: true,
            skipAfter: 10,
            caption: "WATCH THE FULL VIDEO",
          },
          {
            label: "THE WEIGHT OF DETAIL",
            storyRole: "observe",
            collage: [editorial5, editorial4, xhosaMen],
            motion: "gallery",
            text: "I used to look at Ree's outfit and make up my mind. Here, I find myself slowing down: a neat cuff, a polished shoe, the way a man stands. Swenka brings me back to the care at the roots of township style. I wish I had noticed that care in Ree sooner.",
          },
          {
            label: "PREPARATION, IN THEIR WORDS",
            storyRole: "voices",
            video: interviewVideoTwo,
            videoOutro:
              "Their pride in getting dressed stays with me. Ree's clothes looked different, but I remember the time he took over them. Perhaps that was where I should have begun: with his care, before my judgement.",
            videoBridge:
              "As I polish the shoes, I think of Ree checking his outfit before leaving. I never asked why those details mattered. I listen to these men, hoping to understand the tradition of care that came before his style.",
            shoeShine: true,
            playToEnd: true,
            skipAfter: 38,
            caption: "WATCH THE FULL EXPLAINER",
          },
          {
            label: "WHAT I KEEP",
            storyRole: "reflection",
            collage: scrapbookImages,
            clippingKinds,
            scrapbookChapter: "01 / SWENKA",
            collageLabel: "My Swenka scrapbook: past and present",
            kind: "fashion-wall",
            backgroundImage: collageBackground,
            textStyle: "float",
            text: "I began with Ree's clothes. Swenka takes me further back, to the pride and care behind township style. These suits are not his outfits, yet they make me look at his choices with more respect. I turn back to his photograph, noticing more than I did before.",
          },
          {
            label: "WHAT FELT FAMILIAR",
            storyRole: "memory",
            image: reePhoto,
            backgroundImage: blackLabelBackground,
            kind: "memory-photo", layout: "quiet",
            alt: "The same old photograph of Ree, recalled after Swenka",
            text: "I look at Ree again. The photograph is familiar; the questions are changing. What did he notice as he got ready? What did I miss? Swenka has helped me look at the care behind his style. Next, I turn to Pantsula, to follow the clothes into movement.",
            caption: "UP NEXT: PANTSULA",
            nextChapter: "pantsula",
            nextChapterLabel: "Explore Pantsula next",
          },
        ]}
        gamePosition="afterFirstFrame"
      gamePage={(onComplete) => (
          <WardrobeGame portraitImage={portraitImage} onComplete={onComplete} />
        )}
        onComplete={() => completeChapter("swenka")}
      />
    </UnzipIntro>
  );
}

export default Swenka;
