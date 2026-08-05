import { useState } from "react";
import { scrollToChapter } from "../utils/scrollToChapter";
import "../styles/ChapterNav.css";

const chapters = [
  ["01", "SWENKA", "Elegant competition and township style", "swenka"],
  ["02", "PANTSULA", "Movement, music and street expression", "pantsula"],
  ["03", "SKHOTHANE", "Luxury, confidence and performance", "skhothane"],
  ["04", "REFLECTION", "Where township fashion goes next", "reflection"],
];

function ChapterNav() {
  const [open, setOpen] = useState(false);
  const go = (id) => (event) => {
    event.preventDefault();
    setOpen(false);
    scrollToChapter(id);
  };
  return <>
    <button className="chapters-trigger" onClick={() => setOpen(true)}>CHAPTERS <span>+</span></button>
    {open && <div className="chapters-shade" onClick={() => setOpen(false)} />}
    <aside className={`chapters-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <button className="chapters-close" onClick={() => setOpen(false)} aria-label="Close chapters">×</button>
      <p>THE STORY OF TOWNSHIP FASHION</p><h2>CHAPTERS</h2>
      <nav>{chapters.map(([number, title, description, id]) => <a href={`#${id}`} onClick={go(id)} key={title}><em>{number}</em><span><b>{title}</b><small>{description}</small></span><i>→</i></a>)}</nav>
    </aside>
  </>;
}
export default ChapterNav;
