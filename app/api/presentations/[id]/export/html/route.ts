export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SlideAnimationData } from "@/types";

const SCHEME_HEX: Record<string, { bg: string; header: string; accent: string; text: string }> = {
  blue:   { bg: "#EFF6FF", header: "#1E40AF", accent: "#3B82F6", text: "#1E3A5F" },
  green:  { bg: "#F0FDF4", header: "#166534", accent: "#22C55E", text: "#14532D" },
  purple: { bg: "#FAF5FF", header: "#6B21A8", accent: "#A855F7", text: "#581C87" },
  orange: { bg: "#FFF7ED", header: "#C2410C", accent: "#F97316", text: "#7C2D12" },
  dark:   { bg: "#111827", header: "#4338CA", accent: "#6366F1", text: "#F9FAFB" },
};

function transitionClass(anim: SlideAnimationData | null, fallback: string): string {
  const t = anim?.transition ?? fallback;
  const map: Record<string, string> = {
    fade: "fade", morph: "fade", zoom: "zoom-in-out", push: "slide",
    reveal: "slide", wipe: "slide", none: "none",
  };
  return map[t] ?? "fade";
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const presentation = await prisma.presentation.findUnique({
    where: { id, userId: session.user.id },
    include: { slides: { orderBy: { slideNumber: "asc" } } },
  });

  if (!presentation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const colors = SCHEME_HEX[presentation.colorScheme] ?? SCHEME_HEX.blue;
  const animCfg = presentation.animationConfig as any;
  const globalTransition = animCfg?.transitionStyle !== "automatic" ? animCfg?.transitionStyle : "fade";

  const slides = presentation.slides.map((slide) => {
    const anim = slide.animationData as SlideAnimationData | null;
    const tc = transitionClass(anim, globalTransition);

    if (slide.slideType === "title") {
      return `
      <section data-transition="${tc}" style="background:${colors.bg}">
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:1.5rem;padding:3rem;text-align:center;">
          <div style="width:4rem;height:4rem;border-radius:50%;background:${colors.accent};display:flex;align-items:center;justify-content:center;font-size:1.5rem;">⭐</div>
          <h1 style="font-size:3rem;font-weight:900;color:${colors.text};line-height:1.15;margin:0">${slide.title}</h1>
          ${slide.content.length ? `<p style="font-size:1.15rem;opacity:.6;color:${colors.text};margin:0">${slide.content.join(" · ")}</p>` : ""}
        </div>
      </section>`;
    }

    const bullets = slide.content.slice(0, 6).map((b, i) =>
      `<li class="fragment" style="color:${colors.text};font-size:1.1rem;line-height:1.5;display:flex;align-items:flex-start;gap:.75rem;list-style:none;padding:0;margin:.6rem 0">
        <span style="min-width:.6rem;height:.6rem;border-radius:50%;background:${colors.accent};margin-top:.45rem;flex-shrink:0;display:inline-block"></span>
        ${b}
      </li>`
    ).join("");

    return `
    <section data-transition="${tc}" style="background:${colors.bg}">
      <div style="height:100%;display:flex;flex-direction:column;">
        <div style="background:${colors.header};padding:1.5rem 2.5rem;">
          <small style="color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.1em;font-size:.7rem">${slide.slideType}</small>
          <h2 style="color:#fff;font-size:1.8rem;font-weight:800;margin:.2rem 0 0">${slide.title}</h2>
        </div>
        <div style="flex:1;padding:1.5rem 2.5rem;overflow:hidden;border-left:.35rem solid ${colors.accent}">
          <ul style="margin:0;padding:0">${bullets}</ul>
        </div>
      </div>
    </section>`;
  }).join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${presentation.title}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/theme/white.css" />
<style>
  .reveal { font-family: system-ui, sans-serif; }
  .reveal .slides section { padding: 0; height: 100%; box-sizing: border-box; }
  .reveal ul { text-align: left; }
  .reveal h1, .reveal h2 { text-transform: none; }
</style>
</head>
<body>
<div class="reveal">
  <div class="slides">
${slides}
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.js"></script>
<script>
  Reveal.initialize({
    hash: true,
    transition: '${globalTransition === "push" ? "slide" : globalTransition === "morph" ? "fade" : globalTransition ?? "fade"}',
    transitionSpeed: '${animCfg?.animationSpeed ?? "default"}',
    controls: true,
    progress: true,
    slideNumber: true,
    fragments: true,
  });
</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${presentation.title.replace(/[^a-z0-9]/gi, "_")}.html"`,
    },
  });
}
