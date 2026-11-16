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
        subtitle="More than style. It’s about how you carry yourself."
        context="To understand Ree and his Skhothane fashion, I’m looking back at township style. Swenka is where I begin. Watching these men dress with care and carry themselves with pride, I remember my cousin getting ready. I used to see only his finished outfit. Now I’m beginning to ask what dressing up meant to him."
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
              "Hearing them speak made me notice the care in getting dressed. I want to look at the hat, the sleeve and the shoes, one detail at a time.",
            videoBridge: "To understand Swenka, I had to hear it from them.",
            playToEnd: true,
            skipAfter: 10,
            caption: "WATCH THE FULL VIDEO",
          },
          {
            label: "THE WEIGHT OF DETAIL",
            storyRole: "observe",
            collage: [editorial5, editorial4, xhosaMen],
            motion: "gallery",
            text: "The suits, the detail... nothing feels accidental. I begin to see dressing with care as an expression of pride and self-respect. I admire the dignity in how these men present themselves.",
          },
          {
            label: "PREPARATION, IN THEIR WORDS",
            storyRole: "voices",
            video: interviewVideoTwo,
            videoOutro:
              "This desire to look good despite hardship reminded me of my cousin.",
            videoBridge:
              "After looking at the details myself, I wanted to hear what that preparation meant to them.",
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
            text: "Swenka has taught me to look at the care behind an outfit. A suit, a hat, a polished shoe can carry pride and dignity. I think of Ree taking time to get ready, and feel a new respect for those choices. Before moving on, I return to the photograph that brought me here.",
          },
          {
            label: "WHAT FELT FAMILIAR",
            storyRole: "memory",
            image: reePhoto,
            backgroundImage: blackLabelBackground,
            kind: "memory-photo", layout: "quiet",
            alt: "The same old photograph of Ree, recalled after Swenka",
            text: "I return to the same photograph of Ree. After watching the care these men take, I find myself looking more closely at his choices. I remember him checking every detail before he stepped outside. I never asked which details mattered most to him. Swenka gives me a new way to look; it cannot answer for him. I carry that attention into Pantsula, where I want to explore how clothes move with music and people.",
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
