import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white mb-3">
              <GraduationCap className="w-6 h-6 text-blue-400" />
              EduSlide AI
            </Link>
            <p className="text-sm leading-relaxed">
              Transform educational documents into professional PowerPoint presentations with AI.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              {[["Features", "#features"], ["Pricing", "#pricing"], ["Dashboard", "/dashboard"]].map(([label, href]) => (
                <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              {[["Sign In", "/login"], ["Register", "/register"], ["Profile", "/profile"]].map(([label, href]) => (
                <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <li key={item}><span className="hover:text-white transition-colors cursor-pointer">{item}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm">© {new Date().getFullYear()} EduSlide AI. All rights reserved.</p>
          <p className="text-sm">Built with Next.js 15 · Powered by OpenAI GPT-4o</p>
        </div>
      </div>
    </footer>
  );
}
