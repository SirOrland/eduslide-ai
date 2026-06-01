import OpenAI from "openai";
import type { GenerateOptions, PresentationData, AnimationConfig } from "@/types";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

const MODEL = "llama-3.3-70b-versatile";

function buildAnimationInstructions(config?: AnimationConfig): string {
  if (!config || config.animationLevel === "none") {
    return `For each slide include "animationData": { "transition": "fade", "cameraEffect": "none", "animationSequence": [] }`;
  }

  const styleGuides: Record<string, string> = {
    educational: "slow fade/reveal transitions, sequential bullet reveals (slideInLeft), typewriter on title",
    business: "clean push transitions, minimal fadeIn effects, professional pacing",
    marketing: "dynamic zoom/morph transitions, zoomIn and bounceIn effects, energetic pacing",
    conference: "morph transitions, smooth fadeIn with camera zoom, premium storytelling feel",
  };

  const transitionHint =
    config.transitionStyle === "automatic"
      ? `choose the best transition for each slide context (available: fade, morph, zoom, push, reveal, wipe, none)`
      : `use "${config.transitionStyle}" transition for all slides`;

  const style = styleGuides[config.presentationStyle] || styleGuides.educational;

  return `For each slide generate an "animationData" object following the ${config.presentationStyle} style: ${style}.
Transition rule: ${transitionHint}.
Animation speed: ${config.animationSpeed}.
Animation effects available: fadeIn, slideInLeft, slideInRight, slideInUp, zoomIn, bounceIn, typewriter.
Camera effects available: none, zoom, pan, focus.
Assign each slide element (title, bullet1..bulletN, subtitle, icon) an appropriate effect and delay (in seconds).`;
}

export async function generatePresentation(
  documentText: string,
  options: GenerateOptions
): Promise<PresentationData> {
  const animInstructions = buildAnimationInstructions(options.animationConfig);

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

Animation Instructions:
${animInstructions}

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
      "imagePrompt": "string (detailed description for image generation)",
      "animationData": {
        "transition": "fade|morph|zoom|push|reveal|wipe|none",
        "cameraEffect": "none|zoom|pan|focus",
        "animationSequence": [
          { "element": "title", "effect": "fadeIn|slideInLeft|slideInRight|slideInUp|zoomIn|bounceIn|typewriter", "duration": 0.8, "delay": 0 },
          { "element": "bullet1", "effect": "slideInLeft", "duration": 0.5, "delay": 0.3 }
        ]
      }
    }
  ]
}`;

  const response = await getOpenAI().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 6000,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No content returned from AI");

  const parsed = JSON.parse(content) as PresentationData;

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
  const response = await getOpenAI().chat.completions.create({
    model: MODEL,
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
