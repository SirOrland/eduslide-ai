import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700" />
        </div>

        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl relative z-10">
          <GraduationCap className="w-8 h-8 text-blue-400" />
          EduSlide AI
        </Link>

        <div className="relative z-10">
          <blockquote className="text-xl text-white font-light leading-relaxed mb-6">
            &ldquo;EduSlide AI saved me 3 hours of work every week. I upload my lesson plan and get
            beautiful slides in seconds.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
              SC
            </div>
            <div>
              <p className="text-white font-medium text-sm">Sarah Chen</p>
              <p className="text-blue-300 text-xs">High School Biology Teacher</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          {[
            { value: "50K+", label: "Slides Generated" },
            { value: "2K+", label: "Active Users" },
            { value: "4.9★", label: "User Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-blue-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <GraduationCap className="w-7 h-7 text-blue-500" />
              EduSlide AI
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
