import { useRef, useState } from "react";
import converseImage from "../../assets/Additional Images/Shoes/Converse.jpg";
import backImage from "../../assets/Chapter 2_Pantsula/Images/Textures/Shoes/Shoes_360/Back.jpg";
import sideOneImage from "../../assets/Chapter 2_Pantsula/Images/Textures/Shoes/Shoes_360/Side 1.jpg";
import sideTwoImage from "../../assets/Chapter 2_Pantsula/Images/Textures/Shoes/Shoes_360/Side 2.jpg";
import starTexture from "../../assets/Chapter 2_Pantsula/Images/Textures/Shoes/Star_Texture.png";
import checkTexture from "../../assets/Chapter 2_Pantsula/Images/Textures/Shoes/Check_texture.jpg";
import spotsTexture from "../../assets/Chapter 2_Pantsula/Images/Textures/Shoes/Spots.jpg";
import bowsTexture from "../../assets/Chapter 2_Pantsula/Images/Textures/Shoes/Bows.jpg";
import converseBackground from "../../assets/Chapter 2_Pantsula/Images/Textures/Background/Converse background.jpg";
import "../../styles/ConverseLacing.css";

const types = ["Star", "Checks", "Spots", "Bows"];
const patchTextures = { Star: starTexture, Checks: checkTexture, Spots: spotsTexture, Bows: bowsTexture };
const shoeViews = [
  { name:"Front", image:converseImage, point:{ x:145, y:400 } },
  { name:"Outer side", image:sideOneImage, point:{ x:330, y:350 }, outline:[[24,385],[90,350],[225,323],[352,200],[390,240],[442,222],[450,394],[430,445],[65,445]] },
  { name:"Back", image:backImage, point:{ x:160, y:350 }, outline:[[88,435],[113,218],[145,180],[203,183],[226,240],[239,435]], secondOutline:[[262,435],[279,212],[316,179],[371,182],[397,223],[412,435]] },
  { name:"Inner side", image:sideTwoImage, point:{ x:190, y:330 }, outline:[[57,397],[75,192],[143,212],[180,148],[212,198],[302,290],[370,319],[459,334],[474,370],[455,410],[100,419]] },
];
function insideOutline({ x,y }, outline) {
  let inside = false;
  for (let i=0,j=outline.length-1;i<outline.length;j=i++) {
    const [xi,yi] = outline[i]; const [xj,yj] = outline[j];
    if ((yi>y)!==(yj>y) && x<(xj-xi)*(y-yi)/(yj-yi)+xi) inside=!inside;
  }
  return inside;
}
function Decoration({ type, text }) {
  if (type === "Initials") return <text textAnchor="middle" dominantBaseline="central" fill="#f4d598" stroke="#18291f" strokeWidth="1" paintOrder="stroke" fontSize="25" fontWeight="800" fontFamily="Arial,sans-serif">{text}</text>;
  const size = type === "Bows" ? 70 : 44;
  return <image href={patchTextures[type]} x={-size / 2} y={-size / 2} width={size} height={size} preserveAspectRatio="xMidYMid slice"/>;
}
export default function ConverseLacing({ onComplete, onBack }) {
  const [initials, setInitials] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tool, setTool] = useState(null);
  const [preview, setPreview] = useState(null);
  const [angle, setAngle] = useState(0);
  const viewIndex = Math.round(angle / 90) % shoeViews.length;
  const view = shoeViews[viewIndex];
  const turnTo = (degrees) => {
    setAngle(degrees); setSelected(null); setPreview(null); drag.current = null;
  };
  const [zoom, setZoom] = useState(false);
  const [original, setOriginal] = useState(false);
  const [notice, setNotice] = useState("Choose a patch, then drag it onto either shoe.");
  const svgRef = useRef(null);
  const drag = useRef(null);
  const serial = useRef(0);
  const suppressClick = useRef(false);
  const ready = items.some((item) => item.type !== "Initials");
  const active = items.find((item) => item.id === selected);
  const stop = (event) => event.stopPropagation();
  const point = (event) => new DOMPoint(event.clientX, event.clientY).matrixTransform(svgRef.current.getScreenCTM().inverse());
  const onShoe = ({ x, y }) => {
    if (view.outline) return insideOutline({ x,y },view.outline) || Boolean(view.secondOutline && insideOutline({ x,y },view.secondOutline));
    // Broad silhouettes cover canvas, laces and toe caps but exclude the backdrop.
    const left = ((x - 146) / (y > 300 ? 110 : 83)) ** 2 + ((y - 267) / 230) ** 2;
    const right = ((x - 360) / (y > 300 ? 115 : 85)) ** 2 + ((y - 278) / 220) ** 2;
    return left <= 1 || right <= 1;
  };
  const place = (template, position) => {
    if (!onShoe(position)) { setNotice("Drop the decoration on either shoe."); return; }
    const item = { ...template, view:viewIndex, x:position.x, y:position.y, id:++serial.current, size:1, rotation:0 };
    setItems((previous) => [...previous, item]);
    setSelected(item.id); setTool(null); setOriginal(false);
    setNotice("Decoration added. Drag it to reposition, or use the adjustment controls.");
  };
  const updateItem = (id, change) => setItems((previous) => previous.map((item) => item.id === id ? { ...item, ...change } : item));
  const removeItem = (id) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
    if (selected === id) setSelected(null);
    setNotice("Decoration removed.");
  };
  const beginDrag = (event, template, item = null) => {
    if (event.button !== 0) return;
    event.preventDefault(); event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const start = point(event);
    drag.current = { template, item, start, moved:false, offset:item ? { x:start.x - item.x, y:start.y - item.y } : { x:0, y:0 } };
    if (item) setSelected(item.id);
    else setTool(template);
  };
  const moveDrag = (event) => {
    const current = drag.current;
    if (!current) return;
    const position = point(event);
    if (Math.hypot(position.x - current.start.x, position.y - current.start.y) > 4) current.moved = true;
    if (!current.item) setPreview(onShoe(position) ? { ...current.template, ...position } : null);
    if (current.item) {
      const next = { x:position.x - current.offset.x, y:position.y - current.offset.y };
      if (onShoe(next)) updateItem(current.item.id, next);
    }
  };
  const endDrag = (event) => {
    const current = drag.current;
    if (!current) return;
    drag.current = null;
    setPreview(null);
    suppressClick.current = current.moved;
    if (!current.item && current.moved) place(current.template, point(event));
  };
  const dragHandlers = { onPointerMove:moveDrag, onPointerUp:endDrag, onPointerCancel:() => { drag.current = null; setPreview(null); }, onLostPointerCapture:() => { drag.current = null; setPreview(null); } };
  const patchButton = (type, text = "") => <button type="button" key={type} className={`converse-patches__piece ${type === "Initials" ? "converse-patches__initials-piece" : ""}`} aria-label={type === "Initials" ? (text.trim() ? `Drag ${text} onto a shoe, or click then tap a shoe` : "Enter your initials to create a draggable patch") : type} disabled={type === "Initials" && !text.trim()} aria-pressed={tool?.type === type} onPointerDown={(event) => beginDrag(event, { type, text })} {...dragHandlers} onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } setTool({ type, text }); setOriginal(false); }}><svg viewBox="-28 -28 56 56" aria-hidden="true"><Decoration type={type} text={text}/></svg><span>{type === "Initials" ? (text.trim() ? "Drag onto shoe ↗" : "Type initials first") : type}</span></button>;
  return <section className="converse-lacing converse-custom" style={{ "--converse-background": `url("${converseBackground}")` }} aria-labelledby="custom-title" onClick={stop} onPointerDown={stop} onKeyDown={stop} onWheel={stop}>
    <div className="converse-lacing__copy">
      <button className="converse-lacing__back" onClick={onBack}>Back to the story</button>
      <small>02 / PANTSULA / MAKE IT YOURS</small><h2 id="custom-title">Your shoes.<br/>Your signature.</h2>
      <p>My cousin made every outfit his own. Before I follow the dancers, I want to put something of myself into these shoes.</p>
      <fieldset><legend>01 / The patch library</legend><div className="converse-custom__choices converse-patches">{types.map((type) => patchButton(type))}</div></fieldset>
      <div className="converse-custom__signature"><label className="converse-custom__initials">Your initials<input value={initials} maxLength={4} placeholder="JM" onChange={(event) => setInitials(event.target.value.toUpperCase())}/></label><div className="converse-custom__choices converse-patches">{patchButton("Initials", initials)}</div></div>
      <p className="converse-custom__help">Drag a patch onto a shoe, or select one and tap to place. Select a decoration to edit. Keyboard: focus the shoe and press Enter to place.</p>
      {items.length > 0 && <div className="converse-custom__manage"><select aria-label="Your decorations" value={selected ?? ""} onChange={(event) => { const item = items.find((entry) => entry.id === Number(event.target.value)); if (item) { turnTo(item.view * 90); setSelected(item.id); setOriginal(false); } }}><option value="" disabled>Your decorations</option>{items.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {shoeViews[item.view].name} / {item.type}{item.text ? `: ${item.text}` : ""}</option>)}</select><button type="button" disabled={!active} onClick={() => removeItem(selected)}>Remove</button><button type="button" onClick={() => { setItems([]); setSelected(null); setNotice("All decorations removed. Choose a patch to start again."); }}>Clear all</button></div>}
      {active && <fieldset className="converse-patches__adjust"><legend>Selected: {active.type}</legend><label>Size<input type="range" min=".5" max="2" step=".1" value={active.size} onChange={(event) => updateItem(active.id, { size:Number(event.target.value) })}/></label><label>Angle<input type="range" min="-180" max="180" value={active.rotation} onChange={(event) => updateItem(active.id, { rotation:Number(event.target.value) })}/></label><button type="button" onClick={() => { setItems((previous) => previous.filter((item) => item.id !== active.id)); setSelected(null); }}>Remove decoration</button></fieldset>}
      <p role="status" className="converse-lacing__status">{notice}</p>
      <button type="button" className="converse-lacing__watch" disabled={!ready} onClick={() => { if (ready) onComplete(); }}>Follow the rhythm</button>
    </div>
    <div className="converse-custom__preview">
      <div className="converse-editorial__board">
      <aside className="converse-editorial__note converse-editorial__note--top"><span>FIELD NOTE / 01</span><p>A familiar silhouette.<br/>A signature only you can leave.</p><b aria-hidden="true">↘</b></aside>
      <div className="converse-custom__turntable">
      <svg ref={svgRef} viewBox="0 0 500 600" role="group" tabIndex="0" aria-label="Converse decoration area. Enter places the selected patch. Arrow keys move a selected decoration." style={{ transform:`scale(${zoom ? 1.3 : 1})` }} onClick={(event) => { if (suppressClick.current) { suppressClick.current = false; return; } if (tool) place(tool, point(event)); }} onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if ((event.key === "Enter" || event.key === " ") && tool) { event.preventDefault(); place(tool, view.point); } }}>
        <image href={view.image} width="500" height="600"/>
        {!original && items.filter((item) => item.view === viewIndex).map((item) => <g key={item.id} role="button" tabIndex="0" aria-label={`${item.type} decoration. Use arrow keys to move, Delete to remove.`} transform={`translate(${item.x} ${item.y}) rotate(${item.rotation}) scale(${item.size})`} className="converse-patches__placed" onPointerDown={(event) => beginDrag(event, null, item)} {...dragHandlers} onClick={(event) => { event.stopPropagation(); suppressClick.current = false; setSelected(item.id); }} onFocus={() => setSelected(item.id)} onKeyDown={(event) => { event.stopPropagation(); if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); setItems((previous) => previous.filter((entry) => entry.id !== item.id)); setSelected(null); } const changes = { ArrowLeft:[-5,0], ArrowRight:[5,0], ArrowUp:[0,-5], ArrowDown:[0,5] }; if (changes[event.key]) { event.preventDefault(); const [x,y] = changes[event.key]; const next = { x:item.x + x, y:item.y + y }; if (onShoe(next)) updateItem(item.id, next); } }}>
          <rect x="-30" y="-28" width="60" height="56" rx="5" fill="transparent" stroke={selected === item.id ? "#fff0c4" : "none"} strokeDasharray="3 3"/><Decoration type={item.type} text={item.text}/>
        </g>)}
        {preview && <g transform={`translate(${preview.x} ${preview.y})`} opacity=".65" pointerEvents="none"><Decoration type={preview.type} text={preview.text}/></g>}
      </svg></div>
      <aside className="converse-editorial__note converse-editorial__note--bottom"><span>MAKE IT PERSONAL / 02</span><p>Patch the canvas. Sign your initials. Let the details tell your story.</p><b aria-hidden="true">↖</b></aside>
      <div className="converse-editorial__spec"><span>HIGH TOP / CANVAS</span><span>DESIGNED BY YOU</span><strong>02</strong></div>
      </div>
      <p className="converse-custom__hint">Drag a patch onto either shoe — every detail is yours.</p>
      <label className="converse-custom__rotation">Turn shoe<input aria-label="Turn shoe through front, outer side, back and inner side" type="range" min="0" max="360" step="90" value={angle} onChange={(event) => turnTo(Number(event.target.value))}/><output>{view.name}</output></label>
      <div className="converse-custom__choices converse-custom__view-controls">{shoeViews.map((entry, index) => <button type="button" key={entry.name} aria-pressed={viewIndex === index} onClick={() => turnTo(index * 90)}>{entry.name}</button>)}<button type="button" aria-pressed={zoom} onClick={() => setZoom(!zoom)}>Zoom detail</button><button type="button" aria-pressed={original} onClick={() => setOriginal(!original)}>{original ? "Show my design" : "Compare original"}</button><button type="button" onClick={() => { turnTo(0); setZoom(false); }}>Reset view</button></div>
    </div>
  </section>;
}
