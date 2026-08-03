import { useSetChapterReady } from "../context/ChapterReadyContext";
import houseImage from "../assets/Additional Images/Street Visuals/Wattville/House.jpg";
import "../styles/Reflection.css";

function Reflection() {
  useSetChapterReady(true);

  return (
    <main className="reflection-page content-fade-in">
      <header className="reflection-header"><span>04 / REFLECTION</span><span>WHERE TOWNSHIP FASHION GOES NEXT</span></header>
      <section className="reflection-stage">
        <div className="reflection-copy">
          <p className="chapter-tag">04 / REFLECTION</p>
          <h1>BACK TO WHERE<br />IT ALL BEGAN</h1>
          <i />
          <p>Same streets.<br />Different eyes.<br />Deeper understanding.</p>
        </div>
        <div className="reflection-image">
          <img src={houseImage} alt="A township home in Wattville, where the story began" />
        </div>
      </section>
    </main>
  );
}

export default Reflection;
