import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempPath = path.resolve(process.cwd(), "temp_resume_upload.pdf");
    
    // Save to temp file
    fs.writeFileSync(tempPath, buffer);

    const scriptPath = path.resolve(process.cwd(), "parse_pdf.js");
    const output = execSync(`node "${scriptPath}" "${tempPath}"`);
    
    // Clean up
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    return NextResponse.json({
      success: true,
      text: output.toString(),
    });
  } catch (error) {
    console.error("Error parsing PDF (Subprocess):", error);
    return NextResponse.json(
      { error: `Failed to parse PDF: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
