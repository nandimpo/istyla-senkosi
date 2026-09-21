import { useEffect, useState } from "react";
import StitchedNarrative from "../StitchedNarrative";
import "../../styles/ChapterGames.css";

const elements = [
  { id: "HAT", zone: { left: 44, top: 6, width: 32, height: 20 }, thumb: { x: 58, y: 15 } },
  { id: "SLEEVE", zone: { left: 14, top: 36, width: 52, height: 32 }, thumb: { x: 38, y: 50 } },
  { id: "SHOES", zone: { left: 18, top: 76, width: 46, height: 22 }, thumb: { x: 40, y: 87 } },
];

function WardrobeGame({ portraitImage, onComplete }) {
  const [placed, setPlaced] = useState([]);
  const [dragged, setDragged] = useState(null);
  const ready = placed.length === elements.length;

  const placeElement = (id) => {
    if (!id || placed.includes(id)) return;
    setPlaced((current) => [...current, id]);
    setDragged(null);
  };

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [ready, onComplete]);

  return (
    <div className="game-stage game-stage--swenka">
      <div className="game-copy">
        <p className="tag">01 / SWENKA</p>
        <h1>Piece by piece,<br />it came together.</h1>
        <StitchedNarrative className="game-copy__narrative" text="I couldn't take in the whole outfit at once, not at first. So I broke it down the way I actually noticed it: the hat, the sleeve, the shoes, one detail at a time." placement="inline" />
        <strong>DRAG EACH DETAIL INTO PLACE, THE WAY I HAD TO</strong>
        <i />
      </div>
      <div className="fashion-portrait">
        <div className="portrait-frame">
          <img src={portraitImage} alt="A man in a yellow hat and dark suit, mid dance move" loading="lazy" decoding="async" />
          {elements.map(({ id, zone }) => {
            const isPlaced = placed.includes(id);
            return (
              <div
                key={id}
                className={`puzzle-zone ${isPlaced ? "revealed" : ""}`}
                style={{ left: `${zone.left}%`, top: `${zone.top}%`, width: `${zone.width}%`, height: `${zone.height}%` }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => placeElement(dragged)}
                onClick={() => dragged && placeElement(dragged)}
                role="button"
                tabIndex={isPlaced ? -1 : 0}
                aria-label={isPlaced ? `${id} revealed` : `Drop ${id} here`}
              >
                {!isPlaced && <span>{id}</span>}
              </div>
            );
          })}
        </div>
      </div>
      <aside className="wardrobe">
        <p>ELEMENTS</p>
        {elements.map(({ id, thumb }) => {
          const isPlaced = placed.includes(id);
          return (
            <button
              key={id}
              draggable={!isPlaced}
              disabled={isPlaced}
              onDragStart={() => setDragged(id)}
              onClick={() => setDragged(id)}
              className={`${dragged === id ? "selected" : ""} ${isPlaced ? "used" : ""}`}
            >
              <span className="item-preview" style={{ backgroundImage: `url(${portraitImage})`, backgroundPosition: `${thumb.x}% ${thumb.y}%` }} />
              <span>⠿</span>
              <b>{id}{isPlaced ? " ✓" : ""}</b>
            </button>
          );
        })}
      </aside>
    </div>
  );
}

export default WardrobeGame;
