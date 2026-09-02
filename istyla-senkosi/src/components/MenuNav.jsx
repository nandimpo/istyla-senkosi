import { useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import "../styles/MenuNav.css";

const links = [["HOME", "about"], ["INTRODUCTION", "introduction"], ["SWENKA", "swenka"], ["PANTSULA", "pantsula"], ["SKHOTHANE", "skhothane"], ["REFLECTION", "reflection"]];
function MenuNav() {
  const [open, setOpen] = useState(false);
  const { goTo, isUnlocked } = useNavigation();
  const go = (id) => () => {
    setOpen(false);
    goTo(id);
  };
  return <>
    <button className="menu-trigger" onClick={() => setOpen(true)}><span>MENU</span><i></i><i></i><i></i></button>
    {open && <div className="menu-shade" onClick={() => setOpen(false)} />}
    <aside className={`menu-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <button className="menu-close" onClick={() => setOpen(false)} aria-label="Close menu">×</button>
      <p>I&apos;STYLA SENKOSI</p><h2>MENU</h2>
      <nav>{links.map(([label, id], index) => <button className="menu-link" disabled={!isUnlocked(id)} onClick={go(id)} key={label}><em>0{index + 1}</em><b>{label}</b><i>↗</i></button>)}</nav>
      <small>Past, Present and Future of Township Fashion</small>
    </aside>
  </>;
}
export default MenuNav;
