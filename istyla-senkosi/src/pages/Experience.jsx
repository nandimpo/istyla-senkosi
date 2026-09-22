import { useNavigation } from "../context/NavigationContext";
import Hero from "../components/Hero";
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
    if (!event.target.closest(".chapter-player")) reverseScroll(event, goBackChapter);
  }}><Suspense fallback={<div role="status" style={{ minHeight:"100svh", display:"grid", placeItems:"center", background:"#171714", color:"#f5eddf" }}>Opening the chapter…</div>}><Chapter key={`${currentSection}:${chapterVisit}`} /></Suspense></div> : <Hero />;
}

export default Experience;
