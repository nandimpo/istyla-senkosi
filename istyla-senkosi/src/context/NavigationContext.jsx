import { useSessionState } from "../hooks/useSessionState";
/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ORDER = ["about", "introduction", "swenka", "pantsula", "skhothane", "reflection"];

function readPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem("istyla-preferences")) || {};
    if (typeof saved !== "object" || Array.isArray(saved)) return {};
    delete saved.soundOn;
    return saved;
  } catch {
    return {};
  }
}

const NavigationContext = createContext({
  currentSection: "about",
  unlockedIndex: 0,
  goTo: () => {},
  restartJourney: () => {},
  completeChapter: () => {},
  isUnlocked: () => true,
});

export function NavigationProvider({ children }) {
  const [chapterVisit, setChapterVisit] = useState(0);
  const [pageReady, setPageReady] = useState(false);
  const [navigationLocked, setNavigationLocked] = useState(false);
  const [preferences, setPreferences] = useState(readPreferences);
  const [soundOn, setSoundOnState] = useState(true);
  const volume = Number.isFinite(preferences.volume) ? Math.max(0, Math.min(1, preferences.volume)) : 0.7;
  const profileName = typeof preferences.profileName === "string" ? preferences.profileName : "";
  const reducedMotion = preferences.reducedMotion === true;
  const setSoundOn = (value) => setSoundOnState((current) => typeof value === "function" ? value(current) : value);
  const setVolume = (value) => setPreferences((p) => ({ ...p, volume: value }));
  const setProfileName = (value) => setPreferences((p) => ({ ...p, profileName: value }));
  const setReducedMotion = (value) => setPreferences((p) => ({ ...p, reducedMotion: value }));
  useEffect(() => {
    try { localStorage.setItem("istyla-preferences", JSON.stringify(preferences)); } catch { /* Preferences still work when storage is unavailable. */ }
    document.documentElement.dataset.reducedMotion = reducedMotion ? "true" : "false";
  }, [preferences, reducedMotion]);
  const [currentSection, setCurrentSection] = useSessionState("section", "about", (value) => ORDER.includes(value));
  const [guideComplete, setGuideComplete] = useSessionState("guide-complete", currentSection !== "about", (value) => typeof value === "boolean");
  // Track journey progress separately from free chapter access.
  const [unlockedIndex, setUnlockedIndex] = useState(1);
  const [completedChapters, setCompletedChapters] = useSessionState("completed-chapters", [], (value) => Array.isArray(value) && value.every((id) => ORDER.includes(id)));

  useEffect(() => {
    document.body.dataset.activeSection = currentSection;
  }, [currentSection]);

  const isUnlocked = useCallback((id) => {
    return ORDER.includes(id) && (id === "about" || guideComplete);
  }, [guideComplete]);

  const goBackChapter = useCallback(() => {
    const previous = ORDER[ORDER.indexOf(currentSection) - 1];
    if (!previous) return;
    try {
      const lastPage = JSON.parse(sessionStorage.getItem(`istyla:${previous}:last-page`));
      if (Number.isInteger(lastPage) && lastPage >= 0) sessionStorage.setItem(`istyla:${previous}:page`, JSON.stringify(lastPage));
    } catch { /* Use the previous chapter's saved position if storage is unavailable. */ }
    setNavigationLocked(false);
    setChapterVisit((visit) => visit + 1);
    setCurrentSection(previous);
  }, [currentSection, setCurrentSection]);

  const goTo = useCallback((id, { completedChapter, page, intro = false } = {}) => {
    if (!isUnlocked(id)) return;
    if (Number.isInteger(page) && page >= 0) {
      try {
        sessionStorage.setItem(`istyla:${id}:page`, JSON.stringify(page));
        sessionStorage.setItem(`istyla:${id}:gallery`, "0");
        sessionStorage.setItem(`istyla:${id}:skip-intro`, JSON.stringify(!intro));
      } catch { /* Keep chapter navigation available when storage is unavailable. */ }
      setNavigationLocked(false);
      setChapterVisit((visit) => visit + 1);
    } else if (completedChapters.includes(id)) {
      try {
        sessionStorage.setItem(`istyla:${id}:page`, "0");
        sessionStorage.setItem(`istyla:${id}:gallery`, "0");
        sessionStorage.removeItem(`istyla:${id}:skip-intro`);
        if (id === "introduction") sessionStorage.setItem("istyla:map:progress", "0");
      } catch { /* Navigation remains available without storage. */ }
      setChapterVisit((visit) => visit + 1);
    }
    setCompletedChapters((previous) => {
      const next = previous.filter((chapter) => chapter !== id);
      return completedChapter && !next.includes(completedChapter) ? [...next, completedChapter] : next;
    });
    setCurrentSection(id);
  }, [isUnlocked, setCurrentSection, completedChapters, setCompletedChapters]);

  const restartJourney = useCallback(() => {
    // Only this explicit action clears progress. Reloads continue using the saved page.
    try {
      const keys = Array.from({ length: sessionStorage.length }, (_, index) => sessionStorage.key(index));
      keys.filter((key) => key?.startsWith("istyla:")).forEach((key) => sessionStorage.removeItem(key));
    } catch { /* A fresh chapter still mounts when storage is unavailable. */ }
    setNavigationLocked(false);
    setUnlockedIndex(1);
    setGuideComplete(true);
    setCompletedChapters([]);
    setChapterVisit((visit) => visit + 1);
    setCurrentSection("introduction");
  }, [setCurrentSection, setCompletedChapters, setGuideComplete]);

  const markChapterComplete = useCallback((id) => {
    setCompletedChapters((previous) => previous.includes(id) ? previous : [...previous, id]);
  }, [setCompletedChapters]);

  const completeChapter = useCallback((id) => {
    if (navigationLocked) return;
    const index = ORDER.indexOf(id);
    if (index === -1) return;
    const nextIndex = index + 1;
    setUnlockedIndex((current) => Math.max(current, nextIndex));
    const nextId = ORDER[nextIndex];
    if (nextId) goTo(nextId, { completedChapter: id });
    else setCompletedChapters((previous) => previous.includes(id) ? previous : [...previous, id]);
  }, [navigationLocked, goTo, setCompletedChapters]);

  return (
    <NavigationContext.Provider value={{ pageReady, setPageReady, currentSection, guideComplete, chapterVisit, unlockedIndex, goTo, goBackChapter, restartJourney, completeChapter, markChapterComplete, isUnlocked, soundOn, setSoundOn, volume, setVolume, profileName, setProfileName, reducedMotion, setReducedMotion, navigationLocked, setNavigationLocked }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}

export { ORDER as CHAPTER_ORDER };
