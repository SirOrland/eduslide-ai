"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import type { PresentationWithSlides, SlideRecord, SlideAnimationData, AnimationConfig } from "@/types";
import { cn } from "@/lib/utils";

const SCHEME_COLORS: Record<string, { bg: string; header: string; accent: string; text: string }> = {
  blue:   { bg: "#EFF6FF", header: "#1E40AF", accent: "#3B82F6", text: "#1E3A5F" },
  green:  { bg: "#F0FDF4", header: "#166534", accent: "#22C55E", text: "#14532D" },
  purple: { bg: "#FAF5FF", header: "#6B21A8", accent: "#A855F7", text: "#581C87" },
  orange: { bg: "#FFF7ED", header: "#C2410C", accent: "#F97316", text: "#7C2D12" },
  dark:   { bg: "#111827", header: "#4338CA", accent: "#6366F1", text: "#F9FAFB" },
};

function getTransitionVariants(type: string, dir: number) {
  switch (type) {
    case "zoom":
      return {
        initial: { opacity: 0, scale: dir > 0 ? 0.88 : 1.12 },
        animate: { opacity: 1, scale: 1 },
        exit:    { opacity: 0, scale: dir > 0 ? 1.12 : 0.88 },
      };
    case "push":
      return {
        initial: { opacity: 0, x: dir > 0 ? "100%" : "-100%" },
        animate: { opacity: 1, x: 0 },
        exit:    { opacity: 0, x: dir > 0 ? "-60%" : "60%" },
      };
    case "morph":
      return {
        initial: { opacity: 0, scale: 0.94, filter: "blur(14px)" },
        animate: { opacity: 1, scale: 1,    filter: "blur(0px)" },
        exit:    { opacity: 0, scale: 1.06, filter: "blur(14px)" },
      };
    case "reveal":
      return {
        initial: { opacity: 0, y: dir > 0 ? 40 : -40 },
        animate: { opacity: 1, y: 0 },
        exit:    { opacity: 0, y: dir > 0 ? -30 : 30 },
      };
    case "wipe":
      return {
        initial: { opacity: 0, x: dir > 0 ? 50 : -50 },
        animate: { opacity: 1, x: 0 },
        exit:    { opacity: 0, x: dir > 0 ? -50 : 50 },
      };
    default: // fade
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit:    { opacity: 0 },
      };
  }
}

function getElementAnim(effect: string, delay: number, speed: string) {
  const dur = speed === "slow" ? 0.85 : speed === "fast" ? 0.28 : 0.55;
  const base: Record<string, { initial: object; animate: object }> = {
    fadeIn:       { initial: { opacity: 0 },              animate: { opacity: 1 } },
    slideInLeft:  { initial: { opacity: 0, x: -45 },      animate: { opacity: 1, x: 0 } },
    slideInRight: { initial: { opacity: 0, x: 45 },       animate: { opacity: 1, x: 0 } },
    slideInUp:    { initial: { opacity: 0, y: 30 },        animate: { opacity: 1, y: 0 } },
    zoomIn:       { initial: { opacity: 0, scale: 0.72 }, animate: { opacity: 1, scale: 1 } },
    bounceIn:     { initial: { opacity: 0, scale: 0.4 },  animate: { opacity: 1, scale: 1 } },
    typewriter:   { initial: { opacity: 0 },              animate: { opacity: 1 } },
  };
  const a = base[effect] ?? base.fadeIn;
  return { ...a, transition: { duration: dur, delay, ease: "easeOut" } };
}

interface PresentationPlayerProps {
  presentation: PresentationWithSlides;
  onClose: () => void;
}

