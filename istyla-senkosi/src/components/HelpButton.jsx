import { useRef, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import "../styles/HelpButton.css";

function visible(selector) {
  return [...document.querySelectorAll(selector)].find((element) => {
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && box.top < innerHeight && box.bottom > 0 && box.left < innerWidth && box.right > 0 && getComputedStyle(element).visibility !== "hidden" && !element.closest('[aria-hidden="true"]');
  });
}

function currentHelp(section) {
  if (visible(".journey-guide")) return "Read this short guide, then choose Step into the story to begin. You can open Help again at any time.";
  if (section === "about") return "Choose Begin Journey to see a short guide and start the documentary. Chapters becomes available after you read the guide and step into the story.";
  if (visible(".final-frame")) return "You have reached the end. Replay Journey starts again, Explore Chapters lets you revisit a chapter, and Credits lists the music and acknowledgements.";
  if (visible(".curved-gallery")) return "Explore all five album views by dragging, scrolling or using the arrows. Once you reach the last view, press and hold the glowing loafer circle to continue.";
  const control = visible(".spotlight-advance, .rhythm-advance, .stitch-advance");
  if (control) {
    if (control.querySelector("button:disabled") && !control.classList.contains("is-complete")) return "Let the words finish appearing and complete the activity on this page. The next-page control lights up when it is ready.";
    if (control.matches(".spotlight-advance")) return "Press and hold the loafer circle until its ring fills. Keep your mouse or trackpad button pressed, or hold with your finger. You can also hold Space or Enter while the button is focused.";
    if (control.matches(".rhythm-advance")) return "Tap the shoe control twice to continue: one tap for each step. A mouse click, trackpad click, touch or Enter on the focused button works.";
    return "Drag the needle to the right along the seam to continue. It stays where you leave it if you release early. You can also choose Continue, or focus the needle and press Enter or Space.";
  }
  if (visible("video")) return "Watch this film. The story continues when it finishes. A Skip button becomes available on supported clips. Use Sound or Menu to adjust the audio.";
  const prompt = visible('[class*="__instruction"], [class*="__hint"]');
  if (prompt?.textContent.trim()) {
    const instruction = prompt.textContent.trim();
    if (/scroll down/i.test(instruction)) return "Let the words finish, then scroll down to continue. Use your mouse wheel, a two-finger scroll on your trackpad, or swipe up on a touch screen.";
    return `On this page: ${instruction}. Follow this prompt to continue.`;
  }
  return "Let the words finish, then follow the instruction on the page. Some pages continue with a scroll. Others ask you to drag, tap or hold to unlock the next page. Complete the activity first if a control is dimmed.";
}

export default function HelpButton() {
  const dialog = useRef(null);
  const trigger = useRef(null);
  const [message, setMessage] = useState("");
  const { currentSection, pageReady } = useNavigation();
  const close = () => { dialog.current.close(); trigger.current?.focus(); };
  return <>
    <button className="help-trigger" disabled={!pageReady} ref={trigger} aria-haspopup="dialog" onClick={() => { setMessage(currentHelp(currentSection)); dialog.current.showModal(); }}>HELP <span aria-hidden="true">?</span></button>
    <dialog className="journey-help" ref={dialog} aria-labelledby="journey-help-title" onCancel={close} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    }} onWheel={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
      <p className="journey-help__kicker">A LITTLE GUIDANCE</p>
      <h2 id="journey-help-title">Your next step.</h2>
      <p className="journey-help__instruction">{message}</p>
      <div className="journey-help__navigation"><p><strong>Go back</strong> Scroll up twice, with a brief pause between scrolls, to revisit the previous page.</p><p><strong>Find your way</strong> Chapters chooses a chapter. Home returns to the opening. Menu adjusts sound and motion.</p></div>
      <button className="journey-help__close" onClick={close}>Got it, back to the story</button>
    </dialog>
  </>;
}
