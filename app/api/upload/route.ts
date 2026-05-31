export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { extractTextFromFile, cleanExtractedText, extractKeyInformation } from "@/lib/document-parser";
import { put } from "@vercel/blob";
import { MAX_FILE_SIZE } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.` },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, DOCX, DOC, TXT, PPTX, or PPT files." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text
    const rawText = await extractTextFromFile(buffer, file.type, file.name);
    const cleanedText = cleanExtractedText(rawText);

    if (cleanedText.length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text from the file. Please ensure the document has readable content." },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    let fileUrl = "";
    try {
      const blob = await put(
        `documents/${session.user.id}/${Date.now()}-${file.name}`,
        buffer,
        { access: "public", contentType: file.type }
      );
      fileUrl = blob.url;
    } catch {
      // Continue without blob storage if not configured
      fileUrl = "";
    }

    const info = extractKeyInformation(cleanedText);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileUrl,
      extractedText: cleanedText,
      wordCount: info.wordCount,
      estimatedSlides: info.estimatedSlides,
      hasLearningObjectives: info.hasLearningObjectives,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file. Please try again." },
      { status: 500 }
    );
  }
}

