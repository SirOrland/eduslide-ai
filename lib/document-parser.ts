import mammoth from "mammoth";

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<string> {
  if (mimeType === "text/plain") {
    return buffer.toString("utf-8");
  }

  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (mimeType === "application/pdf") {
    // Dynamic import to avoid issues in edge runtime
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (
    mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    mimeType === "application/vnd.ms-powerpoint"
  ) {
    // For PPT/PPTX, return a placeholder - full parsing requires more complex library
    return `[Content extracted from ${fileName}]\n\nThis presentation file has been uploaded for reference. The AI will use the filename and any readable text to generate a new presentation.`;
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
}

export function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\t/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function extractKeyInformation(text: string): {
  wordCount: number;
  estimatedSlides: number;
  hasLearningObjectives: boolean;
  hasTables: boolean;
  hasLists: boolean;
} {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const estimatedSlides = Math.min(Math.max(Math.ceil(wordCount / 150), 5), 30);

  const hasLearningObjectives =
    /learning\s+objective|by\s+the\s+end|students?\s+will|you\s+will\s+(learn|be\s+able)/i.test(text);
  const hasTables = /\|.*\||\t.*\t/.test(text);
  const hasLists = /^[\s]*[-•*]\s|^\d+\.\s/m.test(text);

  return { wordCount, estimatedSlides, hasLearningObjectives, hasTables, hasLists };
}
