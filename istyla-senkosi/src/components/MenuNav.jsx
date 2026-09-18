import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import "../styles/MenuNav.css";

const links = [["Home", "about"], ["Introduction", "introduction"], ["Swenka", "swenka"], ["Pantsula", "pantsula"], ["Skhothane", "skhothane"], ["Reflection", "reflection"]];

function MenuNav() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("Settings");
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const { goTo, currentSection, unlockedIndex, soundOn, setSoundOn, volume, setVolume, profileName, setProfileName, reducedMotion, setReducedMotion } = useNavigation();
  const currentLabel = links.find(([, id]) => id === currentSection)?.[0];
  const completed = Math.min(4, Math.max(0, unlockedIndex - 1));

  useEffect(() => {
    if (!open) return undefined;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    dialog.showModal();
    return () => {
      dialog.close();
      trigger?.focus();
    };
  }, [open]);

  const go = (id) => {
    goTo(id, { intro: true });
    setOpen(false);
  };

  return <>
    <button ref={triggerRef} className="menu-trigger" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}><span>MENU</span><i /><i /><i /></button>
    <dialog ref={dialogRef} className="menu-drawer" aria-labelledby="menu-title" onCancel={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget && event.clientX < event.currentTarget.getBoundingClientRect().left) setOpen(false); }}>
      <button className="menu-close" onClick={() => setOpen(false)} aria-label="Close menu">×</button>
      <p className="menu-kicker">I&apos;STYLA SENKOSI</p>
      <h2 id="menu-title">Your journey.</h2>
      <p className="menu-location">Currently exploring <strong>{currentLabel}</strong></p>
      <div className="menu-tabs" aria-label="Menu views">
        {["Settings", "Profile"].map((item) => <button key={item} aria-pressed={view === item} onClick={() => setView(item)}>{item}</button>)}
      </div>

      {view === "Settings" && <section aria-label="Settings">
        <div className="menu-section-heading"><h3>Make it yours</h3><span>Preferences</span></div>
        <div className="menu-setting"><div><h4>Background music</h4><p>The soundtrack for your journey.</p></div><button className="menu-toggle" aria-pressed={soundOn} onClick={() => setSoundOn(!soundOn)}>{soundOn ? "On" : "Off"}</button></div>
        <div className="menu-volume"><label htmlFor="journey-volume">Music volume <output>{Math.round(volume * 100)}%</output></label><input id="journey-volume" type="range" min="0" max="100" value={Math.round(volume * 100)} onChange={(event) => { const next = Number(event.target.value) / 100; setVolume(next); if (next > 0) setSoundOn(true); }} /><div><span>Quiet</span><span>Loud</span></div></div>
        <div className="menu-setting"><div><h4>Reduced motion</h4><p>Keep transitions and movement minimal.</p></div><button className="menu-toggle" aria-pressed={reducedMotion} onClick={() => setReducedMotion(!reducedMotion)}>{reducedMotion ? "On" : "Off"}</button></div>
        <p className="menu-note">Your preferences are saved in this browser.</p>
      </section>}

      {view === "Profile" && <section aria-label="Profile">
        <div className="menu-profile"><span className="menu-avatar" aria-hidden="true">{profileName.trim().slice(0, 1).toUpperCase() || "G"}</span><div><h3>{profileName.trim() || "Guest explorer"}</h3><p>Your personal journey through township style.</p></div></div>
        <label className="menu-name" htmlFor="profile-name">Display name<input id="profile-name" value={profileName} maxLength={40} placeholder="What should we call you?" autoComplete="nickname" onChange={(event) => setProfileName(event.target.value)} /></label>
        <div className="menu-progress"><div><h3>This session</h3><span>{completed} / 4 chapters</span></div><progress value={completed} max="4" aria-label="Completed chapters" /><p>{completed === 4 ? "The story is yours. Revisit a chapter or explore your reflection." : "Explore the story in any order using Chapters."}</p></div>
        <button className="menu-resume" onClick={() => go(currentSection)}>Return to {currentLabel}<span aria-hidden="true">↗</span></button>
        <p className="menu-note">Your name is saved on this device. Journey progress lasts for this session.</p>
      </section>}
      <footer className="menu-footer">Past, Present and Future of Township Fashion</footer>
    </dialog>
  </>;
}
export default MenuNav;
