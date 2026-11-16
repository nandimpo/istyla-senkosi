import "../styles/ChapterLoading.css";

const MESSAGES = {
  Introduction: "Getting your journey ready…",
  Swenka: "Taking you to Swenka…",
  Pantsula: "Finding the rhythm. Your Pantsula experience is on its way…",
  Skhothane: "Turning up the colour. Your Skhothane experience is on its way…",
  Reflection: "Gathering the memories. A moment to reflect is on its way…",
};

export default function ChapterLoading({ chapter = "" }) {
  return <div className="chapter-loading" role="status" aria-live="polite">
    <p>{MESSAGES[chapter] || "Getting your experience ready…"}</p>
  </div>;
}
