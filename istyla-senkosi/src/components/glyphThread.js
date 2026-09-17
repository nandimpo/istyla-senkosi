// Trace the rendered font, including enclosed counters and detached dots.
// Canvas supplies glyph geometry without shipping a font parser or animation library.
export function glyphThread(character, font) {
  const scale = 3;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.font = font;
  const metrics = context.measureText(character);
  const ascent = metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent;
  const descent = metrics.fontBoundingBoxDescent || metrics.actualBoundingBoxDescent;
  const padding = 4;
  canvas.width = Math.ceil((metrics.width + padding * 2) * scale);
  canvas.height = Math.ceil((ascent + descent + padding * 2) * scale);
  context.scale(scale, scale);
  context.font = font;
  context.fillText(character, padding, padding + ascent);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const ink = (x, y) => x >= 0 && y >= 0 && x < canvas.width && y < canvas.height && data[(y * canvas.width + x) * 4 + 3] > 100;
  const edges = new Map();
  const add = (x, y, endX, endY) => {
    const key = `${x},${y}`;
    if (!edges.has(key)) edges.set(key, []);
    edges.get(key).push([endX, endY]);
  };
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
    if (!ink(x, y)) continue;
    if (!ink(x, y - 1)) add(x, y, x + 1, y);
    if (!ink(x + 1, y)) add(x + 1, y, x + 1, y + 1);
    if (!ink(x, y + 1)) add(x + 1, y + 1, x, y + 1);
    if (!ink(x - 1, y)) add(x, y + 1, x, y);
  }
  const contours = [];
  while (edges.size) {
    const first = edges.keys().next().value;
    let key = first;
    const points = [key.split(",").map(Number)];
    while (edges.has(key)) {
      const choices = edges.get(key);
      const next = choices.pop();
      if (!choices.length) edges.delete(key);
      points.push(next);
      key = next.join(",");
      if (key === first) break;
    }
    if (points.length > 3) contours.push(points);
  }
  return { height: ascent + descent, paths: contours.map((points) => points.map(([x, y], i) => `${i ? "L" : "M"}${x / scale - padding},${y / scale - padding}`).join(" ") + " Z") };
}
