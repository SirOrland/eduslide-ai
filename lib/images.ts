export interface ImageResult {
  url: string;
  thumbnail: string;
  alt: string;
  source: string;
  license: string;
}

const STYLE_SUFFIX: Record<string, string> = {
  realistic:    "photorealistic, high quality photography, sharp focus",
  infographic:  "clean infographic, flat design, colorful educational illustration, vector art",
  educational:  "educational diagram, clear labels, professional scientific illustration, textbook style",
  minimalist:   "minimalist design, simple clean icons, white background, flat vector",
};

export async function searchOpenverse(query: string, limit = 4): Promise<ImageResult[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      page_size: String(limit),
      license_type: "commercial,modification",
      mature: "false",
    });
    const res = await fetch(`https://api.openverse.org/v1/images/?${params}`, {
      headers: { "User-Agent": "EduSlide-AI/1.0 (educational-use)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).map((img: any) => ({
      url: img.url,
      thumbnail: img.thumbnail ?? img.url,
      alt: img.title ?? query,
      source: img.source ?? "openverse",
      license: img.license ?? "cc",
    }));
  } catch {
    return [];
  }
}

export function buildPollinationsUrl(prompt: string, style = "educational"): string {
  const suffix = STYLE_SUFFIX[style] ?? STYLE_SUFFIX.educational;
  const full = `${prompt}, ${suffix}, 16:9 widescreen`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(full)}?width=1280&height=720&nologo=true`;
}

export async function getSlideImage(
  imagePrompt: string,
  mode: string,
  style: string
): Promise<string | null> {
  if (mode === "none") return null;

  if (mode === "generate") {
    return buildPollinationsUrl(imagePrompt, style);
  }

  // Search Openverse first
  const results = await searchOpenverse(imagePrompt, 3);
  if (results.length > 0) return results[0].url;

  // Fall back to AI generation
  if (mode === "auto") {
    return buildPollinationsUrl(imagePrompt, style);
  }

  return null;
}
