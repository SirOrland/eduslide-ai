"use client";
import { useState, useEffect } from "react";
import { Save, RefreshCw, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { SlideRecord } from "@/types";

interface SlideEditorProps {
  slide: SlideRecord;
  presentationId: string;
  onUpdate: (updatedSlide: SlideRecord) => void;
}

export function SlideEditor({ slide, presentationId, onUpdate }: SlideEditorProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(slide.title);
  const [content, setContent] = useState<string[]>(slide.content);
  const [speakerNotes, setSpeakerNotes] = useState(slide.speakerNotes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenInstructions, setRegenInstructions] = useState("");

  useEffect(() => {
    setTitle(slide.title);
    setContent(slide.content);
    setSpeakerNotes(slide.speakerNotes || "");
  }, [slide.id, slide.title, slide.content, slide.speakerNotes]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/presentations/${presentationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slides: [{ slideId: slide.id, title, content, speakerNotes }],
        }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      const updatedSlide = data.presentation.slides.find((s: SlideRecord) => s.id === slide.id);
      if (updatedSlide) onUpdate(updatedSlide);

      toast({ title: "Saved", description: "Slide updated successfully." });
    } catch {
      toast({ title: "Save failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const res = await fetch(`/api/presentations/${presentationId}/regenerate-slide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slideId: slide.id, instructions: regenInstructions }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setTitle(data.slide.title);
      setContent(data.slide.content);
      setSpeakerNotes(data.slide.speakerNotes || "");
      onUpdate(data.slide);

      toast({ title: "Regenerated!", description: "Slide content updated with AI." });
      setRegenInstructions("");
    } catch {
      toast({ title: "Regeneration failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsRegenerating(false);
    }
  };

  const addBulletPoint = () => setContent([...content, ""]);
  const updateBulletPoint = (index: number, value: string) => {
    const updated = [...content];
    updated[index] = value;
    setContent(updated);
  };
  const removeBulletPoint = (index: number) => {
    setContent(content.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">
          Slide {slide.slideNumber} · <span className="capitalize text-muted-foreground">{slide.slideType}</span>
        </h3>
        <Button onClick={handleSave} size="sm" disabled={isSaving} variant="gradient">
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span className="ml-1">{isSaving ? "Saving..." : "Save"}</span>
        </Button>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs">AI Regen</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Slide Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Slide title..."
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Bullet Points</Label>
              <Button size="sm" variant="ghost" onClick={addBulletPoint} className="h-6 text-xs px-2">
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {content.map((bullet, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-3 flex-shrink-0" />
                  <Input
                    value={bullet}
                    onChange={(e) => updateBulletPoint(index, e.target.value)}
                    placeholder={`Bullet point ${index + 1}...`}
                    className="text-sm flex-1"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeBulletPoint(index)}
                    className="h-9 w-9 text-muted-foreground hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Speaker Notes</Label>
            <Textarea
              value={speakerNotes}
              onChange={(e) => setSpeakerNotes(e.target.value)}
              placeholder="Add speaker notes for this slide..."
              className="min-h-[160px] text-sm resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Notes are visible to you during presentation mode and exported with PPTX.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4 mt-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Regeneration Instructions (optional)</Label>
            <Textarea
              value={regenInstructions}
              onChange={(e) => setRegenInstructions(e.target.value)}
              placeholder="E.g., Make it more detailed, focus on examples, simplify for beginners..."
              className="min-h-[80px] text-sm resize-none"
            />
          </div>
          <Button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            variant="gradient"
            className="w-full"
          >
            {isRegenerating ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />Regenerating...</>
            ) : (
              <><RefreshCw className="w-3.5 h-3.5 mr-2" />Regenerate with AI</>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            AI will create new content for this slide based on the presentation context.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
