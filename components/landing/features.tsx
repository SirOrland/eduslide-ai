"use client";
import { motion } from "framer-motion";
import {
  FileText, Brain, Presentation, Download, Palette, MessageSquare,
  BookOpen, BarChart3, Wand2, Globe,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Multi-Format Upload",
    description: "Upload PDF, DOCX, TXT, PPT, and more. Our parser extracts content with high accuracy.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "GPT-4o analyzes your document to detect key concepts, objectives, and structure.",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: Presentation,
    title: "Professional Slides",
    description: "Auto-generate presentation slides with titles, bullet points, and visual layout.",
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: MessageSquare,
    title: "Speaker Notes",
    description: "Each slide comes with AI-generated speaker notes to guide your presentation.",
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    icon: BookOpen,
    title: "Quiz Generation",
    description: "Automatically create quiz questions and discussion prompts from your content.",
    color: "text-pink-500",
    bg: "bg-pink-50 dark:bg-pink-950/30",
  },
  {
    icon: Palette,
    title: "Theme Customization",
    description: "Choose from 4 professional themes, 5 color schemes, and multiple font styles.",
    color: "text-teal-500",
    bg: "bg-teal-50 dark:bg-teal-950/30",
  },
  {
    icon: Download,
    title: "PPTX Export",
    description: "Download real PowerPoint files (.pptx) with slides, notes, and formatting intact.",
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950/30",
  },
  {
    icon: Wand2,
    title: "Slide Editor",
    description: "Edit any slide content, regenerate individual slides, and fine-tune your presentation.",
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    icon: BarChart3,
    title: "Presentation Dashboard",
    description: "Manage all your presentations, track usage, and access your history anytime.",
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Generate presentations in multiple languages to reach global audiences.",
    color: "text-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-background" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span
            className="text-sm font-semibold text-primary uppercase tracking-widest"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Everything You Need
          </motion.span>
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Powerful Features for Educators
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            From upload to download, EduSlide AI handles every step of creating
            professional educational presentations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
