// Follow-up music comes from each chapter's own folder; primary songs stay in the pages.
const tracks = import.meta.glob("../assets/normalized-audio/**/*.mp3", { eager:true, query:"?url", import:"default" });
const folders = {
  introduction: "Chapter 1_ Introduction",
  swenka: "Chapter 2_Swenka",
  pantsula: "Chapter 3_Pantsula",
  skhothane: "Chapter 4_Skothane",
  reflection: "Chapter_5 Reflection",
};
export const CHAPTER_FOLLOWUPS = Object.fromEntries(Object.entries(folders).map(([id, folder]) => [id,
  Object.entries(tracks)
    .filter(([path]) => path.includes(`/${folder}/`))
    // Spirit is already Reflection's opening track, so don't queue its duplicate.
    .filter(([path]) => id !== "reflection" || !path.includes("Kwesta - Spirit"))
    .sort(([a], [b]) => {
      if (id === "introduction") {
        const priority = (path) => path.includes("Miriam Makeba - Welela") ? 0 : 1;
        return priority(a) - priority(b) || a.localeCompare(b);
      }
      return a.localeCompare(b);
    })
    .map(([, url]) => url),
]));
export function nextQueueIndex(current, length) {
  return length > 0 ? (current + 1) % length : -1;
}
