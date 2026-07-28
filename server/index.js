import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = normalize(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    const relative = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\/+/, "");
    const candidate = normalize(join(root, relative));
    if (!candidate.startsWith(root)) throw new Error("Invalid path");
    const info = await stat(candidate);
    if (!info.isFile()) throw new Error("Not found");
    response.writeHead(200, {
      "content-type": types[extname(candidate)] || "application/octet-stream",
      "cache-control": relative === "index.html" ? "no-cache" : "public, max-age=86400"
    });
    response.end(await readFile(candidate));
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(Number(process.env.PORT || 3000), "0.0.0.0");
