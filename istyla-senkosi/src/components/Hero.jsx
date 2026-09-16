import { useNavigation } from "../context/NavigationContext";
import collage1 from "../assets/Introduction/Images/Bafana Bafana.jpg";
import collage2 from "../assets/Introduction/Images/Freestate fashion.jpg";
import collage3 from "../assets/Introduction/Images/Group image.jpg";
import collage4 from "../assets/Introduction/Images/Taxi fashion.jpg";
import collage5 from "../assets/Introduction/Images/Town fashion 2.jpg";
import collage6 from "../assets/Introduction/Images/Township Fashion.jpg";
import collage7 from "../assets/Introduction/Images/Township fashion 3.jpg";
import collage8 from "../assets/Introduction/Images/Zulu street fashion.jpg";
import "./../styles/Hero.css";

const collageImages = [collage1, collage2, collage3, collage4, collage5, collage6, collage7, collage8];

function Hero() {
  const { goTo } = useNavigation();

  return <main className="documentary" id="about">
    <div className="hero-collage" aria-hidden="true">
      {collageImages.slice(0, 4).map((src, index) => (
        <div className="hero-gallery-column" key={src}>
          <div className="hero-gallery-track">
            {[0, 1].map((copy) => (
              <div className="hero-gallery-group" key={copy}>
                <img src={src} alt="" decoding="async" />
                <img src={collageImages[index + 4]} alt="" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <header className="topbar">
      <div className="topbar-left" />
      <span>ISTYLA SENKOSI / 01</span>
    </header>
    <section className="hero-content">
      <p className="hero-subtitle">Interactive Documentary</p>
      <h1 className="hero-title">I&apos;STYLA<br />SENKOSI</h1>
      <p className="hero-description">Past, Present and Future of Township Fashion</p>
      <button className="hero-button" onClick={() => goTo("introduction")}>Begin Journey <span>→</span></button>
    </section>
  </main>;
}
export default Hero;
