import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ORDER = ["about", "introduction", "swenka", "pantsula", "skhothane", "reflection"];

const ChapterGateContext = createContext({
  isUnlocked: () => true,
  setReady: () => {},
  reach: () => {},
});

export function ChapterGateProvider({ children }) {
  // Start with "introduction" (index 1) reached - there's no gate before it.
  const [furthestIndex, setFurthestIndex] = useState(1);

  const reach = useCallback((id) => {
    const index = ORDER.indexOf(id);
    if (index === -1) return;
    setFurthestIndex((current) => Math.max(current, index));
  }, []);

  const setReady = useCallback((id, ready) => {
    if (!ready) return;
    const index = ORDER.indexOf(id);
    if (index === -1) return;
    setFurthestIndex((current) => Math.max(current, index + 1));
  }, []);

  const isUnlocked = useCallback((id) => ORDER.indexOf(id) <= furthestIndex, [furthestIndex]);

  return (
    <ChapterGateContext.Provider value={{ isUnlocked, setReady, reach }}>
      {children}
    </ChapterGateContext.Provider>
  );
}

export function useChapterReady(id, ready) {
  const { setReady } = useContext(ChapterGateContext);
  useEffect(() => {
    setReady(id, ready);
  }, [id, ready, setReady]);
}

export function useChapterGate() {
  return useContext(ChapterGateContext);
}

export { ORDER as CHAPTER_ORDER };
