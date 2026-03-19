const fs = require("fs");
const path = require("path");

// Polyfill DOMMatrix just in case
if (typeof global.DOMMatrix === "undefined") {
  global.DOMMatrix = class {};
}

const pdfParse = require("pdf-parse");

const filePath = process.argv[2];

if (!filePath) {
  console.error("No file path provided");
  process.exit(1);
}

async function parse() {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    // Write text to stdout
    process.stdout.write(data.text || "");
    process.exit(0);
  } catch (err) {
    console.error("Parse script error:", err);
    process.exit(1);
  }
}

parse();
