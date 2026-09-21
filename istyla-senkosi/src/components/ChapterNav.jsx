import { useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import "../styles/ChapterNav.css";

const chapters = [
  ["00", "INTRODUCTION", "Jama’s journey from Johannesburg North to Soweto", "introduction"],
  ["01", "SWENKA", "Elegant competition and township style", "swenka"],
  ["02", "PANTSULA", "Movement, music and street expression", "pantsula"],
  ["03", "SKHOTHANE", "Luxury, confidence and performance", "skhothane"],
  ["04", "REFLECTION", "Where township fashion goes next", "reflection"],
];

function ChapterNav() {
  const [open, setOpen] = useState(false);
  const { goTo, isUnlocked } = useNavigation();
  const go = (id) => () => {
    setOpen(false);
    goTo(id, { intro: true });
  };
  return <>
    <button className="chapters-trigger" onClick={() => setOpen(true)}>CHAPTERS <span>+</span></button>
    {open && <div className="chapters-shade" onClick={() => setOpen(false)} />}
    <aside className={`chapters-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <button className="chapters-close" onClick={() => setOpen(false)} aria-label="Close chapters">×</button>
      <p>THE STORY OF TOWNSHIP FASHION</p><h2>CHAPTERS</h2>
      <nav>{chapters.map(([number, title, description, id]) => <button className="chapter-link" disabled={!isUnlocked(id)} onClick={go(id)} key={title}><em>{number}</em><span><b>{title}</b><small>{description}</small></span><i>→</i></button>)}</nav>
    </aside>
  </>;
}
export default ChapterNav;
