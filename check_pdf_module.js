const { PDFParse } = require("pdf-parse");

async function test() {
  try {
    const data = await new PDFParse(Buffer.from("dummy"));
    console.log("Success! Keys:", Object.keys(data));
    console.log("Text content:", data.text);
  } catch (err) {
    console.log("Test error:", err.message);
  }
  process.exit(0);
}

test();
