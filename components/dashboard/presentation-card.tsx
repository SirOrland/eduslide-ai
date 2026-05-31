"use client";
import Link from "next/link";
import { useState } from "react";
import { MoreVertical, FileDown, Edit, Trash2, Presentation, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, truncate } from "@/lib/utils";
import type { PresentationWithSlides } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface PresentationCardProps {
  presentation: PresentationWithSlides;
  onDelete: (id: string) => void;
}

const themeColors: Record<string, string> = {
  educational: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
  professional: "text-purple-600 bg-purple-50 dark:bg-purple-950/30",
  minimal: "text-slate-600 bg-slate-50 dark:bg-slate-950/30",
  corporate: "text-green-600 bg-green-50 dark:bg-green-950/30",
};

export function PresentationCard({ presentation, onDelete }: PresentationCardProps) {
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch(`/api/presentations/${presentation.id}/export`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${presentation.title.replace(/[^a-z0-9]/gi, "_")}.pptx`;
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: "Downloaded!", description: "Your PPTX file is ready.", variant: "success" } as Parameters<typeof toast>[0]);
    } catch {
      toast({ title: "Download failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this presentation?")) return;
    try {
      const res = await fetch(`/api/presentations/${presentation.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onDelete(presentation.id);
      toast({ title: "Deleted", description: "Presentation deleted." });
    } catch {
      toast({ title: "Error", description: "Could not delete presentation.", variant: "destructive" });
    }
  };

  return (
    <div className="group relative bg-card border rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
            <Presentation className="w-5 h-5 text-primary" />
          </div>
          <div>
            <Badge
              variant="outline"
              className={`text-xs capitalize ${themeColors[presentation.theme] || ""}`}
            >
              {presentation.theme}
            </Badge>
          </div>
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 bg-popover border rounded-lg shadow-lg py-1 w-44">
              <Link
                href={`/presentations/${presentation.id}`}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full"
                onClick={() => setMenuOpen(false)}
              >
                <Edit className="w-3.5 h-3.5" />
                Open Editor
              </Link>
              <button
                onClick={() => { handleDownload(); setMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full"
              >
                <FileDown className="w-3.5 h-3.5" />
                Download PPTX
              </button>
              <button
                onClick={() => { handleDelete(); setMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <Link href={`/presentations/${presentation.id}`}>
        <h3 className="font-semibold text-sm mb-1 hover:text-primary transition-colors line-clamp-2">
          {presentation.title}
        </h3>
      </Link>

      {presentation.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {truncate(presentation.description, 80)}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Presentation className="w-3 h-3" />
          <span>{presentation.slideCount} slides</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{formatRelativeTime(presentation.createdAt)}</span>
        </div>
      </div>

      {/* Quick download button */}
      <Button
        size="sm"
        variant="outline"
        className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        <FileDown className="w-3 h-3 mr-1" />
        {isDownloading ? "Downloading..." : "Download PPTX"}
      </Button>
    </div>
  );
}
