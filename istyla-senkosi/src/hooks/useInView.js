import { useEffect, useRef, useState } from "react";

export function useInView(ref, options) {
  const [inView, setInView] = useState(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, optionsRef.current);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}
