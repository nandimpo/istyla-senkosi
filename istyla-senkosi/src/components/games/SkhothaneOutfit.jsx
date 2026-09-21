import { useState } from "react";
import backpack from "../../assets/Chapter 3_Skothane/Images/Interaction/backpack.png";
import shirt1 from "../../assets/Chapter 3_Skothane/Images/Interaction/Shirt 1.png";
import shirt2 from "../../assets/Chapter 3_Skothane/Images/Interaction/Shirt 2.png";
import shirt3 from "../../assets/Chapter 3_Skothane/Images/Interaction/shirt 3.png";
import jeans1 from "../../assets/Chapter 3_Skothane/Images/Interaction/skinny jean.png";
import jeans2 from "../../assets/Chapter 3_Skothane/Images/Interaction/Jean 2.png";
import jeans3 from "../../assets/Chapter 3_Skothane/Images/Interaction/Jean 3.png";
import shoes1 from "../../assets/Chapter 3_Skothane/Images/Interaction/Carvela.png";
import shoes2 from "../../assets/Chapter 3_Skothane/Images/Interaction/Shoes 2.png";
import shoes3 from "../../assets/Chapter 3_Skothane/Images/Interaction/Shoes 3.png";
import "../../styles/SkhothaneOutfit.css";

const groups = [
  { id: "shirt", title: "01 / SHIRT", items: [{ name: "Patterned shirt", image: shirt1 }, { name: "Blue statement shirt", image: shirt2 }, { name: "Pink print shirt", image: shirt3 }] },
  { id: "jeans", title: "02 / JEANS", items: [{ name: "Skinny jeans", image: jeans1 }, { name: "Yellow jeans", image: jeans2 }, { name: "Purple jeans", image: jeans3 }] },
  { id: "shoes", title: "03 / SHOES", items: [{ name: "Carvela shoes", image: shoes1 }, { name: "Blue shoes", image: shoes2 }, { name: "Loafers", image: shoes3 }] },
];

export default function SkhothaneOutfit({ onBack, onComplete }) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState({ shirt: null, jeans: null, shoes: null });
  const ready = groups.every(({ id }) => selected[id]);
  const stop = (event) => event.stopPropagation();
  const choose = (group, item) => setSelected((current) => ({ ...current, [group]: item }));

  return <section className="skhothane-outfit" aria-labelledby="skhothane-outfit-title" onClick={stop} onPointerDown={stop} onKeyDown={stop} onWheel={stop}>
    <header className="skhothane-outfit__heading">
      <button type="button" className="skhothane-outfit__back" onClick={onBack}>← Back to the story</button>
      <small>03 / SKHOTHANE / MAKE IT YOURS</small>
      <h2 id="skhothane-outfit-title">A signature look starts here.</h2>
      <p>Jama opens the backpack and lays out the pieces. Choose a shirt, jeans and shoes to build a look of your own before hearing their stories.</p>
    </header>

    <div className={`skhothane-outfit__workspace ${opened ? "is-open" : ""}`}>
      <button type="button" className="skhothane-outfit__bag" onClick={() => setOpened(true)} aria-expanded={opened} aria-label={opened ? "Backpack open" : "Open the backpack to reveal the clothes"}>
        <img src={backpack} alt="" />
        <span>{opened ? "THE BACKPACK IS OPEN" : "OPEN THE BACKPACK"}</span>
      </button>

      {opened && <>
        <div className="skhothane-outfit__choices" aria-label="Choose outfit pieces">
          {groups.map((group) => <fieldset key={group.id}>
            <legend>{group.title}</legend>
            <div className="skhothane-outfit__options">
              {group.items.map((item) => <button type="button" key={item.name} className={selected[group.id]?.name === item.name ? "is-selected" : ""} aria-pressed={selected[group.id]?.name === item.name} onClick={() => choose(group.id, item)} draggable onDragStart={(event) => { event.stopPropagation(); event.dataTransfer.setData("text/plain", `${group.id}:${item.name}`); }}>
                <img src={item.image} alt="" /><span>{item.name}</span>
              </button>)}
            </div>
          </fieldset>)}
        </div>

        <div className="skhothane-outfit__result">
          <small>YOUR SIGNATURE OUTFIT</small>
          <div className="skhothane-outfit__look">
            {groups.map((group) => <div key={group.id} className={`skhothane-outfit__slot skhothane-outfit__slot--${group.id}`} onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); }} onDrop={(event) => { event.preventDefault(); event.stopPropagation(); const [id, name] = event.dataTransfer.getData("text/plain").split(":"); if (id === group.id) { const item = group.items.find((choice) => choice.name === name); if (item) choose(id, item); } }}>
              {selected[group.id] ? <img src={selected[group.id].image} alt={selected[group.id].name} /> : <span>CHOOSE {group.id.toUpperCase()}</span>}
            </div>)}
          </div>
          <p role="status">{ready ? "Your look is ready. Now hear the people behind the style." : `${groups.filter(({ id }) => selected[id]).length} of 3 pieces chosen`}</p>
          <button type="button" className="skhothane-outfit__watch" disabled={!ready} onClick={onComplete}>Step into their world →</button>
        </div>
      </>}
    </div>
  </section>;
}
