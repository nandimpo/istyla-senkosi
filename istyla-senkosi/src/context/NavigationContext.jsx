import { useSessionState } from "../hooks/useSessionState";
/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ORDER = ["about", "introduction", "swenka", "pantsula", "skhothane", "reflection"];

function readPreferences() {
  try {
    return JSON.parse(localStorage.getItem("istyla-preferences")) || {};
  } catch {
    return {};
  }
}

const NavigationContext = createContext({
  currentSection: "about",
  unlockedIndex: 0,
  goTo: () => {},
  completeChapter: () => {},
  isUnlocked: () => true,
});

export function NavigationProvider({ children }) {
  const [navigationLocked, setNavigationLocked] = useState(false);
  const [preferences, setPreferences] = useState(readPreferences);
  const soundOn = preferences.soundOn !== false;
  const volume = Number.isFinite(preferences.volume) ? Math.max(0, Math.min(1, preferences.volume)) : 0.7;
  const profileName = typeof preferences.profileName === "string" ? preferences.profileName : "";
  const reducedMotion = preferences.reducedMotion === true;
  const setSoundOn = (value) => setPreferences((p) => ({ ...p, soundOn: typeof value === "function" ? value(p.soundOn !== false) : value }));
  const setVolume = (value) => setPreferences((p) => ({ ...p, volume: value }));
  const setProfileName = (value) => setPreferences((p) => ({ ...p, profileName: value }));
  const setReducedMotion = (value) => setPreferences((p) => ({ ...p, reducedMotion: value }));
  useEffect(() => {
    try { localStorage.setItem("istyla-preferences", JSON.stringify(preferences)); } catch { /* Preferences still work when storage is unavailable. */ }
    document.documentElement.dataset.reducedMotion = reducedMotion ? "true" : "false";
  }, [preferences, reducedMotion]);
  const [currentSection, setCurrentSection] = useSessionState("section", "about", (value) => ORDER.includes(value));
  // Track journey progress separately from free chapter access.
  const [unlockedIndex, setUnlockedIndex] = useState(1);

  useEffect(() => {
    document.body.dataset.activeSection = currentSection;
  }, [currentSection]);

  const isUnlocked = useCallback((id) => {
    return ORDER.includes(id);
  }, []);

  const goTo = useCallback((id) => {
    if (!isUnlocked(id)) return;
    setCurrentSection(id);
  }, [isUnlocked, setCurrentSection]);

  const completeChapter = useCallback((id) => {
    if (navigationLocked) return;
    const index = ORDER.indexOf(id);
    if (index === -1) return;
    const nextIndex = index + 1;
    setUnlockedIndex((current) => Math.max(current, nextIndex));
    const nextId = ORDER[nextIndex];
    if (nextId) setCurrentSection(nextId);
  }, [navigationLocked, setCurrentSection]);

  return (
    <NavigationContext.Provider value={{ currentSection, unlockedIndex, goTo, completeChapter, isUnlocked, soundOn, setSoundOn, volume, setVolume, profileName, setProfileName, reducedMotion, setReducedMotion, navigationLocked, setNavigationLocked }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}

export { ORDER as CHAPTER_ORDER };
