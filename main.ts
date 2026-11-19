// Entry packager for the GTA 6 meme bounty (Sol 2).
// Reads the hand-in file from the repository root, checks that it
// really names an X post, and then assembles a clean output folder:
// a byte-identical POST.json, the caption that went out with the
// post, and the meme picture itself. Nothing here touches the
// network, the clock, or randomness, so repeated runs agree exactly.

import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const CAPTION_TEXT =
  "Called in sick for GTA VI. My agent didn't. 🫡 It earns real money on @makefunai — code: jv0xz8k3 https://make.fun/bounty/gta6-meme-x-01";

function fail(reason) {
  console.error(`gta6-meme entry: ${reason}`);
  process.exit(1);
}

function looksLikePostUrl(value) {
  if (typeof value !== "string") return false;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
  const host = parsed.hostname.toLowerCase();
  const allowedHosts = ["x.com", "www.x.com", "mobile.x.com", "twitter.com", "www.twitter.com", "mobile.twitter.com"];
  if (!allowedHosts.includes(host)) return false;
  const parts = parsed.pathname.split("/").filter((piece) => piece.length > 0);
  // Accepted shapes: <handle>/status/<digits> and i/web/status/<digits>.
  // A handle is 1-15 letters, digits or underscores, as X issues them;
  // anything else in that slot means this is not a post address.
  if (parts.length === 3 && parts[1] === "status") {
    return /^[A-Za-z0-9_]{1,15}$/.test(parts[0]) && /^[0-9]+$/.test(parts[2]);
  }
  if (parts.length === 4 && parts[0] === "i" && parts[1] === "web" && parts[2] === "status") {
    return /^[0-9]+$/.test(parts[3]);
  }
  return false;
}

function main() {
  const botDir = process.env.MAKEFUN_BOT_DIR || "/bot";
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

  const postPath = join(botDir, "POST.json");
  if (!existsSync(postPath)) {
    fail(`POST.json is missing from ${botDir}`);
  }

  let rawBytes;
  try {
    rawBytes = readFileSync(postPath);
  } catch (err) {
    fail(`could not read POST.json: ${err.message}`);
  }

  if (rawBytes.length === 0) {
    fail("POST.json is empty");
  }
  if (rawBytes.length > 16384) {
    fail(`POST.json is ${rawBytes.length} bytes, over the 16384-byte limit`);
  }

  let document;
  try {
    document = JSON.parse(rawBytes.toString("utf8"));
  } catch {
    fail("POST.json is not valid JSON");
  }

  if (document === null || typeof document !== "object" || Array.isArray(document)) {
    fail("POST.json must contain a single JSON object");
  }
  if (!looksLikePostUrl(document.url)) {
    fail("POST.json url is not an X post address like https://x.com/<handle>/status/<id>");
  }

  const memePath = join(botDir, "meme.webp");
  if (!existsSync(memePath)) {
    fail(`meme.webp is missing from ${botDir}`);
  }

  mkdirSync(outDir, { recursive: true });

  // The hand-in file goes out exactly as it came in: no reformatting,
  // no added newline, so the grader sees the validated bytes untouched.
  writeFileSync(join(outDir, "POST.json"), rawBytes);
  writeFileSync(join(outDir, "caption.txt"), CAPTION_TEXT + "\n", "utf8");
  copyFileSync(memePath, join(outDir, "meme.webp"));
}

main();
