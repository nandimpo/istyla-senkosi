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
      context="I started this thinking I’d be documenting other people’s style. I didn’t expect to end up asking what all of it says about where I come from, and where that leaves me now."
      accent="beige"
      interaction="scroll"
      exitTransition="fade"
      titleImage={chapterImage}
      titleTransition="dissolve"
      track={backgroundTrack}
      outro="Back to where it all began…"
      finalPage={finalPage}
      frames={[
        { label: "Empty streets", image: streetImage, text: "I came into this thinking I was far from it.", kind: "quiet" },
        { label: "Time + realisation", image: buildingImage, text: "But the more time I spent here… the more I realised I wasn’t as disconnected as I thought.", kind: "quiet" },
        { label: "History + identity", collage: cousinPhotos, text: "There’s history in it. There’s identity in it." },
        { label: "Understanding", image: houseImage, text: "And now… I understand it a little more than I did before.", kind: "quiet" },
      ]}
      onComplete={() => completeChapter("reflection")}
    />
  );
}

export default Reflection;
