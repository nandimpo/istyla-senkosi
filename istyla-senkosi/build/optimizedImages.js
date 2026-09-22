import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

// Originals stay untouched. Serve/cache smaller display assets in development
// and emit the same optimized files into the production build.
export default function optimizedImages() {
  const cache = new Map();
  const responses = new Map();
  let config;
  return {
    name: "optimized-documentary-images",
    enforce: "pre",
    configResolved(value) { config = value; },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const file = responses.get(request.url?.split("?")[0]);
        if (!file) return next();
        response.setHeader("Content-Type", file.type);
        response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        response.end(file.data);
      });
    },
    async load(id) {
      const [filename, query = ""] = id.split("?");
      if (!/[/\\]src[/\\]assets[/\\]/.test(filename) || !/\.(jpe?g|png)$/i.test(filename) || (query && query !== "url")) return null;
      const info = await stat(filename);
      const key = `${filename}:${info.mtimeMs}`;
      if (!cache.has(key)) cache.set(key, (async () => {
        const original = await readFile(filename);
        const compressed = await sharp(original).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toBuffer();
        const smaller = compressed.length < original.length;
        return { data: smaller ? compressed : original, extension: smaller ? ".webp" : path.extname(filename), type: smaller ? "image/webp" : /png$/i.test(filename) ? "image/png" : "image/jpeg" };
      })());
      const result = await cache.get(key);
      if (config.command === "build") {
        const reference = this.emitFile({ type: "asset", name: `${path.basename(filename, path.extname(filename))}${result.extension}`, source: result.data });
        return `export default import.meta.ROLLUP_FILE_URL_${reference};`;
      }
      const hash = createHash("sha256").update(result.data).digest("hex").slice(0, 16);
      const url = `/__optimized-images/${hash}${result.extension}`;
      responses.set(url, result);
      responses.set(`${config.base.replace(/\/$/, "")}${url}`, result);
      return `export default ${JSON.stringify(`${config.base.replace(/\/$/, "")}${url}`)};`;
    },
  };
}
