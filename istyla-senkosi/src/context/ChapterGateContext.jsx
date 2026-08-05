import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ORDER = ["about", "introduction", "swenka", "pantsula", "skhothane", "reflection"];

const ChapterGateContext = createContext({
  isUnlocked: () => true,
  setReady: () => {},
});

export function ChapterGateProvider({ children }) {
  const [readyMap, setReadyMap] = useState({});

  const setReady = useCallback((id, ready) => {
    setReadyMap((prev) => (prev[id] === ready ? prev : { ...prev, [id]: ready }));
  }, []);

  const isUnlocked = useCallback(
    (id) => {
      const index = ORDER.indexOf(id);
      if (index <= 0) return true;
      const prevId = ORDER[index - 1];
      return readyMap[prevId] !== false;
    },
    [readyMap],
  );

  return (
    <ChapterGateContext.Provider value={{ isUnlocked, setReady }}>
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
