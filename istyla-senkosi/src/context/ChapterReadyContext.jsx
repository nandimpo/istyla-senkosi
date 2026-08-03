import { createContext, useContext, useLayoutEffect, useState } from "react";

const ChapterReadyContext = createContext({ ready: true, setReady: () => {} });

export function ChapterReadyProvider({ children }) {
  const [ready, setReady] = useState(true);
  return <ChapterReadyContext.Provider value={{ ready, setReady }}>{children}</ChapterReadyContext.Provider>;
}

export function useChapterReady() {
  return useContext(ChapterReadyContext).ready;
}

export function useSetChapterReady(ready) {
  const { setReady } = useContext(ChapterReadyContext);
  useLayoutEffect(() => {
    setReady(ready);
  }, [ready, setReady]);
}
