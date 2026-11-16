import { useNavigation } from "../context/NavigationContext";
import Hero from "../components/Hero";
import ChapterLoading from "../components/ChapterLoading";
import { lazy, Suspense, useEffect, useRef } from "react";
import { usePageReadiness } from "../hooks/usePageReadiness";
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
  const { currentSection, chapterVisit, goBackChapter, setPageReady } = useNavigation();
  const contentRef = useRef(null);
  usePageReadiness(contentRef, `${currentSection}:${chapterVisit}`, setPageReady);
  useEffect(() => {
    if (currentSection === "introduction") loadSwenka().catch(() => {});
  }, [currentSection]);

  const Chapter = CHAPTERS[currentSection];
  return <div ref={contentRef} onWheelCapture={(event) => {
    if (!event.target.closest(".chapter-player, dialog[open]")) reverseScroll(event, goBackChapter);
  }}>{Chapter ? <Suspense fallback={<ChapterLoading chapter={currentSection === "introduction" ? "Introduction" : currentSection.charAt(0).toUpperCase() + currentSection.slice(1)} />}><Chapter key={`${currentSection}:${chapterVisit}`} /></Suspense> : <Hero />}</div>;
}

export default Experience;
