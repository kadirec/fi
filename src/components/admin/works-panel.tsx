"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Check, Pencil, Star, Trash2, X } from "lucide-react";
import { useAdmin } from "./admin-shell";
import { SectionHeader } from "./section-header";
import { UploadModal } from "./upload-modal";
import { DragHandle, SortableGrid } from "./sortable-grid";
import { cn } from "@/lib/cn";

type Work = {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  width: number;
  height: number;
  featured: boolean;
  order: number;
};

export function WorksPanel() {
  const { authedFetch } = useAdmin();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/works");
      const d = await r.json();
      setWorks(d.works ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const params = new URLSearchParams(window.location.search);
    if (params.get("upload") === "1") setUploadOpen(true);
  }, [refresh]);

  async function upload(file: File, values: Record<string, string>) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("title", values.title?.trim() || file.name.replace(/\.[^.]+$/, ""));
      const r = await authedFetch("/api/works", { method: "POST", body: fd });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error ?? `Upload failed (${r.status})`);
      }
      setUploadOpen(false);
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function toggleFeatured(w: Work) {
    setBusy(w.id);
    setWorks((xs) =>
      xs.map((x) => (x.id === w.id ? { ...x, featured: !x.featured } : x))
    );
    await authedFetch(`/api/works/${w.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !w.featured }),
    });
    setBusy(null);
  }

  async function saveRename(id: string) {
    setBusy(id);
    const title = renameValue.trim();
    if (title) {
      setWorks((xs) => xs.map((x) => (x.id === id ? { ...x, title } : x)));
      await authedFetch(`/api/works/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    }
    setBusy(null);
    setRenameId(null);
  }

  async function remove(w: Work) {
    if (!confirm(`Delete “${w.title}”? This cannot be undone.`)) return;
    setBusy(w.id);
    setWorks((xs) => xs.filter((x) => x.id !== w.id));
    await authedFetch(`/api/works/${w.id}`, { method: "DELETE" });
    setBusy(null);
  }

  async function onReorder(next: Work[]) {
    const renumbered = next.map((w, i) => ({ ...w, order: i + 1 }));
    setWorks(renumbered);
    await authedFetch("/api/works/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: renumbered.map((w) => ({ id: w.id, order: w.order })),
      }),
    });
  }

  const counts = {
    all: works.length,
    featured: works.filter((w) => w.featured).length,
  };
  const filtered = filter === "all" ? works : works.filter((w) => w.featured);
  const canReorder = filter === "all" && renameId === null;

  return (
    <div>
      <SectionHeader
        title="Works"
        hint={`${counts.all} pieces · ${counts.featured} featured · drag to reorder.`}
        right={
          <button
            onClick={() => setUploadOpen(true)}
            className="inline-flex items-center gap-2 bg-gold text-ink hover:bg-bone px-4 py-2.5 text-[11px] uppercase tracking-widest2"
          >
            <Camera size={14} /> add work
          </button>
        }
      />

      <div className="flex items-center gap-2 mb-5 overflow-x-auto -mx-1 px-1">
        {(["all", "featured"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={cn(
              "shrink-0 px-3 py-1.5 text-[11px] uppercase tracking-widest2 border inline-flex items-center gap-1.5",
              filter === k ? "border-gold text-gold" : "border-bone/15 text-bone/60"
            )}
          >
            {k} <span className="font-mono text-bone/50">{counts[k]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-bone/5 aspect-[4/5]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-ink-line py-16 text-center text-bone/60">
          Nothing here yet.
        </div>
      ) : (
        <SortableGrid
          items={filtered}
          onReorder={onReorder}
          disabled={!canReorder}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
          renderItem={(w, { listeners, attributes, isDragging }) => (
            <div
              className={cn(
                "relative bg-ink-soft overflow-hidden",
                isDragging && "cursor-grabbing"
              )}
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={w.imageUrl}
                  alt={w.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>

              <button
                onClick={() => toggleFeatured(w)}
                disabled={busy === w.id}
                className={cn(
                  "absolute top-2 left-2 p-1.5 z-10",
                  w.featured ? "text-gold" : "text-bone/40 hover:text-gold"
                )}
                aria-label="featured"
              >
                <Star size={16} fill={w.featured ? "currentColor" : "none"} />
              </button>
              <span className="absolute top-2 right-2 z-10 text-[9px] uppercase tracking-widest2 font-mono text-bone/70 bg-ink/70 px-1.5 py-1">
                #{String(w.order).padStart(2, "0")}
              </span>

              <div className="p-2 flex items-center gap-1">
                {canReorder && (
                  <DragHandle listeners={listeners} attributes={attributes} />
                )}
                {renameId === w.id ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveRename(w.id)}
                      className="flex-1 bg-transparent border-b border-gold outline-none text-sm py-1"
                    />
                    <button onClick={() => saveRename(w.id)} className="p-1.5 text-gold">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setRenameId(null)} className="p-1.5 text-bone/50">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0 font-display text-sm md:text-base truncate">
                      {w.title}
                    </div>
                    <button
                      onClick={() => {
                        setRenameId(w.id);
                        setRenameValue(w.title);
                      }}
                      className="p-1.5 text-bone/50 hover:text-gold"
                      aria-label="rename"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => remove(w)}
                      className="p-1.5 text-bone/50 hover:text-red-400"
                      aria-label="delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        />
      )}

      <UploadModal
        open={uploadOpen}
        title="new work"
        onClose={() => setUploadOpen(false)}
        onUpload={upload}
        busy={uploading}
        error={error}
        fields={[{ name: "title", label: "title", placeholder: "Piece title" }]}
      />
    </div>
  );
}
