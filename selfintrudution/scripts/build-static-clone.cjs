const fs = require("fs");
const path = require("path");
const { personalizeAssetDir } = require("./personalize-original-bundle.cjs");

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist");
const entryHtml = path.join(root, "index.html");

personalizeAssetDir(path.join(publicDir, "assets"));

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });
fs.cpSync(publicDir, distDir, { recursive: true });

for (const route of ["index.html", "about", "gallery", "contact"]) {
  fs.copyFileSync(entryHtml, path.join(distDir, route));
}

console.log("Static LeoninCS clone built in dist/");
