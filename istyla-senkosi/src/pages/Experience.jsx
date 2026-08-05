import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import Introduction from "./Introduction";
import Swenka from "./Swenka";
import Pantsula from "./Pantsula";
import Skhothane from "./Skhothane";
import Reflection from "./Reflection";

function Experience() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const node = document.getElementById(hash.slice(1));
    if (node) node.scrollIntoView();
  }, [hash]);

  return (
    <main className="experience">
      <Hero />
      <Introduction />
      <Swenka />
      <Pantsula />
      <Skhothane />
      <Reflection />
    </main>
  );
}

export default Experience;
