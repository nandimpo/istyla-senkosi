import "../styles/VideoPlayButton.css";

export default function VideoPlayButton({ onClick, label = "Play video" }) {
  const move = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--play-x", `${(event.clientX - bounds.left - bounds.width / 2) * 0.12}px`);
    event.currentTarget.style.setProperty("--play-y", `${(event.clientY - bounds.top - bounds.height / 2) * 0.12}px`);
  };
  const reset = (event) => {
    event.currentTarget.style.setProperty("--play-x", "0px");
    event.currentTarget.style.setProperty("--play-y", "0px");
  };
  return <button className="video-play-button" type="button" aria-label={label} title={label}
    onPointerDown={(event) => event.stopPropagation()} onPointerMove={move} onPointerLeave={reset}
    onClick={(event) => { event.stopPropagation(); onClick(event); }}>
    <span className="video-play-button__mark">
      <svg viewBox="0 0 160 160" aria-hidden="true" focusable="false">
        <path className="video-play-button__ring" d="M80 8 C103 10 137 29 148 57 C158 81 139 118 119 137 C97 153 70 158 47 143 C21 130 6 106 9 78 C8 49 27 27 51 17 C61 12 72 8 80 8 Z" />
        <path className="video-play-button__triangle" d="M68 61 L98 80 L68 99 Z" />
      </svg>
    </span>
  </button>;
}
