let swenka;

export function loadSwenka() {
  swenka ??= import("../pages/Swenka").catch((error) => {
    swenka = undefined;
    throw error;
  });
  return swenka;
}
