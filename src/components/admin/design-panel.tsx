"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Check, Pencil, Trash2, X } from "lucide-react";
import { useAdmin } from "./admin-shell";
import { SectionHeader } from "./section-header";
import { UploadModal } from "./upload-modal";
import { DragHandle, SortableGrid } from "./sortable-grid";
import { cn } from "@/lib/cn";

type Design = {
  id: string;
  title: string;
  imageUrl: string;
  status: "available" | "sold" | string;
  width: number;
  height: number;
  order: number;
};

export function DesignPanel() {
  const { authedFetch } = useAdmin();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "available" | "sold">("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/designs");
      const d = await r.json();
      setDesigns(d.designs ?? []);
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
      fd.append("status", values.status || "available");
      const r = await authedFetch("/api/designs", { method: "POST", body: fd });
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

  async function toggleStatus(d: Design) {
    setBusy(d.id);
    const next = d.status === "available" ? "sold" : "available";
    setDesigns((ds) => ds.map((x) => (x.id === d.id ? { ...x, status: next } : x)));
    await authedFetch(`/api/designs/${d.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(null);
  }

  async function saveRename(id: string) {
    setBusy(id);
    const title = renameValue.trim();
    if (title) {
      setDesigns((ds) => ds.map((x) => (x.id === id ? { ...x, title } : x)));
      await authedFetch(`/api/designs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    }
    setBusy(null);
    setRenameId(null);
  }

  async function remove(d: Design) {
    if (!confirm(`Delete “${d.title}”? This cannot be undone.`)) return;
    setBusy(d.id);
    setDesigns((ds) => ds.filter((x) => x.id !== d.id));
    await authedFetch(`/api/designs/${d.id}`, { method: "DELETE" });
    setBusy(null);
  }

  async function onReorder(next: Design[]) {
    const renumbered = next.map((d, i) => ({ ...d, order: i + 1 }));
    setDesigns(renumbered);
    await authedFetch("/api/designs/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: renumbered.map((d) => ({ id: d.id, order: d.order })),
      }),
    });
  }

  const counts = {
    all: designs.length,
    available: designs.filter((d) => d.status === "available").length,
    sold: designs.filter((d) => d.status === "sold").length,
  };
  const filtered = filter === "all" ? designs : designs.filter((d) => d.status === filter);
  const canReorder = filter === "all" && renameId === null;

  return (
    <div>
      <SectionHeader
        title="Design Ledger"
        hint={`${counts.available} available · ${counts.sold} sold · tap the status badge to toggle · drag to reorder.`}
        right={
          <button
            onClick={() => setUploadOpen(true)}
            className="inline-flex items-center gap-2 bg-gold text-ink hover:bg-bone px-4 py-2.5 text-[11px] uppercase tracking-widest2"
          >
            <Camera size={14} /> add design
          </button>
        }
      />

      <div className="flex items-center gap-2 mb-5 overflow-x-auto -mx-1 px-1">
        {(["all", "available", "sold"] as const).map((k) => (
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-bone/5 aspect-[4/5]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-ink-line py-16 text-center text-bone/60">
          The ledger is empty.
        </div>
      ) : (
        <SortableGrid
          items={filtered}
          onReorder={onReorder}
          disabled={!canReorder}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
          renderItem={(d, { listeners, attributes, isDragging }) => (
            <div
              className={cn(
                "relative bg-ink-soft overflow-hidden",
                d.status === "sold" && "opacity-90",
                isDragging && "cursor-grabbing"
              )}
            >
              <div
                className={cn(
                  "relative aspect-[4/5]",
                  d.status === "sold" && "grayscale"
                )}
              >
                <Image
                  src={d.imageUrl}
                  alt={d.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>

              <button
                onClick={() => toggleStatus(d)}
                disabled={busy === d.id}
                title={d.status === "sold" ? "Mark as available" : "Mark as sold"}
                className={cn(
                  "group/badge absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-widest2 font-mono bg-ink/70 backdrop-blur-md border text-bone cursor-pointer transition hover:bg-ink hover:scale-[1.04]",
                  d.status === "sold"
                    ? "border-red-500/40 hover:border-red-400/80"
                    : "border-emerald-400/40 hover:border-emerald-300/80"
                )}
              >
                {busy === d.id ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-bone/60 animate-pulse" />
                ) : d.status === "sold" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                ) : (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                )}
                {busy === d.id ? "..." : d.status}
              </button>
              <span className="absolute top-2 right-2 z-10 text-[9px] uppercase tracking-widest2 font-mono text-bone/70 bg-ink/70 px-1.5 py-1">
                #{String(d.order).padStart(2, "0")}
              </span>

              <div className="p-2 flex items-center gap-1">
                {canReorder && (
                  <DragHandle listeners={listeners} attributes={attributes} />
                )}
                {renameId === d.id ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveRename(d.id)}
                      className="flex-1 bg-transparent border-b border-gold outline-none text-sm py-1"
                    />
                    <button onClick={() => saveRename(d.id)} className="p-1.5 text-gold">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setRenameId(null)} className="p-1.5 text-bone/50">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0 font-display text-sm md:text-base truncate">
                      {d.title}
                    </div>
                    <button
                      onClick={() => {
                        setRenameId(d.id);
                        setRenameValue(d.title);
                      }}
                      className="p-1.5 text-bone/50 hover:text-gold"
                      aria-label="rename"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => remove(d)}
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
        title="new design"
        onClose={() => setUploadOpen(false)}
        onUpload={upload}
        busy={uploading}
        error={error}
        fields={[
          { name: "title", label: "name", placeholder: "e.g. Owl, Atlas" },
          { name: "status", label: "status", type: "select", options: ["available", "sold"] },
        ]}
        defaults={{ status: "available" }}
      />
    </div>
  );
}
