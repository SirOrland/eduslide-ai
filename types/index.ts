export type SlideType =
  | "title"
  | "content"
  | "objectives"
  | "quiz"
  | "discussion"
  | "summary"
  | "references"
  | "image";

export type PresentationTheme =
  | "educational"
  | "professional"
  | "minimal"
  | "corporate";

export type PresentationStatus = "draft" | "generating" | "ready" | "error";

export interface SlideData {
  slideNumber: number;
  slideType: SlideType;
  title: string;
  content: string[];
  speakerNotes: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface PresentationData {
  presentationTitle: string;
  presentationDescription: string;
  theme: PresentationTheme;
  slides: SlideData[];
}

export interface GenerateOptions {
  numSlides: number;
  theme: PresentationTheme;
  colorScheme: string;
  fontStyle: string;
  includeQuiz: boolean;
  includeDiscussion: boolean;
  includeSummary: boolean;
  includeReferences: boolean;
  language: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  text: string;
}

export interface PresentationWithSlides {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  fileName: string | null;
  originalFileUrl: string | null;
  pptxUrl: string | null;
  pdfUrl: string | null;
  theme: string;
  colorScheme: string;
  fontStyle: string;
  status: string;
  slideCount: number;
  createdAt: Date;
  updatedAt: Date;
  slides: SlideRecord[];
}

export interface SlideRecord {
  id: string;
  presentationId: string;
  slideNumber: number;
  slideType: string;
  title: string;
  content: string[];
  speakerNotes: string | null;
  imagePrompt: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalPresentations: number;
  totalSlides: number;
  recentPresentations: PresentationWithSlides[];
}

export type ColorScheme = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export const COLOR_SCHEMES: ColorScheme[] = [
  { id: "blue", name: "Ocean Blue", primary: "1E40AF", secondary: "3B82F6", accent: "60A5FA", background: "EFF6FF", text: "1E3A5F" },
  { id: "green", name: "Forest Green", primary: "166534", secondary: "22C55E", accent: "4ADE80", background: "F0FDF4", text: "14532D" },
  { id: "purple", name: "Royal Purple", primary: "6B21A8", secondary: "A855F7", accent: "C084FC", background: "FAF5FF", text: "581C87" },
  { id: "orange", name: "Sunset Orange", primary: "C2410C", secondary: "F97316", accent: "FB923C", background: "FFF7ED", text: "7C2D12" },
  { id: "dark", name: "Dark Mode", primary: "F9FAFB", secondary: "6366F1", accent: "818CF8", background: "111827", text: "F9FAFB" },
];

export const FONT_STYLES = [
  { id: "modern", name: "Modern Sans", heading: "Inter", body: "Inter" },
  { id: "classic", name: "Classic Serif", heading: "Merriweather", body: "Georgia" },
  { id: "tech", name: "Tech Mono", heading: "JetBrains Mono", body: "Fira Code" },
  { id: "elegant", name: "Elegant Script", heading: "Playfair Display", body: "Lato" },
];

export const PRESENTATION_THEMES = [
  { id: "educational", name: "Educational", description: "Perfect for classrooms and learning" },
  { id: "professional", name: "Professional", description: "Corporate and business presentations" },
  { id: "minimal", name: "Minimal", description: "Clean and distraction-free slides" },
  { id: "corporate", name: "Corporate", description: "Formal enterprise style" },
];
