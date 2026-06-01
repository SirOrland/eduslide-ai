"use client";
export const dynamic = 'force-dynamic';
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, FileDown, Loader2, ChevronLeft, ChevronRight, Presentation, Play, ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { SlideList } from "@/components/editor/slide-list";
import { SlidePreview } from "@/components/editor/slide-preview";
import { SlideEditor } from "@/components/editor/slide-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { PresentationWithSlides, SlideRecord } from "@/types";

export default function PresentationEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [presentation, setPresentation] = useState<PresentationWithSlides | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingHtml, setIsDownloadingHtml] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  useEffect(() => {
    fetch(`/api/presentations/${id}`)
      .then((r) => r.json())
      .then((d) => setPresentation(d.presentation))
      .catch(() => router.push("/presentations"))
      .finally(() => setIsLoading(false));
  }, [id, router]);

  const handleSlideUpdate = (updatedSlide: SlideRecord) => {
    setPresentation((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        slides: prev.slides.map((s) => (s.id === updatedSlide.id ? updatedSlide : s)),
      };
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch(`/api/presentations/${id}/export`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${presentation?.title?.replace(/[^a-z0-9]/gi, "_") || "presentation"}.pptx`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Downloaded!", description: "Your PPTX file is ready." });
    } catch {
      toast({ title: "Download failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerateImages = async () => {
    setIsGeneratingImages(true);
    try {
      const cfg = (presentation?.animationConfig as any) ?? {};
      const res = await fetch(`/api/presentations/${id}/generate-images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageMode:  cfg.imageMode  ?? "auto",
          imageStyle: cfg.imageStyle ?? "educational",
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPresentation(data.presentation);
      toast({ title: "Images generated!", description: "Slides updated with contextual images." });
    } catch {
      toast({ title: "Image generation failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsGeneratingImages(false);
    }
  };

  const handleDownloadHtml = async () => {
    setIsDownloadingHtml(true);
    try {
      const res = await fetch(`/api/presentations/${id}/export/html`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${presentation?.title?.replace(/[^a-z0-9]/gi, "_") || "presentation"}.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "HTML exported!", description: "Open the file in any browser to present." });
    } catch {
      toast({ title: "Export failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsDownloadingHtml(false);
    }
  };

  const goToPrevSlide = () => setActiveSlideIndex((i) => Math.max(0, i - 1));
  const goToNextSlide = () =>
    setActiveSlideIndex((i) => Math.min((presentation?.slides.length || 1) - 1, i + 1));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Presentation not found</p>
        <Button asChild className="mt-4">
          <Link href="/presentations">Back to Presentations</Link>
        </Button>
      </div>
    );
  }

  const activeSlide = presentation.slides[activeSlideIndex];

  return (
    <div className="flex flex-col h-full -m-6">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-card flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link href="/presentations">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <div>
            <h1 className="font-semibold text-sm">{presentation.title}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs capitalize h-4 px-1.5">
                {presentation.theme}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Presentation className="w-3 h-3" />
                {presentation.slides.length} slides
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/presentations/${id}/present`}>
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Present
            </Link>
          </Button>
          <Button
            onClick={handleGenerateImages}
            disabled={isGeneratingImages}
            variant="outline"
            size="sm"
          >
            {isGeneratingImages ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Generating...</>
            ) : (
              <><ImageIcon className="w-3.5 h-3.5 mr-1.5" />Images</>
            )}
          </Button>
          <Button
            onClick={handleDownloadHtml}
            disabled={isDownloadingHtml}
            variant="outline"
            size="sm"
          >
            {isDownloadingHtml ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Exporting...</>
            ) : (
              <><FileDown className="w-3.5 h-3.5 mr-1.5" />HTML</>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            variant="gradient"
            size="sm"
          >
            {isDownloading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Generating...</>
            ) : (
              <><FileDown className="w-3.5 h-3.5 mr-1.5" />PPTX</>
            )}
          </Button>
        </div>
      </div>

      {/* Editor content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Slide list sidebar */}
        <div className="w-52 border-r flex-shrink-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="py-2">
              <p className="px-3 text-xs font-medium text-muted-foreground mb-2">
                SLIDES ({presentation.slides.length})
              </p>
              <SlideList
                slides={presentation.slides}
                activeSlideIndex={activeSlideIndex}
                onSelectSlide={setActiveSlideIndex}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Main preview area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div className="w-full max-w-3xl">
              <SlidePreview
                slide={activeSlide}
                colorScheme={presentation.colorScheme}
                totalSlides={presentation.slides.length}
              />

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevSlide}
                  disabled={activeSlideIndex === 0}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {activeSlideIndex + 1} / {presentation.slides.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextSlide}
                  disabled={activeSlideIndex === presentation.slides.length - 1}
                  className="h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit panel */}
        <div className="w-80 border-l flex-shrink-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              <SlideEditor
                key={activeSlide?.id}
                slide={activeSlide}
                presentationId={presentation.id}
                onUpdate={handleSlideUpdate}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
