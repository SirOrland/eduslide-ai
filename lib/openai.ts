import OpenAI from "openai";
import type { GenerateOptions, PresentationData } from "@/types";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePresentation(
  documentText: string,
  options: GenerateOptions
): Promise<PresentationData> {
  const systemPrompt = `You are an expert educational content designer and presentation specialist.
Your task is to analyze educational documents and create structured, engaging presentations.
Always respond with valid JSON matching the exact schema provided.
Create clear, concise slide content that is appropriate for the specified audience and style.`;

  const userPrompt = `Analyze the following educational document and create a comprehensive presentation with ${options.numSlides} slides.

Document Content:
${documentText.slice(0, 8000)}

Presentation Requirements:
- Theme: ${options.theme}
- Number of slides: ${options.numSlides}
- Language: ${options.language || "English"}
- Include quiz questions: ${options.includeQuiz}
- Include discussion questions: ${options.includeDiscussion}
- Include summary slide: ${options.includeSummary}
- Include references slide: ${options.includeReferences}

Create a presentation that:
1. Starts with a compelling title slide
2. Includes clear learning objectives
3. Breaks content into digestible chunks (3-5 bullet points per slide)
4. Uses active voice and clear language
5. Includes speaker notes for each slide
6. Generates descriptive image prompts for visual slides
${options.includeQuiz ? "7. Includes 3-5 quiz questions with answers" : ""}
${options.includeDiscussion ? "8. Includes discussion questions to engage learners" : ""}
${options.includeSummary ? "9. Ends with a summary of key takeaways" : ""}
${options.includeReferences ? "10. Includes a references/sources slide" : ""}

Respond ONLY with a JSON object matching this exact schema:
{
  "presentationTitle": "string",
  "presentationDescription": "string",
  "theme": "${options.theme}",
  "slides": [
    {
      "slideNumber": 1,
      "slideType": "title|content|objectives|quiz|discussion|summary|references",
      "title": "string",
      "content": ["bullet point 1", "bullet point 2"],
      "speakerNotes": "string (2-3 sentences for presenter)",
      "imagePrompt": "string (detailed description for image generation)"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 4000,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No content returned from OpenAI");

  const parsed = JSON.parse(content) as PresentationData;

  // Ensure slide numbers are sequential
  parsed.slides = parsed.slides.map((slide, index) => ({
    ...slide,
    slideNumber: index + 1,
  }));

  return parsed;
}

export async function regenerateSlide(
  presentationContext: string,
  slideTitle: string,
  slideType: string,
  instructions?: string
): Promise<{ title: string; content: string[]; speakerNotes: string; imagePrompt: string }> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert presentation designer. Regenerate a single slide based on context and instructions. Return valid JSON only.",
      },
      {
        role: "user",
        content: `Regenerate this slide:
Title: ${slideTitle}
Type: ${slideType}
Presentation Context: ${presentationContext}
${instructions ? `Special Instructions: ${instructions}` : ""}

Return JSON:
{
  "title": "string",
  "content": ["bullet 1", "bullet 2", "bullet 3"],
  "speakerNotes": "string",
  "imagePrompt": "string"
}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
    max_tokens: 800,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No content returned");
  return JSON.parse(content);
}
