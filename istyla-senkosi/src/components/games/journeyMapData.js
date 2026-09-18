// Map coordinates use the photograph's 1920 x 1280 reference space.
// Edit the four Bezier points together to move the route on map.jpg.
export const ROUTE = [
  { x: 900, y: 1010 },
  { x: 904, y: 1030 },
  { x: 877, y: 1046 },
  { x: 875, y: 1064 },
];
export const MAP_VIEW = "785 965 220 145";
export const STOPS = [
  { id: "north", progress: 0, title: "Johannesburg North", text: "Johannesburg North is where I grew up. These are the images of style I carry with me as I set out, thinking about my cousin and everything I have yet to ask him.", label: { dx: 10, dy: -8 }, media: null },
  { id: "memory", progress: 0.5, title: "The remembered route", text: "On the way, I begin to connect the clothes I notice with the people who wear them. I wonder what my cousin would point out, and what I have been passing without really seeing.", label: { dx: -10, dy: -4 }, media: null },
  { id: "soweto", progress: 1, title: "Soweto", text: "Arriving in Soweto, I want to listen before I decide what a look means. I am gathering stories to take back to my cousin, and questions that might bring us closer.", label: { dx: 10, dy: 8 }, media: null },
];
// Optional media: { image: importedAsset, alt: "Description", audio: importedClip }.
// Audio is rendered with native controls and never starts automatically.
export const clampProgress = (value) => Math.min(1, Math.max(0, value));
export function routePoint(value) {
  const t = clampProgress(value);
  const u = 1 - t;
  const weights = [u ** 3, 3 * u * u * t, 3 * u * t * t, t ** 3];
  return {
    x: ROUTE.reduce((sum, point, i) => sum + weights[i] * point.x, 0),
    y: ROUTE.reduce((sum, point, i) => sum + weights[i] * point.y, 0),
  };
}
// A fast drag pauses at the next story stop, so the middle memory isn't skipped.
export function advanceProgress(current, requested) {
  const target = clampProgress(requested);
  if (target > current) {
    const next = STOPS.find((stop) => stop.progress > current + 0.0001);
    return Math.min(target, next?.progress ?? 1);
  }
  return target;
}
export const routePath = `M${ROUTE[0].x} ${ROUTE[0].y} C${ROUTE.slice(1).map((p) => `${p.x} ${p.y}`).join(" ")}`;
// Sample the same curve for the illuminated portion, keeping it aligned to the marker.
export function travelledPath(progress) {
  return Array.from({ length: 41 }, (_, index) => {
    const point = routePoint(progress * index / 40);
    return `${index ? "L" : "M"}${point.x} ${point.y}`;
  }).join(" ");
}
