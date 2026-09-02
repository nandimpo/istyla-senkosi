import { useNavigation } from "../context/NavigationContext";
import Hero from "../components/Hero";
import Introduction from "./Introduction";
import Swenka from "./Swenka";
import Pantsula from "./Pantsula";
import Skhothane from "./Skhothane";
import Reflection from "./Reflection";

const CHAPTERS = {
  introduction: Introduction,
  swenka: Swenka,
  pantsula: Pantsula,
  skhothane: Skhothane,
  reflection: Reflection,
};

function Experience() {
  const { currentSection } = useNavigation();

  if (currentSection === "about") return <Hero />;
  const Chapter = CHAPTERS[currentSection];
  return Chapter ? <Chapter /> : <Hero />;
}

export default Experience;
