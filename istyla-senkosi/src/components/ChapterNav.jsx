import { useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import "../styles/ChapterNav.css";
import { chapterPages } from "../data/chapterPages";

const chapters = [
  ["00", "INTRODUCTION", "My journey from Johannesburg North to Soweto", "introduction"],
  ["01", "SWENKA", "Elegant competition and township style", "swenka"],
  ["02", "PANTSULA", "Movement, music and street expression", "pantsula"],
  ["03", "SKHOTHANE", "Luxury, confidence and performance", "skhothane"],
  ["04", "REFLECTION", "Where township fashion goes next", "reflection"],
];

function ChapterNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const { goTo, isUnlocked, guideComplete, pageReady } = useNavigation();
  const go = (id, page = 0, intro = false) => () => {
    setOpen(false);
    goTo(id, { page, intro });
  };
  return <>
    <button className="chapters-trigger" disabled={!guideComplete || !pageReady} title={!guideComplete ? "Read the guide and step into the story to open chapters" : undefined} onClick={() => setOpen(true)}>CHAPTERS <span>+</span></button>
    {open && <div className="chapters-shade" onClick={() => setOpen(false)} />}
    <aside className={`chapters-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <button className="chapters-close" onClick={() => setOpen(false)} aria-label="Close chapters">×</button>
      <p>THE STORY OF TOWNSHIP FASHION</p><h2>CHAPTERS</h2>
      <nav aria-label="Chapters and story pages">{chapters.map(([number, title, description, id]) => <div className="chapter-group" key={id}>
        <button className="chapter-link" disabled={!isUnlocked(id)} aria-expanded={expanded === id} aria-controls={`chapter-pages-${id}`} onClick={() => setExpanded((current) => current === id ? null : id)}><em>{number}</em><span><b>{title}</b><small>{description}</small></span><i aria-hidden="true">{expanded === id ? "−" : "+"}</i></button>
        {expanded === id && <div className="chapter-pages" id={`chapter-pages-${id}`}>
          <button className="chapter-pages__start" onClick={go(id, 0, true)}>Start this chapter <span aria-hidden="true">→</span></button>
          {chapterPages[id].map((label, page) => <button onClick={go(id, page)} key={label}><span className="chapter-pages__number">{String(page + 1).padStart(2, "0")}</span><span>{label}</span></button>)}
        </div>}
      </div>)}</nav>
    </aside>
  </>;
}
export default ChapterNav;
