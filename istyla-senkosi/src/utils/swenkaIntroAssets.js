import fabric from "../assets/Additional Images/Textiles/brown fabric.jpg";
import zip from "../assets/Chapter 1_Swenka/Images/Editorial/Zip.jpg";

const decoded = new Map();
function prepareImage(src) {
  if (!decoded.has(src)) {
    const image = new Image();
    image.src = src;
    decoded.set(src, image.decode().catch((error) => {
      decoded.delete(src);
      throw error;
    }));
  }
  return decoded.get(src);
}

export const swenkaFabric = fabric;
export function prepareSwenkaIntro(preview) {
  return Promise.all([fabric, zip, preview].filter(Boolean).map(prepareImage));
}
