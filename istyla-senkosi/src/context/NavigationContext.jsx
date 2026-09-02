/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ORDER = ["about", "introduction", "swenka", "pantsula", "skhothane", "reflection"];

const NavigationContext = createContext({
  currentSection: "about",
  unlockedIndex: 0,
  goTo: () => {},
  completeChapter: () => {},
  isUnlocked: () => true,
});

export function NavigationProvider({ children }) {
  const [currentSection, setCurrentSection] = useState("about");
  // "introduction" (index 1) starts unlocked - Hero's "Begin Journey" is the
  // only door in, and there's no free-scroll path that could bypass it now
  // that Experience only ever mounts one section at a time.
  const [unlockedIndex, setUnlockedIndex] = useState(1);

  useEffect(() => {
    document.body.dataset.activeSection = currentSection;
  }, [currentSection]);

  const isUnlocked = useCallback((id) => {
    const index = ORDER.indexOf(id);
    return index !== -1 && index <= unlockedIndex;
  }, [unlockedIndex]);

  const goTo = useCallback((id) => {
    if (!ORDER.includes(id) || !isUnlocked(id)) return;
    setCurrentSection(id);
  }, [isUnlocked]);

  const completeChapter = useCallback((id) => {
    const index = ORDER.indexOf(id);
    if (index === -1) return;
    const nextIndex = index + 1;
    setUnlockedIndex((current) => Math.max(current, nextIndex));
    const nextId = ORDER[nextIndex];
    if (nextId) setCurrentSection(nextId);
  }, []);

  return (
    <NavigationContext.Provider value={{ currentSection, unlockedIndex, goTo, completeChapter, isUnlocked }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}

export { ORDER as CHAPTER_ORDER };
