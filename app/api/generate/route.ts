import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generatePresentation } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const generateSchema = z.object({
  documentText: z.string().min(50),
  fileName: z.string().optional(),
  originalFileUrl: z.string().optional(),
  numSlides: z.number().min(3).max(30).default(10),
  theme: z.enum(["educational", "professional", "minimal", "corporate"]).default("educational"),
  colorScheme: z.string().default("blue"),
  fontStyle: z.string().default("modern"),
  includeQuiz: z.boolean().default(true),
  includeDiscussion: z.boolean().default(true),
  includeSummary: z.boolean().default(true),
  includeReferences: z.boolean().default(false),
  language: z.string().default("English"),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const options = parsed.data;

    // Generate with AI
    const presentationData = await generatePresentation(options.documentText, {
      numSlides: options.numSlides,
      theme: options.theme,
      colorScheme: options.colorScheme,
      fontStyle: options.fontStyle,
      includeQuiz: options.includeQuiz,
      includeDiscussion: options.includeDiscussion,
      includeSummary: options.includeSummary,
      includeReferences: options.includeReferences,
      language: options.language,
    });

    // Save to database
    const presentation = await prisma.presentation.create({
      data: {
        userId: session.user.id,
        title: presentationData.presentationTitle,
        description: presentationData.presentationDescription,
        fileName: options.fileName,
        originalFileUrl: options.originalFileUrl,
        theme: options.theme,
        colorScheme: options.colorScheme,
        fontStyle: options.fontStyle,
        status: "ready",
        slideCount: presentationData.slides.length,
        slides: {
          create: presentationData.slides.map((slide) => ({
            slideNumber: slide.slideNumber,
            slideType: slide.slideType,
            title: slide.title,
            content: slide.content,
            speakerNotes: slide.speakerNotes,
            imagePrompt: slide.imagePrompt,
          })),
        },
      },
      include: { slides: { orderBy: { slideNumber: "asc" } } },
    });

    return NextResponse.json({ presentation }, { status: 201 });
  } catch (error) {
    console.error("Generation error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate presentation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
