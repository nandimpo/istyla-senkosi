import Hero from "../components/Hero";
import { useSetChapterReady } from "../context/ChapterReadyContext";

function Landing() {
  useSetChapterReady(true);
  return (
    <>
      <Hero />
    </>
  );
}

export default Landing;
