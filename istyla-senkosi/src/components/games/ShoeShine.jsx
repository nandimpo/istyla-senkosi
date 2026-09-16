import { useRef, useState } from "react";
import "../../styles/ShoeShine.css";
import shoesImage from "../../assets/Chapter 1_Swenka/Images/Editorial/shoes.jpg";

export default function ShoeShine({ onComplete }) {
  const [shine, setShine] = useState(0);
  const amount = useRef(0);
  const last = useRef(null);
  const polish = (distance) => {
    const next = Math.min(100, amount.current + distance);
    amount.current = next;
    setShine(next);
    if (next === 100) onComplete();
  };
  return <div className="shoe-shine" style={{ "--shine": shine / 100 }} onPointerDown={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
    <div className="shoe-shine__copy"><small>SWENKA / THE PREPARATION</small><h2>See where they start.</h2><p>Every detail begins with care. Rub the shoes to shine them and reveal their story.</p></div>
    <button className="shoe-shine__shoe" aria-label="Shine the shoes. Rub across them, or press Enter or Space repeatedly."
      onPointerDown={(event) => { event.stopPropagation(); if (event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); last.current = { x: event.clientX, y: event.clientY }; }}
      onPointerMove={(event) => {
        if (!last.current) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        const inside = y >= .13 && y <= .95 && ((x >= .20 && x <= .44) || (x >= .50 && x <= .77));
        const distance = Math.hypot(event.clientX - last.current.x, event.clientY - last.current.y);
        last.current = { x: event.clientX, y: event.clientY };
        if (inside) polish(Math.min(distance, 50) / bounds.width * 18);
      }}
      onPointerUp={() => { last.current = null; }} onPointerCancel={() => { last.current = null; }} onLostPointerCapture={() => { last.current = null; }}
      onClick={(event) => { event.stopPropagation(); if (event.detail === 0) polish(10); }}>
      <img className="shoe-shine__photo" src={shoesImage} alt="Brown leather lace-up shoes to polish" draggable={false} />
    </button>
    <div className="shoe-shine__progress"><label htmlFor="shoe-polish">{Math.round(shine)}% polished</label><progress id="shoe-polish" value={shine} max="100"/><p>Rub back and forth · Keyboard: Enter or Space</p></div>
  </div>;
}
