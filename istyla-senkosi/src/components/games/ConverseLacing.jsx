import { useRef, useState } from "react";
import converseImage from "../../assets/Additional Images/Shoes/Converse.jpg";
import "../../styles/ConverseLacing.css";

const types = ["Star", "Checks", "Spots"];
function Decoration({ type, text }) {
  if (type === "Initials") return <text textAnchor="middle" dominantBaseline="central" fill="#f4d598" stroke="#18291f" strokeWidth="1" paintOrder="stroke" fontSize="25" fontWeight="800" fontFamily="Arial,sans-serif">{text}</text>;
  if (type === "Star") return <path d="M0 -22 L6 -7 L22 -7 L10 4 L14 21 L0 12 L-14 21 L-10 4 L-22 -7 L-6 -7Z" fill="#eeb95c" stroke="#fff0cf" strokeWidth="1.5"/>;
  if (type === "Checks") return <g><rect x="-22" y="-22" width="44" height="44" rx="3" fill="#eee2bf"/>{[0,1,2,3].flatMap((row) => [0,1,2,3].filter((col) => (row + col) % 2 === 0).map((col) => <rect key={`${row}-${col}`} x={-22 + col * 11} y={-22 + row * 11} width="11" height="11" fill="#d85636"/>))}</g>;
  return <g fill="#eba855" stroke="#211f17" strokeWidth="3"><ellipse cx="-12" cy="-9" rx="9" ry="7"/><ellipse cx="12" cy="4" rx="8" ry="11"/><ellipse cx="-9" cy="16" rx="6" ry="5"/></g>;
}
export default function ConverseLacing({ onComplete, onBack }) {
  const [initials, setInitials] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tool, setTool] = useState(null);
  const [preview, setPreview] = useState(null);
  const [angle, setAngle] = useState(0);
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
    // Broad silhouettes cover canvas, laces and toe caps but exclude the backdrop.
    const left = ((x - 146) / (y > 300 ? 110 : 83)) ** 2 + ((y - 267) / 230) ** 2;
    const right = ((x - 360) / (y > 300 ? 115 : 85)) ** 2 + ((y - 278) / 220) ** 2;
    return left <= 1 || right <= 1;
  };
  const place = (template, position) => {
    if (!onShoe(position)) { setNotice("Drop the decoration on either shoe."); return; }
    const item = { ...template, x:position.x, y:position.y, id:++serial.current, size:1, rotation:0 };
    setItems((previous) => [...previous, item]);
    setSelected(item.id); setTool(null); setOriginal(false);
    setNotice("Decoration added. Drag it to reposition, or use the adjustment controls.");
  };
  const updateItem = (id, change) => setItems((previous) => previous.map((item) => item.id === id ? { ...item, ...change } : item));
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
  const patchButton = (type, text = "") => <button type="button" key={type} className="converse-patches__piece" disabled={type === "Initials" && !text.trim()} aria-pressed={tool?.type === type} onPointerDown={(event) => beginDrag(event, { type, text })} {...dragHandlers} onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } setTool({ type, text }); setOriginal(false); }}><svg viewBox="-28 -28 56 56" aria-hidden="true"><Decoration type={type} text={text}/></svg><span>{type === "Initials" ? "Your initials" : type}</span></button>;
  return <section className="converse-lacing converse-custom" aria-labelledby="custom-title" onClick={stop} onPointerDown={stop} onKeyDown={stop} onWheel={stop}>
    <div className="converse-lacing__copy">
      <button className="converse-lacing__back" onClick={onBack}>Back to the story</button>
      <small>02 / PANTSULA / MAKE IT YOURS</small><h2 id="custom-title">Your shoes.<br/>Your signature.</h2>
      <p>My cousin made every outfit his own. Before I follow the dancers, I want to put something of myself into these shoes.</p>
      <fieldset><legend>Drag individual patches onto the shoe</legend><div className="converse-custom__choices converse-patches">{types.map((type) => patchButton(type))}</div></fieldset>
      <label className="converse-custom__initials">Your initials<input value={initials} maxLength={4} placeholder="JAMA" onChange={(event) => setInitials(event.target.value.toUpperCase())}/></label>
      <div className="converse-custom__choices converse-patches">{patchButton("Initials", initials)}</div>
      <p className="converse-custom__help">Drag a patch or initials to place them. You can also select one, then tap the shoe. Keyboard: select a patch, focus the shoe and press Enter.</p>
      {active && <fieldset className="converse-patches__adjust"><legend>Selected: {active.type}</legend><label>Size<input type="range" min=".5" max="2" step=".1" value={active.size} onChange={(event) => updateItem(active.id, { size:Number(event.target.value) })}/></label><label>Angle<input type="range" min="-180" max="180" value={active.rotation} onChange={(event) => updateItem(active.id, { rotation:Number(event.target.value) })}/></label><button type="button" onClick={() => { setItems((previous) => previous.filter((item) => item.id !== active.id)); setSelected(null); }}>Remove decoration</button></fieldset>}
      <p role="status" className="converse-lacing__status">{notice}</p>
      <button type="button" className="converse-lacing__watch" disabled={!ready} onClick={() => { if (ready) onComplete(); }}>Reveal both videos</button>
    </div>
    <div className="converse-custom__preview">
      <div className="converse-custom__turntable">
      <svg ref={svgRef} viewBox="0 0 500 600" role="group" tabIndex="0" aria-label="Converse decoration area. Enter places the selected patch. Arrow keys move a selected decoration." style={{ transform:`rotate(${angle}deg) scale(${zoom ? 1.3 : 1})` }} onClick={(event) => { if (suppressClick.current) { suppressClick.current = false; return; } if (tool) place(tool, point(event)); }} onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if ((event.key === "Enter" || event.key === " ") && tool) { event.preventDefault(); place(tool, { x:145, y:400 }); } }}>
        <image href={converseImage} width="500" height="600"/>
        {!original && items.map((item) => <g key={item.id} role="button" tabIndex="0" aria-label={`${item.type} decoration. Use arrow keys to move, Delete to remove.`} transform={`translate(${item.x} ${item.y}) rotate(${item.rotation}) scale(${item.size})`} className="converse-patches__placed" onPointerDown={(event) => beginDrag(event, null, item)} {...dragHandlers} onClick={(event) => { event.stopPropagation(); suppressClick.current = false; setSelected(item.id); }} onFocus={() => setSelected(item.id)} onKeyDown={(event) => { event.stopPropagation(); if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); setItems((previous) => previous.filter((entry) => entry.id !== item.id)); setSelected(null); } const changes = { ArrowLeft:[-5,0], ArrowRight:[5,0], ArrowUp:[0,-5], ArrowDown:[0,5] }; if (changes[event.key]) { event.preventDefault(); const [x,y] = changes[event.key]; const next = { x:item.x + x, y:item.y + y }; if (onShoe(next)) updateItem(item.id, next); } }}>
          <rect x="-30" y="-28" width="60" height="56" rx="5" fill="transparent" stroke={selected === item.id ? "#fff0c4" : "none"} strokeDasharray="3 3"/><Decoration type={item.type} text={item.text}/>
        </g>)}
        {preview && <g transform={`translate(${preview.x} ${preview.y})`} opacity=".65" pointerEvents="none"><Decoration type={preview.type} text={preview.text}/></g>}
      </svg></div>
      <p className="converse-custom__hint">Place your patches anywhere on either shoe.</p>
      <label className="converse-custom__rotation">Rotate photo<input type="range" min="-180" max="180" value={angle} onChange={(event) => setAngle(Number(event.target.value))}/><output>{angle} degrees</output></label>
      <div className="converse-custom__choices"><button type="button" aria-pressed={zoom} onClick={() => setZoom(!zoom)}>Zoom detail</button><button type="button" aria-pressed={original} onClick={() => setOriginal(!original)}>{original ? "Show my design" : "Compare original"}</button><button type="button" onClick={() => { setAngle(0); setZoom(false); }}>Reset view</button></div>
    </div>
  </section>;
}
