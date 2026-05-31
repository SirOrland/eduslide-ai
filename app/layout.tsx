import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "EduSlide AI — AI-Powered Presentation Generator",
    template: "%s | EduSlide AI",
  },
  description:
    "Transform educational documents into professional PowerPoint presentations in seconds. Upload PDF, DOCX, TXT files and let AI create stunning slides with speaker notes, quiz questions, and more.",
  keywords: ["AI presentations", "PowerPoint generator", "educational slides", "AI slide creator", "PPTX generator"],
  openGraph: {
    title: "EduSlide AI — AI-Powered Presentation Generator",
    description: "Transform documents into professional presentations with AI",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
