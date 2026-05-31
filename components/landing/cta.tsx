"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of educators who save hours every week creating
            professional presentations with EduSlide AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="xl" className="bg-white text-blue-700 hover:bg-blue-50 font-bold group">
              <Link href="/register">
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-white/40 text-white hover:bg-white/10">
              <Link href="#features">See All Features</Link>
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-6">No credit card required · Free forever plan available</p>
        </motion.div>
      </div>
    </section>
  );
}
