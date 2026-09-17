import { useCallback, useState } from "react";

// Save synchronously so an immediate reload keeps the last interaction.
export function useSessionState(key, fallback, validate = (value) => typeof value === typeof fallback) {
  const [value, setValue] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(`istyla:${key}`));
      return validate(saved) ? saved : fallback;
    } catch { return fallback; }
  });
  const update = useCallback((next) => setValue((previous) => {
    const result = typeof next === "function" ? next(previous) : next;
    try { sessionStorage.setItem(`istyla:${key}`, JSON.stringify(result)); } catch { /* Storage is optional. */ }
    return result;
  }), [key]);
  return [value, update];
}
