import { useNavigation } from "../context/NavigationContext";
import Hero from "../components/Hero";
import ChapterLoading from "../components/ChapterLoading";
import { lazy, Suspense } from "react";
import { reverseScroll } from "../utils/reverseScroll";

const CHAPTERS = {
  introduction: lazy(() => import("./Introduction")),
  swenka: lazy(() => import("./Swenka")),
  pantsula: lazy(() => import("./Pantsula")),
  skhothane: lazy(() => import("./Skhothane")),
  reflection: lazy(() => import("./Reflection")),
};

function Experience() {
  const { currentSection, chapterVisit, goBackChapter } = useNavigation();

  if (currentSection === "about") return <Hero />;
  const Chapter = CHAPTERS[currentSection];
  return Chapter ? <div onWheelCapture={(event) => {
    if (!event.target.closest(".chapter-player, dialog[open]")) reverseScroll(event, goBackChapter);
  }}><Suspense fallback={<ChapterLoading chapter={currentSection === "introduction" ? "Introduction" : currentSection.charAt(0).toUpperCase() + currentSection.slice(1)} />}><Chapter key={`${currentSection}:${chapterVisit}`} /></Suspense></div> : <Hero />;
}

export default Experience;
