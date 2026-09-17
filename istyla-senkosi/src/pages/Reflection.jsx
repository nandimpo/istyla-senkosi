import { useNavigation } from "../context/NavigationContext";
import ChapterPlayer from "../components/ChapterPlayer";
import cousin1 from "../assets/images/Cousin/Cousin 1.jpeg";
import cousin2 from "../assets/images/Cousin/Cousin 2.jpeg";
import chapterImage from "../assets/images/Chapter images/reflection chapter intro.jpg";
import houseImage from "../assets/Additional Images/Street Visuals/Wattville/House.jpg";
import streetImage from "../assets/Additional Images/Street Visuals/Wattville/Street sign.jpg";
import buildingImage from "../assets/Additional Images/Street Visuals/Wattville/Building.jpg";
import backgroundTrack from "../assets/audio/New Music/Kwesta - Spirit (Official Music Video) ft Wale ft. Wale _Conclusion.mp3";
import "../styles/Reflection.css";

const cousinPhotos = [cousin1, cousin2];

function Reflection() {
  const { completeChapter, goTo } = useNavigation();

  const finalPage = (
    <section className="final-frame" aria-label="End of story">
      <p>It’s more than fashion.</p>
      <div className="final-frame__actions">
        <button onClick={() => goTo("about")}>REPLAY JOURNEY <span>↑</span></button>
        <button onClick={() => goTo("swenka")}>EXPLORE CHAPTERS <span>→</span></button>
        <button onClick={() => goTo("about")}>CREDITS <span>+</span></button>
      </div>
    </section>
  );

  return (
    <ChapterPlayer
      id="reflection"
      chapter="04 / REFLECTION"
      title="Memory. Identity. Future."
      subtitle="Where do I belong in all of this?"
      context="I set out from Johannesburg North with questions about my cousin’s style. Following this story through Soweto has changed the way I look. Now I want to take that curiosity home and finally listen to him."
      accent="beige"
      interaction="scroll"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="dissolve"
      track={backgroundTrack}
      outro="Back to where it all began…"
      finalPage={finalPage}
      frames={[
        { label: "Empty streets", image: streetImage, text: "I thought this story was far from my life. My cousin was a connection I had been overlooking.", kind: "quiet" },
        { label: "Time + realisation", image: buildingImage, text: "The more I paid attention, the more I questioned my own assumptions about him, about Soweto, and about belonging.", kind: "quiet" },
        { label: "History + identity", collage: cousinPhotos, text: "These are photographs of my cousin. I recognise the clothes. Now I want to know the memories and choices behind them." },
        { label: "Understanding", image: houseImage, text: "I’m still Jama, still learning. When I see my cousin, I know where I’ll begin: tell me what your style means to you.", kind: "quiet" },
      ]}
      onComplete={() => completeChapter("reflection")}
    />
  );
}

export default Reflection;