export function PresentationPlayer({ presentation, onClose }: PresentationPlayerProps) {
  const [index, setIndex]               = useState(0);
  const [dir, setDir]                   = useState(1);
  const [storytelling, setStorytelling] = useState(false);
  const [revealed, setRevealed]         = useState(Infinity);

  const slide       = presentation.slides[index];
  const animData    = slide?.animationData as SlideAnimationData | null;
  const animCfg     = presentation.animationConfig as AnimationConfig | null;
  const level       = animCfg?.animationLevel ?? "medium";
  const speed       = animCfg?.animationSpeed  ?? "normal";
  const transition  = animCfg?.transitionStyle !== "automatic"
    ? (animCfg?.transitionStyle ?? "fade")
    : (animData?.transition ?? "fade");

  const transDur = speed === "slow" ? 0.75 : speed === "fast" ? 0.28 : 0.45;
  const colors   = SCHEME_COLORS[presentation.colorScheme] ?? SCHEME_COLORS.blue;
  const vars     = getTransitionVariants(transition, dir);

  useEffect(() => {
    setRevealed(storytelling ? 0 : Infinity);
  }, [index, storytelling]);

  const goNext = useCallback(() => {
    if (storytelling && revealed < (slide?.content.length ?? 0)) {
      setRevealed((r) => r + 1);
      return;
    }
    if (index < presentation.slides.length - 1) {
      setDir(1);
      setIndex((i) => i + 1);
    }
  }, [index, storytelling, revealed, slide?.content.length, presentation.slides.length]);

  const goPrev = useCallback(() => {
    if (index > 0) { setDir(-1); setIndex((i) => i - 1); }
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")  { e.preventDefault(); goPrev(); }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onClose]);

  const getElemAnim = (elemName: string, fallbackEffect: string, fallbackDelay: number) => {
    if (level === "none") return {};
    const found = animData?.animationSequence?.find((a) => a.element === elemName);
    return getElementAnim(found?.effect ?? fallbackEffect, found?.delay ?? fallbackDelay, speed);
  };

  const cameraEffect = animData?.cameraEffect;
  const cameraInitial =
    cameraEffect === "zoom" ? { scale: 1.07 } :
    cameraEffect === "pan"  ? { x: 18 } : {};

  if (!slide) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col select-none">
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center gap-4 px-6 py-4
                      bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <button
          onClick={() => setStorytelling((s) => !s)}
          className={cn(
            "pointer-events-auto text-xs px-3 py-1.5 rounded-full border transition-all",
            storytelling
              ? "bg-white text-black border-white font-semibold"
              : "text-white/60 border-white/25 hover:border-white/50 hover:text-white/80"
          )}
        >
          <BookOpen className="w-3 h-3 inline mr-1.5" />
          Storytelling
        </button>

        <div className="flex-1">
          <div className="h-0.5 bg-white/15 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/80 rounded-full"
              animate={{ width: `${((index + 1) / presentation.slides.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-center text-white/40 text-xs mt-1">
            {index + 1} / {presentation.slides.length}
          </p>
        </div>

        <button
          onClick={onClose}
          className="pointer-events-auto p-2 rounded-full text-white/60 hover:text-white
                     hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Slide canvas */}
      <div className="flex-1 flex items-center justify-center px-16 py-20 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={slide.id}
            initial={vars.initial}
            animate={{ ...vars.animate, transition: { duration: transDur, ease: "easeOut" } }}
            exit={{ ...vars.exit, transition: { duration: transDur * 0.7, ease: "easeIn" } }}
            className="w-full max-w-5xl"
          >
            <motion.div
              initial={cameraInitial}
              animate={{ scale: 1, x: 0 }}
              transition={{ duration: transDur + 1, ease: "easeOut" }}
            >
              {slide.slideType === "title" ? (
                <TitleSlide slide={slide} colors={colors} getElemAnim={getElemAnim} level={level} totalSlides={presentation.slides.length} />
              ) : (
                <ContentSlide
                  slide={slide}
                  colors={colors}
                  getElemAnim={getElemAnim}
                  level={level}
                  speed={speed}
                  revealed={revealed}
                  storytelling={storytelling}
                  totalSlides={presentation.slides.length}
                />
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 inset-x-0 z-10 flex items-center justify-center gap-5 py-5
                      bg-gradient-to-t from-black/70 to-transparent">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-25 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-1.5">
          {presentation.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
              className={cn(
                "rounded-full transition-all duration-300",
                i === index ? "bg-white w-5 h-2" : "bg-white/35 w-2 h-2 hover:bg-white/55"
              )}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={
            index === presentation.slides.length - 1 &&
            (!storytelling || revealed >= (slide?.content.length ?? 0))
          }
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-25 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function SlideImage({ url, alt, className }: { url: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={cn("object-cover", className)}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

function TitleSlide({ slide, colors, getElemAnim, level, totalSlides }: {
  slide: SlideRecord;
  colors: typeof SCHEME_COLORS.blue;
  getElemAnim: (name: string, effect: string, delay: number) => object;
  level: string;
  totalSlides: number;
}) {
  const hasImage = Boolean(slide.imageUrl);
  return (
    <div
      className="w-full aspect-video rounded-2xl overflow-hidden flex flex-col relative shadow-2xl"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Background image overlay for title slides */}
      {hasImage && (
        <div className="absolute inset-0 z-0">
          <SlideImage url={slide.imageUrl!} alt={slide.title} className="w-full h-full opacity-20" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent, ${colors.bg}cc)` }} />
        </div>
      )}

      <div className="h-2 relative z-10" style={{ background: `linear-gradient(90deg, ${colors.header}, ${colors.accent})` }} />

      <div className="flex-1 flex flex-col items-center justify-center px-16 text-center gap-5 relative z-10">
        {level !== "none" && (
          <motion.div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl"
            style={{ backgroundColor: colors.accent }}
            {...getElemAnim("icon", "zoomIn", 0)}
          >
            ⭐
          </motion.div>
        )}

        <motion.h1
          className="text-5xl font-extrabold leading-tight"
          style={{ color: colors.text }}
          {...getElemAnim("title", "fadeIn", level !== "none" ? 0.25 : 0)}
        >
          {slide.title}
        </motion.h1>

        {slide.content.length > 0 && (
          <motion.p
            className="text-lg opacity-65"
            style={{ color: colors.text }}
            {...getElemAnim("subtitle", "slideInUp", level !== "none" ? 0.55 : 0)}
          >
            {slide.content.join(" · ")}
          </motion.p>
        )}
      </div>

      <div className="flex items-center justify-between px-8 py-2.5 border-t border-black/5 text-xs opacity-40 relative z-10"
           style={{ color: colors.text }}>
        <span>EduSlide AI</span>
        <span>{slide.slideNumber} / {totalSlides}</span>
      </div>

      <div className="h-1.5 relative z-10" style={{ background: `linear-gradient(90deg, ${colors.header}, ${colors.accent})` }} />
    </div>
  );
}

