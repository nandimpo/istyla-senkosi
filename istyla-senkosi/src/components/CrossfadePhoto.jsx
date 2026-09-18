import { useEffect, useState } from "react";
import { useNavigation } from "../context/NavigationContext";

export default function CrossfadePhoto({ images, index, alt = "", paused = false, interval = 2800, fadeDuration = 2800, onOpen }) {
  const { reducedMotion } = useNavigation();
  const [slide, setSlide] = useState({ current:index, previous:index, cycle:0 });
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;
    const update = () => {
      clearTimeout(timer);
      if (paused || reducedMotion || query.matches || images.length < 2) return;
      const next = () => {
        setSlide((previous) => ({ current:(previous.current + 1) % images.length, previous:previous.current, cycle:previous.cycle + 1 }));
        timer = setTimeout(next, interval);
      };
      timer = setTimeout(next, (interval > 2800 ? 3500 : 600) + (index % 4) * 650);
    };
    update();
    query.addEventListener("change", update);
    return () => { clearTimeout(timer); query.removeEventListener("change", update); };
  }, [images.length, index, paused, reducedMotion, interval]);
  const Tag = onOpen ? "button" : "div";
  return <Tag className="collage-crossfade" {...(onOpen ? { type:"button", "aria-label":`Open ${alt}, photograph ${slide.current + 1}`, onClick:() => onOpen(slide.current) } : {})} style={{ "--crossfade-time":`${fadeDuration}ms`, "--crossfade-play":paused ? "paused" : "running" }}>
    <img src={images[slide.previous]} alt="" aria-hidden="true" draggable={false}/>
    <img key={slide.cycle} className={slide.cycle ? "collage-crossfade__incoming" : ""} src={images[slide.current]} alt={alt} draggable={false}/>
  </Tag>;
}
