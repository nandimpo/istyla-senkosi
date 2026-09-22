import { useNavigation } from "../context/NavigationContext";
import Hero from "../components/Hero";
import Introduction from "./Introduction";
import Swenka from "./Swenka";
import Pantsula from "./Pantsula";
import Skhothane from "./Skhothane";
import Reflection from "./Reflection";
import { reverseScroll } from "../utils/reverseScroll";

const CHAPTERS = {
  introduction: Introduction,
  swenka: Swenka,
  pantsula: Pantsula,
  skhothane: Skhothane,
  reflection: Reflection,
};

function Experience() {
  const { currentSection, chapterVisit, goBackChapter } = useNavigation();

  if (currentSection === "about") return <Hero />;
  const Chapter = CHAPTERS[currentSection];
  return Chapter ? <div onWheelCapture={(event) => {
    if (!event.target.closest(".chapter-player")) reverseScroll(event, goBackChapter);
  }}><Chapter key={`${currentSection}:${chapterVisit}`} /></div> : <Hero />;
}

export default Experience;
