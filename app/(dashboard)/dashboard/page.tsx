"use client";
export const dynamic = 'force-dynamic';
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Presentation, FileText, Wand2, TrendingUp, ChevronRight,
} from "lucide-react";
import { UploadArea } from "@/components/dashboard/upload-area";
import { GenerateOptions } from "@/components/dashboard/generate-options";
import { PresentationCard } from "@/components/dashboard/presentation-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useDashboard } from "@/hooks/use-dashboard";
import Link from "next/link";

type UploadData = {
  fileName: string;
  fileUrl: string;
  extractedText: string;
  wordCount: number;
  estimatedSlides: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { stats, isLoading, refetch } = useDashboard();
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  const handleUploadComplete = (data: UploadData) => {
    setUploadData(data);
    setActiveTab("configure");
  };

  const handleGenerate = async (options: {
    numSlides: number;
    theme: "educational" | "professional" | "minimal" | "corporate";
    colorScheme: string;
    fontStyle: string;
    includeQuiz: boolean;
    includeDiscussion: boolean;
    includeSummary: boolean;
    includeReferences: boolean;
    language: string;
    animationLevel?: string;
    presentationStyle?: string;
    transitionStyle?: string;
    animationSpeed?: string;
  }) => {
    if (!uploadData) return;

    const { animationLevel, presentationStyle, transitionStyle, animationSpeed, ...rest } = options;
    const animationConfig = {
      animationLevel: animationLevel || "medium",
      presentationStyle: presentationStyle || "educational",
      transitionStyle: transitionStyle || "automatic",
      animationSpeed: animationSpeed || "normal",
    };

    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: uploadData.extractedText,
          fileName: uploadData.fileName,
          originalFileUrl: uploadData.fileUrl,
          ...rest,
          animationConfig,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "Generation failed", description: data.error, variant: "destructive" });
        return;
      }

      toast({
        title: "Presentation created!",
        description: `${data.presentation.slideCount} slides generated successfully.`,
        variant: "success",
      } as Parameters<typeof toast>[0]);

      router.push(`/presentations/${data.presentation.id}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const statCards = [
    {
      title: "Total Presentations",
      value: stats?.totalPresentations || 0,
      icon: Presentation,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Total Slides",
      value: stats?.totalSlides || 0,
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      title: "AI Generations",
      value: stats?.totalPresentations || 0,
      icon: Wand2,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "This Month",
      value: stats?.recentPresentations?.length || 0,
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Upload a document to generate a presentation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? "—" : stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Generator Panel */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-primary" />
                Generate New Presentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="upload">1. Upload Document</TabsTrigger>
                  <TabsTrigger value="configure" disabled={!uploadData}>
                    2. Configure & Generate
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <UploadArea onUploadComplete={handleUploadComplete} />
                  {uploadData && (
                    <div className="mt-4 text-center">
                      <Button onClick={() => setActiveTab("configure")} variant="gradient">
                        Continue to Options
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="configure">
                  <GenerateOptions
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    fileInfo={uploadData ? { wordCount: uploadData.wordCount, estimatedSlides: uploadData.estimatedSlides } : null}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Recent Presentations */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Presentation className="w-4 h-4 text-primary" />
                  Recent Presentations
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground">
                  <Link href="/presentations">View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 rounded-lg skeleton" />
                  ))}
                </div>
              ) : !stats?.recentPresentations?.length ? (
                <div className="text-center py-8">
                  <Presentation className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No presentations yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Upload a document to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentPresentations.map((p) => (
                    <PresentationCard
                      key={p.id}
                      presentation={p}
                      onDelete={() => refetch()}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
