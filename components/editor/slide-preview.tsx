"use client";
import { CheckCircle2, HelpCircle, MessageSquare, BookOpen, List, Award, ImageIcon } from "lucide-react";
import type { SlideRecord } from "@/types";
import { cn } from "@/lib/utils";

interface SlidePreviewProps {
  slide: SlideRecord;
  colorScheme?: string;
  totalSlides: number;
}

const schemeGradients: Record<string, { bg: string; header: string; accent: string; text: string }> = {
  blue:   { bg: "from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900",   header: "from-blue-700 to-blue-800",     accent: "bg-blue-500",   text: "text-blue-900 dark:text-blue-100"   },
  green:  { bg: "from-green-50 to-white dark:from-green-950/30 dark:to-slate-900", header: "from-green-700 to-green-800",   accent: "bg-green-500",  text: "text-green-900 dark:text-green-100" },
  purple: { bg: "from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-900",header:"from-purple-700 to-purple-800", accent: "bg-purple-500", text: "text-purple-900 dark:text-purple-100"},
  orange: { bg: "from-orange-50 to-white dark:from-orange-950/30 dark:to-slate-900",header:"from-orange-600 to-orange-700", accent: "bg-orange-500", text: "text-orange-900 dark:text-orange-100"},
  dark:   { bg: "from-slate-900 to-slate-800",                                     header: "from-indigo-600 to-indigo-700", accent: "bg-indigo-500", text: "text-slate-100"                       },
};

const slideTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  objectives: CheckCircle2, quiz: HelpCircle, discussion: MessageSquare,
  summary: List, references: BookOpen, title: Award,
};

function SlideImage({ url, alt }: { url: string; alt: string }) {
  return (
    <div className="relative w-full h-full bg-muted/30 rounded overflow-hidden flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
        }}
      />
      <div className="hidden absolute inset-0 flex flex-col items-center justify-center gap-1 bg-muted/40">
        <ImageIcon className="w-5 h-5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Image</span>
      </div>
    </div>
  );
}

export function SlidePreview({ slide, colorScheme = "blue", totalSlides }: SlidePreviewProps) {
  const scheme  = schemeGradients[colorScheme] ?? schemeGradients.blue;
  const TypeIcon = slideTypeIcons[slide.slideType];
  const hasImage = Boolean(slide.imageUrl);

  if (slide.slideType === "title") {
    return (
      <div className={cn("w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br flex flex-col relative shadow-lg border", scheme.bg)}>
        {/* Background image for title slide */}
        {hasImage && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.imageUrl!} alt={slide.title} className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60 dark:to-slate-900/60" />
          </div>
        )}
        <div className={cn("h-2 bg-gradient-to-r relative z-10", scheme.header)} />
        <div className="flex-1 flex flex-col items-center justify-center px-12 text-center gap-4 relative z-10">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", scheme.accent)}>
            <Award className="w-6 h-6 text-white" />
          </div>
          <h1 className={cn("text-3xl font-extrabold leading-tight", scheme.text)}>{slide.title}</h1>
          {slide.content.length > 0 && (
            <p className="text-muted-foreground text-sm">{slide.content.join(" · ")}</p>
          )}
        </div>
        <div className="flex items-center justify-between px-6 py-2 text-xs text-muted-foreground border-t relative z-10">
          <span>EduSlide AI</span>
          <span>{slide.slideNumber} / {totalSlides}</span>
        </div>
        <div className={cn("h-1.5 bg-gradient-to-r relative z-10", scheme.header)} />
      </div>
    );
  }

  return (
    <div className={cn("w-full aspect-video rounded-xl overflow-hidden flex flex-col shadow-lg border relative", "bg-gradient-to-br", scheme.bg)}>
      {/* Header bar */}
      <div className={cn("bg-gradient-to-r px-6 py-3", scheme.header)}>
        <div className="flex items-center gap-2 mb-0.5">
          {TypeIcon && <TypeIcon className="w-3.5 h-3.5 text-white/70" />}
          <span className="text-white/70 text-xs font-medium uppercase tracking-wide">{slide.slideType}</span>
        </div>
        <h2 className="text-white font-bold text-xl leading-tight line-clamp-2">{slide.title}</h2>
      </div>

      {/* Left accent */}
      <div className={cn("absolute left-0 top-[64px] bottom-8 w-1.5", scheme.accent)} />

      {/* Body: content + optional image */}
      <div className="flex-1 flex overflow-hidden">
        {/* Content bullets */}
        <div className={cn("flex-1 px-8 py-4 overflow-hidden", hasImage ? "w-[58%]" : "w-full")}>
          {slide.content.length > 0 ? (
            <ul className="space-y-2">
              {slide.content.slice(0, hasImage ? 4 : 6).map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", scheme.accent)} />
                  <span className={cn("text-sm leading-snug line-clamp-2", scheme.text)}>{item}</span>
                </li>
              ))}
              {slide.content.length > (hasImage ? 4 : 6) && (
                <li className="text-xs text-muted-foreground pl-4">
                  +{slide.content.length - (hasImage ? 4 : 6)} more
                </li>
              )}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm italic">No content added yet</p>
          )}
        </div>

        {/* Image panel */}
        {hasImage && (
          <div className="w-[42%] p-2 flex flex-col gap-1">
            <div className="flex-1 rounded overflow-hidden border border-black/5">
              <SlideImage url={slide.imageUrl!} alt={slide.title} />
            </div>
            {slide.imagePrompt && (
              <p className="text-[9px] text-muted-foreground line-clamp-1 px-0.5">{slide.imagePrompt}</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-2 text-xs text-muted-foreground border-t">
        <span>EduSlide AI</span>
        <span>{slide.slideNumber} / {totalSlides}</span>
      </div>
    </div>
  );
}
