"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Wand2, Sparkles, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRESENTATION_THEMES, COLOR_SCHEMES, FONT_STYLES, ANIMATION_STYLES, IMAGE_STYLES } from "@/types";

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
  animationLevel: z.enum(["none", "low", "medium", "high"]),
  presentationStyle: z.enum(["educational", "business", "marketing", "conference"]),
  transitionStyle: z.string(),
  animationSpeed: z.enum(["slow", "normal", "fast"]),
  imageMode: z.enum(["auto", "search", "generate", "none"]),
  imageStyle: z.enum(["realistic", "infographic", "educational", "minimalist"]),
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

const TRANSITIONS = [
  { id: "automatic", name: "Auto (AI Picks)" },
  { id: "fade", name: "Fade" },
  { id: "morph", name: "Morph" },
  { id: "zoom", name: "Zoom" },
  { id: "push", name: "Push" },
  { id: "reveal", name: "Reveal" },
  { id: "wipe", name: "Wipe" },
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
      animationLevel: "medium",
      presentationStyle: "educational",
      transitionStyle: "automatic",
      animationSpeed: "normal",
      imageMode: "auto",
      imageStyle: "educational",
    },
  });

  const watchedValues = watch();

  const handleFormSubmit = (data: OptionsFormData) => {
    onGenerate(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

      {/* Animation Engine */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          AI Animation Engine
        </Label>

        {/* Animation Style */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Presentation Style</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {ANIMATION_STYLES.map((style) => (
              <label
                key={style.id}
                className={`flex flex-col p-2.5 rounded-lg border cursor-pointer transition-all ${
                  watchedValues.presentationStyle === style.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input type="radio" value={style.id} {...register("presentationStyle")} className="sr-only" />
                <span className="font-medium text-xs">{style.name}</span>
                <span className="text-xs text-muted-foreground leading-tight">{style.description}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Animation Level */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Animation Level</Label>
          <div className="grid grid-cols-4 gap-1.5">
            {(["none", "low", "medium", "high"] as const).map((level) => (
              <label
                key={level}
                className={`text-center p-2 rounded-lg border cursor-pointer transition-all text-xs font-medium capitalize ${
                  watchedValues.animationLevel === level
                    ? "border-primary bg-primary/5 ring-1 ring-primary text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input type="radio" value={level} {...register("animationLevel")} className="sr-only" />
                {level}
              </label>
            ))}
          </div>
        </div>

        {/* Transition & Speed */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Transition</Label>
            <Select value={watchedValues.transitionStyle} onValueChange={(v) => setValue("transitionStyle", v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSITIONS.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="text-xs">{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Speed</Label>
            <Select value={watchedValues.animationSpeed} onValueChange={(v) => setValue("animationSpeed", v as any)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow" className="text-xs">Slow</SelectItem>
                <SelectItem value="normal" className="text-xs">Normal</SelectItem>
                <SelectItem value="fast" className="text-xs">Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Image Engine */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-primary" />
          Smart Image Assistant
        </Label>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Image Mode</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {([
              { id: "auto",     label: "Auto",          desc: "Search first, generate if needed" },
              { id: "search",   label: "Search Only",   desc: "Openverse CC-licensed photos" },
              { id: "generate", label: "AI Generate",   desc: "Pollinations.ai illustrations" },
              { id: "none",     label: "No Images",     desc: "Text-only slides" },
            ] as const).map((m) => (
              <label
                key={m.id}
                className={`flex flex-col p-2.5 rounded-lg border cursor-pointer transition-all ${
                  watchedValues.imageMode === m.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input type="radio" value={m.id} {...register("imageMode")} className="sr-only" />
                <span className="font-medium text-xs">{m.label}</span>
                <span className="text-xs text-muted-foreground leading-tight">{m.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {watchedValues.imageMode !== "none" && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Image Style</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {IMAGE_STYLES.map((s) => (
                <label
                  key={s.id}
                  className={`flex flex-col p-2.5 rounded-lg border cursor-pointer transition-all ${
                    watchedValues.imageStyle === s.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input type="radio" value={s.id} {...register("imageStyle")} className="sr-only" />
                  <span className="font-medium text-xs">{s.name}</span>
                  <span className="text-xs text-muted-foreground leading-tight">{s.description}</span>
                </label>
              ))}
            </div>
          </div>
        )}
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
