"use client";
export const dynamic = "force-dynamic";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PresentationPlayer } from "@/components/editor/presentation-player";
import type { PresentationWithSlides } from "@/types";

export default function PresentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [presentation, setPresentation] = useState<PresentationWithSlides | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/presentations/${id}`)
      .then((r) => r.json())
      .then((d) => setPresentation(d.presentation))
      .catch(() => router.push(`/presentations/${id}`))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (!presentation) return null;

  return (
    <PresentationPlayer
      presentation={presentation}
      onClose={() => router.push(`/presentations/${id}`)}
    />
  );
}
