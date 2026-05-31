"use client";
import { cn } from "@/lib/utils";
import type { SlideRecord } from "@/types";
import { Badge } from "@/components/ui/badge";

interface SlideListProps {
  slides: SlideRecord[];
  activeSlideIndex: number;
  onSelectSlide: (index: number) => void;
}

const slideTypeColors: Record<string, string> = {
  title: "bg-blue-500",
  objectives: "bg-green-500",
  content: "bg-slate-400",
  quiz: "bg-orange-500",
  discussion: "bg-purple-500",
  summary: "bg-teal-500",
  references: "bg-gray-500",
};

export function SlideList({ slides, activeSlideIndex, onSelectSlide }: SlideListProps) {
  return (
    <div className="flex flex-col gap-2 p-3">
      {slides.map((slide, index) => (
        <button
          key={slide.id}
          onClick={() => onSelectSlide(index)}
          className={cn(
            "group relative w-full text-left rounded-lg border p-3 transition-all hover:shadow-sm",
            activeSlideIndex === index
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-border hover:border-primary/40 hover:bg-muted/50"
          )}
        >
          {/* Slide number */}
          <span className="absolute top-2 left-2 text-xs text-muted-foreground font-mono">
            {slide.slideNumber}
          </span>

          {/* Type indicator dot */}
          <div className="flex items-center justify-end mb-1">
            <div className={cn("w-2 h-2 rounded-full", slideTypeColors[slide.slideType] || "bg-slate-400")} />
          </div>

          {/* Mini slide preview */}
          <div className="bg-muted rounded overflow-hidden aspect-video mb-2 flex flex-col p-1.5 gap-1">
            <div className={cn(
              "h-1.5 rounded-full",
              slide.slideType === "title" ? "w-3/4 bg-primary/60" : "w-1/2 bg-foreground/30"
            )} />
            {slide.slideType !== "title" && slide.content.slice(0, 3).map((_, i) => (
              <div key={i} className={`h-1 rounded-full bg-foreground/20`} style={{ width: `${80 - i * 15}%` }} />
            ))}
          </div>

          <p className="text-xs font-medium line-clamp-2 leading-tight">{slide.title}</p>

          <Badge
            variant="outline"
            className="mt-1.5 text-[10px] px-1.5 py-0 h-4 capitalize"
          >
            {slide.slideType}
          </Badge>
        </button>
      ))}
    </div>
  );
}
