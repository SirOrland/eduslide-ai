"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Upload, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-blue-500/20 text-blue-200 border-blue-500/30 hover:bg-blue-500/30 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Powered by GPT-4o AI
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Turn Documents Into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Stunning Slides
            </span>{" "}
            in Seconds
          </motion.h1>

          <motion.p
            className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Upload any PDF, DOCX, or TXT file and let AI transform it into a professional
            PowerPoint presentation with slides, speaker notes, quiz questions, and more.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button asChild size="xl" variant="gradient" className="group">
              <Link href="/register">
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white">
              <Link href="/login">Sign In</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[
              { label: "Slides Generated", value: "50K+" },
              { label: "Active Users", value: "2K+" },
              { label: "File Formats", value: "6+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Demo preview card */}
        <motion.div
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-sm text-slate-400">EduSlide AI — Presentation Generator</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload area */}
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <p className="text-slate-300 font-medium">Drop your document here</p>
                <p className="text-slate-500 text-sm mt-1">PDF, DOCX, TXT, PPT — up to 10MB</p>
              </div>

              {/* Slide preview mock */}
              <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-blue-300 font-medium">AI Generated</span>
                </div>
                <div className="h-3 bg-white/30 rounded-full w-3/4" />
                <div className="h-2 bg-white/20 rounded-full w-full" />
                <div className="h-2 bg-white/20 rounded-full w-5/6" />
                <div className="h-2 bg-white/20 rounded-full w-4/5" />
                <div className="h-2 bg-white/20 rounded-full w-3/4" />
                <div className="flex gap-2 mt-4">
                  {["Slide 1", "Slide 2", "Slide 3"].map((s) => (
                    <div key={s} className="h-8 flex-1 bg-white/10 rounded text-xs text-blue-200 flex items-center justify-center">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
