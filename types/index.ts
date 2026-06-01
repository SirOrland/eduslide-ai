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

// Animation types
export type AnimationEffect =
  | "fadeIn"
  | "slideInLeft"
  | "slideInRight"
  | "slideInUp"
  | "zoomIn"
  | "bounceIn"
  | "typewriter";

export type TransitionType =
  | "fade"
  | "morph"
  | "zoom"
  | "push"
  | "reveal"
  | "wipe"
  | "none";

export type CameraEffect = "none" | "pan" | "zoom" | "focus";
export type AnimationLevel = "none" | "low" | "medium" | "high";
export type PresentationStyleMode = "educational" | "business" | "marketing" | "conference";
export type AnimationSpeed = "slow" | "normal" | "fast";

export interface ElementAnimation {
  element: string;
  effect: AnimationEffect;
  duration: number;
  delay?: number;
}

export interface SlideAnimationData {
  transition: TransitionType;
  transitionDuration?: number;
  cameraEffect?: CameraEffect;
  animationSequence: ElementAnimation[];
}

export interface AnimationConfig {
  animationLevel: AnimationLevel;
  presentationStyle: PresentationStyleMode;
  transitionStyle: "automatic" | TransitionType;
  animationSpeed: AnimationSpeed;
}

export interface SlideData {
  slideNumber: number;
  slideType: SlideType;
  title: string;
  content: string[];
  speakerNotes: string;
  imagePrompt: string;
  imageUrl?: string;
  animationData?: SlideAnimationData;
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
  animationConfig?: AnimationConfig;
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
  animationConfig?: AnimationConfig | null;
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
  animationData?: SlideAnimationData | null;
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

// Image types
export type ImageMode = "auto" | "search" | "generate" | "none";
export type ImageStyle = "realistic" | "infographic" | "educational" | "minimalist";

export interface ImageConfig {
  imageMode: ImageMode;
  imageStyle: ImageStyle;
  includeDiagrams: boolean;
}

export const IMAGE_STYLES = [
  { id: "educational", name: "Educational", description: "Diagrams & labeled illustrations" },
  { id: "realistic",   name: "Realistic",   description: "Photography & real-world images" },
  { id: "infographic", name: "Infographic", description: "Charts, icons & flat design" },
  { id: "minimalist",  name: "Minimalist",  description: "Clean, simple vector graphics" },
];

export const ANIMATION_STYLES = [
  { id: "educational", name: "Educational", description: "Slow, focused, sequential reveals" },
  { id: "business", name: "Business", description: "Professional, minimal animations" },
  { id: "marketing", name: "Marketing", description: "Dynamic, high-energy effects" },
  { id: "conference", name: "Conference", description: "Premium storytelling animations" },
];
