import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useChapterReady } from "../context/ChapterReadyContext";
import "../styles/ChapterPager.css";

const chapterOrder = ["/", "/introduction", "/swenka", "/pantsula", "/skhothane", "/reflection"];
const labels = {
  "/": "HOME",
  "/introduction": "INTRODUCTION",
  "/swenka": "SWENKA",
  "/pantsula": "PANTSULA",
  "/skhothane": "SKHOTHANE",
  "/reflection": "REFLECTION",
};

function ChapterPager() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const ready = useChapterReady();
  const touchStartY = useRef(0);

  const index = chapterOrder.indexOf(pathname);
  const prevPath = index > 0 ? chapterOrder[index - 1] : null;
  const isLast = index === chapterOrder.length - 1;
  const nextPath = index === -1 ? null : isLast ? "/" : chapterOrder[index + 1];
  const nextLabel = pathname === "/" ? "BEGIN JOURNEY" : isLast ? "START AGAIN" : "NEXT CHAPTER";

  useEffect(() => {
    if (!nextPath) return undefined;
    let navigating = false;
    const go = (to) => {
      if (navigating) return;
      navigating = true;
      navigate(to);
    };
    const handleWheel = (event) => {
      if (event.deltaY > 25 && ready) go(nextPath);
      else if (event.deltaY < -25 && prevPath) go(prevPath);
    };
    const handleTouchStart = (event) => { touchStartY.current = event.touches[0].clientY; };
    const handleTouchEnd = (event) => {
      const delta = touchStartY.current - event.changedTouches[0].clientY;
      if (delta > 40 && ready) go(nextPath);
      else if (delta < -40 && prevPath) go(prevPath);
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [nextPath, prevPath, ready, navigate]);

  if (!nextPath) return null;

  return (
    <nav className="chapter-pager" aria-label="Chapter navigation">
      {prevPath && (
        <Link className="pager-link prev" to={prevPath} aria-label={`Previous chapter: ${labels[prevPath]}`}>
          <i aria-hidden="true" /><span>PREV</span><b>{labels[prevPath]}</b>
        </Link>
      )}
      <Link
        className={`pager-link next ${ready ? "ready" : ""}`}
        to={nextPath}
        aria-label={`${nextLabel}: ${labels[nextPath]}${ready ? ". Scroll down to continue." : ""}`}
      >
        <span>{nextLabel}</span><b>{labels[nextPath]}</b><i aria-hidden="true" />
      </Link>
    </nav>
  );
}

export default ChapterPager;
