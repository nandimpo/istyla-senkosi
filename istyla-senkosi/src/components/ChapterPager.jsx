import { useActiveSection } from "../context/ActiveSectionContext";
import { SECTIONS } from "../constants/sections";
import "../styles/ChapterPager.css";

function ChapterPager() {
  const activeId = useActiveSection();
  const index = SECTIONS.findIndex((section) => section.id === activeId);
  if (index === -1) return null;

  const prev = index > 0 ? SECTIONS[index - 1] : null;
  const isLast = index === SECTIONS.length - 1;
  const next = isLast ? SECTIONS[0] : SECTIONS[index + 1];
  const nextLabel = index === 0 ? "BEGIN JOURNEY" : isLast ? "START AGAIN" : "NEXT CHAPTER";

  return (
    <nav className="chapter-pager" aria-label="Chapter navigation">
      {prev && (
        <a className="pager-link prev" href={`#${prev.id}`} aria-label={`Previous chapter: ${prev.label}`}>
          <i aria-hidden="true" /><span>PREV</span><b>{prev.label}</b>
        </a>
      )}
      <a className="pager-link next" href={`#${next.id}`} aria-label={`${nextLabel}: ${next.label}`}>
        <span>{nextLabel}</span><b>{next.label}</b><i aria-hidden="true" />
      </a>
    </nav>
  );
}

export default ChapterPager;
