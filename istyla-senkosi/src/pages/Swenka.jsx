import nextTrack from "../assets/audio/Music/Nongqongqo (To Those We Love).mp3";
import { useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import UnzipIntro from "../components/UnzipIntro";
import WardrobeGame from "../components/games/WardrobeGame";
import interviewVideo from "../assets/Chapter 1_Swenka/Video/Swenka_Intro_Video.mp4";
import interviewVideoTwo from "../assets/Chapter 1_Swenka/Video/Swenka_Explainer.mp4";
import editorial1 from "../assets/Chapter 1_Swenka/Images/Editorial/Portraits from apartheid-era South Africa - in pictures , Art and design , The Guardian.jpg";
import editorial4 from "../assets/Chapter 1_Swenka/Images/Editorial/Man with pinstripe jacket.jpg";
import editorial5 from "../assets/Chapter 1_Swenka/Images/Editorial/Inkabi nation.jpg";
import editorial6 from "../assets/Chapter 1_Swenka/Images/Editorial/South Africa 90's 80's aesthetic.jpg";
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
              "After hearing them speak, I had to look back at their outfits.",
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
            text: "The suits, the detail… nothing feels accidental. I begin to notice the care behind each choice.",
          },
          {
            label: "PREPARATION, IN THEIR WORDS",
            storyRole: "voices",
            video: interviewVideoTwo,
            videoOutro:
              "This desire to look good despite hardship reminded me of my cousin.",
            videoBridge:
              "They may have looked glamourous, but there was more to it. They lived a hard life",
            shoeShine: true,
            playToEnd: true,
            skipAfter: 38,
            caption: "WATCH THE FULL EXPLAINER",
          },
          {
            label: "WHAT FELT FAMILIAR",
            storyRole: "memory",
            collage: [editorial1, editorial6],
            motion: "gallery",
            text: "That attention to an outfit feels familiar. I remember my cousin checking every detail before he stepped outside. I never asked him which details mattered most.",
          },
          {
            label: "WHAT I KEEP",
            storyRole: "reflection",
            collage: scrapbookImages,
            clippingKinds,
            scrapbookChapter: "01 / SWENKA",
            collageLabel: "Jama’s Swenka scrapbook: past and present",
            kind: "fashion-wall",
            backgroundImage: collageBackground,
            textStyle: "float",
            text: "After going back to Swenka, I notice its echoes in the styles around me today. The suits, the hats, the care in each detail. I see my cousin in them, too. These are the fragments I keep: a way to keep looking, and keep him close.",
            caption: "UP NEXT: PANTSULA",
            nextChapter: "pantsula",
            nextChapterLabel: "Explore Pantsula next",
          },
        ]}
        gamePage={(onComplete) => (
          <WardrobeGame portraitImage={portraitImage} onComplete={onComplete} />
        )}
        onComplete={() => completeChapter("swenka")}
      />
    </UnzipIntro>
  );
}

export default Swenka;
