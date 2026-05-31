"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-800"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
          <GraduationCap className="w-7 h-7 text-blue-400" />
          <span>EduSlide <span className="text-blue-400">AI</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[["Features", "#features"], ["Pricing", "#pricing"], ["Testimonials", "#testimonials"]].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild variant="gradient" size="sm">
            <Link href="/register">Get Started Free</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 flex flex-col gap-4">
          {[["Features", "#features"], ["Pricing", "#pricing"], ["Testimonials", "#testimonials"]].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-slate-300 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
            <Button asChild variant="outline" className="border-slate-700 text-slate-300">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild variant="gradient">
              <Link href="/register">Get Started Free</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