function ContentSlide({ slide, colors, getElemAnim, level, speed, revealed, storytelling, totalSlides }: {
  slide: SlideRecord;
  colors: typeof SCHEME_COLORS.blue;
  getElemAnim: (name: string, effect: string, delay: number) => object;
  level: string;
  speed: string;
  revealed: number;
  storytelling: boolean;
  totalSlides: number;
}) {
  const bulletDur = speed === "slow" ? 0.65 : speed === "fast" ? 0.22 : 0.42;
  const hasImage  = Boolean(slide.imageUrl);
  const maxBullets = hasImage ? 4 : 6;

  return (
    <div
      className="w-full aspect-video rounded-2xl overflow-hidden flex flex-col relative shadow-2xl"
      style={{ backgroundColor: colors.bg }}
    >
      <motion.div
        className="px-10 py-5"
        style={{ background: `linear-gradient(135deg, ${colors.header}f0, ${colors.header}cc)` }}
        {...getElemAnim("header", "slideInLeft", 0)}
      >
        <span className="text-white/55 text-xs uppercase tracking-widest font-medium">{slide.slideType}</span>
        <h2 className="text-white font-bold text-3xl leading-tight mt-0.5 line-clamp-2">{slide.title}</h2>
      </motion.div>

      <div className="absolute left-0 top-[86px] bottom-10 w-1.5 rounded-r-full" style={{ backgroundColor: colors.accent }} />

      {/* Body: bullets + optional image */}
      <div className="flex-1 flex overflow-hidden">
        {/* Bullets */}
        <div className={cn("py-5 overflow-hidden", hasImage ? "w-[56%] pl-14 pr-4" : "flex-1 px-14")}>
          <ul className="space-y-3">
            {slide.content.slice(0, maxBullets).map((item, i) => {
              const visible = !storytelling || i < revealed;
              return (
                <AnimatePresence key={i}>
                  {visible && (
                    <motion.li
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -25 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: bulletDur,
                        delay: storytelling ? 0 : (level !== "none" ? i * 0.13 : 0),
                        ease: "easeOut",
                      }}
                    >
                      <div className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0" style={{ backgroundColor: colors.accent }} />
                      <span className="text-lg leading-snug" style={{ color: colors.text }}>{item}</span>
                    </motion.li>
                  )}
                </AnimatePresence>
              );
            })}
          </ul>

          {storytelling && revealed < slide.content.length && (
            <motion.p
              className="text-sm opacity-35 mt-4 text-center"
              style={{ color: colors.text }}
              animate={{ opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              Press Space or → for next point
            </motion.p>
          )}
        </div>

        {/* Image panel */}
        {hasImage && (
          <motion.div
            className="w-[44%] p-3 flex flex-col gap-1.5"
            {...getElemAnim("image", "fadeIn", level !== "none" ? 0.4 : 0)}
          >
            <div className="flex-1 rounded-xl overflow-hidden shadow-md border border-white/20">
              <SlideImage url={slide.imageUrl!} alt={slide.title} className="w-full h-full" />
            </div>
            {slide.imagePrompt && (
              <p className="text-xs opacity-40 line-clamp-1 text-center" style={{ color: colors.text }}>
                {slide.imagePrompt.split(",")[0]}
              </p>
            )}
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-between px-8 py-2.5 border-t text-xs opacity-35"
           style={{ color: colors.text, borderColor: `${colors.text}20` }}>
        <span>EduSlide AI</span>
        <span>{slide.slideNumber} / {totalSlides}</span>
      </div>
    </div>
  );
}
