import { useNavigation } from "../context/NavigationContext";
import Hero from "../components/Hero";
import ChapterLoading from "../components/ChapterLoading";
import { lazy, Suspense, useEffect } from "react";
import { loadSwenka } from "../utils/preloadSwenka";
import { reverseScroll } from "../utils/reverseScroll";

const CHAPTERS = {
  introduction: lazy(() => import("./Introduction")),
  swenka: lazy(loadSwenka),
  pantsula: lazy(() => import("./Pantsula")),
  skhothane: lazy(() => import("./Skhothane")),
  reflection: lazy(() => import("./Reflection")),
};

function Experience() {
  const { currentSection, chapterVisit, goBackChapter } = useNavigation();
  useEffect(() => {
    if (currentSection === "introduction") loadSwenka().catch(() => {});
  }, [currentSection]);

  if (currentSection === "about") return <Hero />;
  const Chapter = CHAPTERS[currentSection];
  return Chapter ? <div onWheelCapture={(event) => {
    if (!event.target.closest(".chapter-player, dialog[open]")) reverseScroll(event, goBackChapter);
  }}><Suspense fallback={<ChapterLoading chapter={currentSection === "introduction" ? "Introduction" : currentSection.charAt(0).toUpperCase() + currentSection.slice(1)} />}><Chapter key={`${currentSection}:${chapterVisit}`} /></Suspense></div> : <Hero />;
}

export default Experience;
