import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ActiveSectionContext = createContext({ activeId: "about", register: () => () => {} });

export function ActiveSectionProvider({ children }) {
  const [activeId, setActiveId] = useState("about");
  const observerRef = useRef(null);
  if (!observerRef.current) {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.dataset.sectionId);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
  }

  useEffect(() => () => observerRef.current?.disconnect(), []);

  useEffect(() => {
    document.body.dataset.activeSection = activeId;
  }, [activeId]);

  const register = useCallback((id, node) => {
    node.dataset.sectionId = id;
    observerRef.current.observe(node);
    return () => observerRef.current?.unobserve(node);
  }, []);

  return (
    <ActiveSectionContext.Provider value={{ activeId, register }}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useRegisterSection(id, ref) {
  const { register } = useContext(ActiveSectionContext);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    return register(id, node);
  }, [id, ref, register]);
}

export function useActiveSection() {
  return useContext(ActiveSectionContext).activeId;
}
