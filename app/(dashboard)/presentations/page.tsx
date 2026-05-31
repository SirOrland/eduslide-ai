"use client";
import { useState, useEffect } from "react";
import { Presentation, Plus, Search } from "lucide-react";
import Link from "next/link";
import { PresentationCard } from "@/components/dashboard/presentation-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PresentationWithSlides } from "@/types";

export default function PresentationsPage() {
  const [presentations, setPresentations] = useState<PresentationWithSlides[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/presentations")
      .then((r) => r.json())
      .then((d) => setPresentations(d.presentations || []))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = presentations.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Presentations</h1>
          <p className="text-muted-foreground text-sm">{presentations.length} total</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/dashboard">
            <Plus className="w-4 h-4 mr-2" />
            New Presentation
          </Link>
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search presentations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Presentation className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {search ? "No presentations found" : "No presentations yet"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {search ? "Try a different search term" : "Upload a document to create your first AI presentation"}
          </p>
          {!search && (
            <Button asChild variant="gradient">
              <Link href="/dashboard">Create Presentation</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <PresentationCard
              key={p.id}
              presentation={p}
              onDelete={(id) => setPresentations((prev) => prev.filter((x) => x.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
