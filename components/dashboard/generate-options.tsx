"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRESENTATION_THEMES, COLOR_SCHEMES, FONT_STYLES } from "@/types";

const optionsSchema = z.object({
  numSlides: z.coerce.number().min(3).max(30),
  theme: z.enum(["educational", "professional", "minimal", "corporate"]),
  colorScheme: z.string(),
  fontStyle: z.string(),
  includeQuiz: z.boolean(),
  includeDiscussion: z.boolean(),
  includeSummary: z.boolean(),
  includeReferences: z.boolean(),
  language: z.string(),
});

type OptionsFormData = z.infer<typeof optionsSchema>;

interface GenerateOptionsProps {
  onGenerate: (options: OptionsFormData) => void;
  isGenerating: boolean;
  fileInfo: { wordCount: number; estimatedSlides: number } | null;
}

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Portuguese",
  "Italian", "Chinese", "Japanese", "Arabic", "Hindi",
];

export function GenerateOptions({ onGenerate, isGenerating, fileInfo }: GenerateOptionsProps) {
  const { register, handleSubmit, watch, setValue } = useForm<OptionsFormData>({
    resolver: zodResolver(optionsSchema),
    defaultValues: {
      numSlides: fileInfo?.estimatedSlides || 10,
      theme: "educational",
      colorScheme: "blue",
      fontStyle: "modern",
      includeQuiz: true,
      includeDiscussion: true,
      includeSummary: true,
      includeReferences: false,
      language: "English",
    },
  });

  const watchedValues = watch();

  return (
    <form onSubmit={handleSubmit(onGenerate)} className="space-y-6">
      {fileInfo && (
        <div className="bg-muted/50 rounded-lg p-4 text-sm flex gap-4">
          <div>
            <span className="text-muted-foreground">Words: </span>
            <span className="font-medium">{fileInfo.wordCount.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Suggested slides: </span>
            <span className="font-medium">{fileInfo.estimatedSlides}</span>
          </div>
        </div>
      )}

      {/* Slide count */}
      <div className="space-y-2">
        <Label>Number of Slides: <span className="font-semibold text-primary">{watchedValues.numSlides}</span></Label>
        <input
          type="range"
          min={3}
          max={30}
          step={1}
          {...register("numSlides")}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>3 (Brief)</span>
          <span>15 (Standard)</span>
          <span>30 (Detailed)</span>
        </div>
      </div>

      {/* Theme */}
      <div className="space-y-2">
        <Label>Presentation Theme</Label>
        <div className="grid grid-cols-2 gap-2">
          {PRESENTATION_THEMES.map((theme) => (
            <label
              key={theme.id}
              className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-all ${
                watchedValues.theme === theme.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input type="radio" value={theme.id} {...register("theme")} className="sr-only" />
              <span className="font-medium text-sm">{theme.name}</span>
              <span className="text-xs text-muted-foreground">{theme.description}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Scheme */}
      <div className="space-y-2">
        <Label>Color Scheme</Label>
        <Select value={watchedValues.colorScheme} onValueChange={(v) => setValue("colorScheme", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COLOR_SCHEMES.map((scheme) => (
              <SelectItem key={scheme.id} value={scheme.id}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${scheme.primary}` }} />
                  {scheme.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Style */}
      <div className="space-y-2">
        <Label>Font Style</Label>
        <Select value={watchedValues.fontStyle} onValueChange={(v) => setValue("fontStyle", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_STYLES.map((font) => (
              <SelectItem key={font.id} value={font.id}>{font.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <Label>Language</Label>
        <Select value={watchedValues.language} onValueChange={(v) => setValue("language", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* AI Extras */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">AI-Generated Extras</Label>
        {[
          { name: "includeQuiz" as const, label: "Quiz Questions", description: "Generate assessment questions" },
          { name: "includeDiscussion" as const, label: "Discussion Questions", description: "Engage learners with discussion prompts" },
          { name: "includeSummary" as const, label: "Summary Slide", description: "Add a key takeaways slide" },
          { name: "includeReferences" as const, label: "References Slide", description: "Include a references/sources slide" },
        ].map((item) => (
          <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <Switch
              checked={watchedValues[item.name]}
              onCheckedChange={(v) => setValue(item.name, v)}
            />
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full" size="lg" variant="gradient" disabled={isGenerating}>
        {isGenerating ? (
          <><Loader2 className="w-4 h-4 animate-spin mr-2" />Generating Presentation...</>
        ) : (
          <><Wand2 className="w-4 h-4 mr-2" />Generate Presentation</>
        )}
      </Button>
    </form>
  );
}
