// scripts/clean-temp.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function deleteTempFiles(dir, extList = [".uploading.cfg"]) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      deleteTempFiles(fullPath, extList);
    } else {
      for (const ext of extList) {
        if (file.endsWith(ext)) {
          console.log("🧹 Removing temp file:", fullPath);
          fs.unlinkSync(fullPath);
        }
      }
    }
  }
}

deleteTempFiles(path.join(__dirname, "..", "node_modules"));

console.log("✅ Cleanup complete!");
