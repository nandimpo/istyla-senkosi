import nextTrack from "../assets/audio/Music/Nongqongqo (To Those We Love).mp3";
import { useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import UnzipIntro from "../components/UnzipIntro";
import WardrobeGame from "../components/games/WardrobeGame";
import interviewVideo from "../assets/video-clips/swenka-voices.mp4";
import interviewVideoTwo from "../assets/video-clips/swenka-preparation.mp4";
import editorial1 from "../assets/Chapter 1_Swenka/Images/Editorial/Portraits from apartheid-era South Africa - in pictures , Art and design , The Guardian.jpg";
import editorial4 from "../assets/Chapter 1_Swenka/Images/Editorial/Man with pinstripe jacket.jpg";
import editorial5 from "../assets/Chapter 1_Swenka/Images/Editorial/Inkabi nation.jpg";
import editorial6 from "../assets/Chapter 1_Swenka/Images/Editorial/South Africa 90's 80's aesthetic.jpg";
import xhosaMen from "../assets/Chapter 1_Swenka/Images/Editorial/Xhosa men.jpg";
import portraitImage from "../assets/Chapter 1_Swenka/Images/Editorial/Man with yellow and blue suit.jpg";
import chapterImage from "../assets/images/Chapter images/swenka chapter image.jpg";
import backgroundTrack from "../assets/audio/New Music/Miriam Makeba - Khawuleza (Live 1966) _ Swenka.mp3";

const fashionImages = Object.entries(
  import.meta.glob(
    "../assets/Chapter 1_Swenka/Images/Fashion Visuals/{Boys of Soweto,Broke}/*.{jpg,jpeg,png,webp}",
    { eager: true, query: "?url", import: "default" },
  ),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

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
        interaction="drag"
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
            playSeconds: 20,
            skipAfter: 10,
            caption: "20 SECOND CLIP",
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
              "This desire look good despite hardship reminded me of my cousin.",
            videoBridge:
              "They may have looked glamourous, but there was more to it. They lived a hard life",
            shoeShine: true,
            playSeconds: 20,
            skipAfter: 10,
            caption: "20 SECOND CLIP",
          },
          {
            label: "WHAT FELT FAMILIAR",
            storyRole: "memory",
            collage: [editorial1, editorial6],
            motion: "gallery",
            text: "That attention to an outfit feels familiar. I remember my cousin checking every detail before he stepped outside. I never asked him which details mattered most.",
          },
          {
            label: "CARRYING IT FORWARD",
            storyRole: "reflection",
            collage: fashionImages,
            kind: "fashion-wall",
            textStyle: "float",
            text: "Looking at these outfits, I keep thinking about my cousin. I cannot ask him now, so I listen to the people who carry these styles forward. As my journey turns towards Pantsula, I wonder what movement can tell me that clothes alone cannot.",
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
