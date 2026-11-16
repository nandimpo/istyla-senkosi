import { prepareSwenkaIntro } from "./swenkaIntroAssets";

let swenka;

export function loadSwenka() {
  prepareSwenkaIntro().catch(() => {});
  swenka ??= import("../pages/Swenka").catch((error) => {
    swenka = undefined;
    throw error;
  });
  return swenka;
}
