import { useEffect, useRef, useState } from "react";
import CollageMarks from "../CollageMarks";
import OutfitAmbience from "./OutfitAmbience";
import backpack from "../../assets/Chapter 3_Skothane/Images/Interaction/backpack.png";
import collagePhoto1 from "../../assets/Chapter 3_Skothane/Images/Photo Gallery/8.jpg";
import collagePhoto2 from "../../assets/Chapter 3_Skothane/Images/Photo Gallery/9.jpg";
import backpackIllustration from "../../assets/Chapter 3_Skothane/Images/Textures/Backpack_Illustration.jpg";
import jewelryIllustration from "../../assets/Chapter 3_Skothane/Images/Textures/Jewelry_illustration.jpg";
import loafersIllustration from "../../assets/Chapter 3_Skothane/Images/Textures/loafers_drawing.jpg";
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

export default function SkhothaneOutfit({ onBack, onComplete, audioRef }) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState({ shirt: null, jeans: null, shoes: null });
  const upwardScroll = useRef(0);
  const [revealing, setRevealing] = useState(false);
  const completeRef = useRef(onComplete);
  useEffect(() => { completeRef.current = onComplete; }, [onComplete]);
  useEffect(() => {
    if (!revealing) return;
    const timer = setTimeout(() => completeRef.current?.(), 4200);
    return () => clearTimeout(timer);
  }, [revealing]);
  const ready = groups.every(({ id }) => selected[id]);
  const stop = (event) => event.stopPropagation();
  const choose = (group, item) => setSelected((current) => ({ ...current, [group]: item }));
  const handleWheel = (event) => {
    event.stopPropagation();
    if (revealing || !opened || event.deltaY >= 0 || event.currentTarget.scrollTop > 1) {
      upwardScroll.current = 0;
      return;
    }
    upwardScroll.current += Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? event.currentTarget.clientHeight : 1);
    if (upwardScroll.current >= 70) {
      setOpened(false);
      upwardScroll.current = 0;
      event.currentTarget.scrollTop = 0;
    }
  };

  return <section className="skhothane-outfit" aria-labelledby="skhothane-outfit-title" onClick={stop} onPointerDown={stop} onKeyDown={stop} onWheel={handleWheel}>
    <OutfitAmbience audioRef={audioRef} />
    <div className="skhothane-outfit__illustrations" aria-hidden="true">
      <img className="outfit-illustration outfit-illustration--backpack" src={backpackIllustration} alt="" />
      <img className="outfit-illustration outfit-illustration--jewelry" src={jewelryIllustration} alt="" />
      <img className="outfit-illustration outfit-illustration--loafers" src={loafersIllustration} alt="" />
    </div>
    <header inert={revealing} className="skhothane-outfit__heading">
      <button type="button" className="skhothane-outfit__back" onClick={onBack}>← Back to the story</button>
      <small>03 / SKHOTHANE / MY COUSIN'S BACKPACK</small>
      <h2 id="skhothane-outfit-title">I found his backpack.</h2>
      <p>{opened ? "After looking through the photographs, I lay out his clothes. I choose a shirt, jeans and shoes, imagining the look he might have wanted to create. Tap a shirt, jeans and shoes, or drag each piece into its matching space. There is no correct outfit: notice what your choices suggest about identity, status or being noticed." : "I found my cousin's backpack with his things still inside. As I open it, I find his shirts, jeans and shoes. These were his choices, his colours. I want to look at them more carefully now."}</p>
    </header>

    <div inert={revealing} className={`skhothane-outfit__workspace ${opened ? "is-open" : ""}`}>
      <span className="skhothane-outfit__scribble" aria-hidden="true">his colours, his choices</span>
      {!opened && <div className="skhothane-outfit__collage" aria-hidden="true">
        <figure className="backpack-clipping backpack-clipping--green"><img src={collagePhoto1} alt="" /><figcaption>the way he carried himself</figcaption></figure>
        <figure className="backpack-clipping backpack-clipping--orange"><img src={collagePhoto2} alt="" /></figure>
        <img className="backpack-cutout backpack-cutout--shirt" src={shirt1} alt="" />
        <img className="backpack-cutout backpack-cutout--shoes" src={shoes1} alt="" />
        <span className="backpack-collage-note">little things<br />he left behind</span>
        <CollageMarks className="backpack-doodles" height={430} marks={[
          ["zigzag",330,15,60,38], ["zigzag",600,320,63,40],
          ["zigzag",725,120,25,26], ["star",294,273,48,46],
          ["yellowStar",868,326,41,41], ["circle",691,56,18,18],
          ["circle",715,83,10,10], ["blueStar",674,178,32,32], ["blueStar",375,330,30,30], ["swiggle",350,165,60,33],
        ]} />
      </div>}
      <button type="button" className="skhothane-outfit__bag" onClick={() => setOpened(true)} aria-expanded={opened} aria-label={opened ? "My cousin's backpack is open" : "Open my cousin's backpack to look through his clothes"}>
        <img src={backpack} alt="" />
        <span>{opened ? "his clothes, laid out" : "open his backpack"}</span>
      </button>

      {opened && <>
        <CollageMarks className="outfit-collage-marks" height={500} marks={[
          ["circle",173,50,24,24], ["circle",164,88,12,12],
          ["circle",179,109,18,18], ["zigzag",720,8,72,26],
          ["star",168,334,43,47], ["swiggle",182,165,25,40],
          ["zigzag",470,150,54,30], ["zigzag",716,355,14,24],
          ["swiggle",178,410,24,30], ["yellowStar",699,196,34,40],
          ["yellowStar",444,317,33,38], ["blueStar",190,250,28,30], ["blueStar",710,425,32,32],
        ]} />
        <div className="skhothane-outfit__choices" aria-label="Choose pieces from my cousin's clothes">
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
          <small>PIECING TOGETHER HIS STYLE</small>
          <div className="skhothane-outfit__look">
            {groups.map((group) => <div key={group.id} className={`skhothane-outfit__slot skhothane-outfit__slot--${group.id}`} onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); }} onDrop={(event) => { event.preventDefault(); event.stopPropagation(); const [id, name] = event.dataTransfer.getData("text/plain").split(":"); if (id === group.id) { const item = group.items.find((choice) => choice.name === name); if (item) choose(id, item); } }}>
              {selected[group.id] ? <img src={selected[group.id].image} alt={selected[group.id].name} /> : <span>CHOOSE {group.id.toUpperCase()}</span>}
            </div>)}
          </div>
          <p role="status">{ready ? "I have imagined a look, but I cannot decide its meaning for him. Now I want to hear from people who share his style." : `${groups.filter(({ id }) => selected[id]).length} of 3 pieces chosen. ${groups.filter(({ id }) => selected[id]).map(({ id }) => selected[id].name).join(", ") || "Start with a piece that catches your eye"}. You can change any choice before hearing their stories.`}</p>
          <button type="button" className="skhothane-outfit__watch" disabled={!ready || revealing} onClick={() => { if (ready) setRevealing(true); }}>Hear their stories →</button>
        </div>
      </>}
    </div>
    {revealing && <div className="outfit-reveal" role="status" aria-label="The chosen outfit comes together as a collage before their stories begin.">
      <div className="outfit-reveal__sheet">
        <span className="outfit-reveal__label">PIECES OF HIS WORLD</span>
        <div className="outfit-reveal__scrap outfit-reveal__scrap--green" aria-hidden="true" />
        <div className="outfit-reveal__scrap outfit-reveal__scrap--print" aria-hidden="true" />
        <img className="outfit-reveal__photo" src={collagePhoto1} alt="" />
        {groups.map(({ id }, index) => <img key={id} className={`outfit-reveal__piece outfit-reveal__piece--${id}`} src={selected[id].image} alt={selected[id].name} style={{ "--piece-delay": `${index * 350 + 250}ms` }} />)}
        <img className="outfit-reveal__bag" src={backpack} alt="" />
        <img className="outfit-reveal__jewelry" src={jewelryIllustration} alt="" />
        <CollageMarks className="outfit-reveal__marks" height={650} marks={[["blueStar",120,120,55,55],["circle",770,370,45,45],["yellowStar",170,480,40,40]]} />
        <p>his colours, his choices.<br />a little closer to understanding.</p>
      </div>
    </div>}
  </section>;
}
