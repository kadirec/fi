"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Image as ImageIcon, Loader2, X } from "lucide-react";

type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  placeholder?: string;
};

export function UploadModal({
  open,
  title,
  onClose,
  onUpload,
  fields = [{ name: "title", label: "name", placeholder: "e.g. Owl, Atlas" }],
  defaults = {},
  busy = false,
  error,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onUpload: (file: File, values: Record<string, string>) => Promise<void>;
  fields?: Field[];
  defaults?: Record<string, string>;
  busy?: boolean;
  error?: string | null;
}) {
  const [pending, setPending] = useState<File | null>(null);
  const [values, setValues] = useState<Record<string, string>>(defaults);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!pending) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(pending);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pending]);

  useEffect(() => {
    if (!open) {
      setPending(null);
      setValues(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(file);
    setValues((v) => ({
      ...v,
      title: v.title || file.name.replace(/\.[^.]+$/, ""),
    }));
    e.target.value = "";
  }

  async function submit() {
    if (!pending) return;
    await onUpload(pending, values);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md bg-ink border border-ink-line p-5 rounded-t-2xl md:rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] uppercase tracking-widest2 text-gold/90 font-mono">
                {title}
              </div>
              <button onClick={onClose} aria-label="Cancel">
                <X size={20} />
              </button>
            </div>

            {!pending ? (
              <div className="grid grid-cols-2 gap-3 my-2">
                <button
                  onClick={() => cameraRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 border border-bone/15 hover:border-gold p-8 transition-colors"
                >
                  <Camera size={26} />
                  <span className="text-[11px] uppercase tracking-widest2">capture</span>
                </button>
                <button
                  onClick={() => galleryRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 border border-bone/15 hover:border-gold p-8 transition-colors"
                >
                  <ImageIcon size={26} />
                  <span className="text-[11px] uppercase tracking-widest2">gallery</span>
                </button>
              </div>
            ) : (
              <>
                <div className="relative w-full aspect-square bg-ink-soft mb-4 overflow-hidden">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>

                {fields.map((field) => (
                  <label key={field.name} className="block mb-3">
                    <span className="text-[10px] uppercase tracking-widest2 text-bone/50">
                      {field.label}
                    </span>
                    {field.type === "textarea" ? (
                      <textarea
                        value={values[field.name] ?? ""}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [field.name]: e.target.value }))
                        }
                        rows={3}
                        placeholder={field.placeholder}
                        className="mt-1 w-full bg-transparent border-b border-bone/20 focus:border-gold outline-none py-2 text-bone resize-none"
                      />
                    ) : field.type === "select" ? (
                      <select
                        value={values[field.name] ?? field.options?.[0] ?? ""}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [field.name]: e.target.value }))
                        }
                        className="mt-1 w-full bg-ink border-b border-bone/20 focus:border-gold outline-none py-2 text-bone"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        autoFocus={field.name === "title"}
                        value={values[field.name] ?? ""}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [field.name]: e.target.value }))
                        }
                        placeholder={field.placeholder}
                        className="mt-1 w-full bg-transparent border-b border-bone/20 focus:border-gold outline-none py-2 text-bone"
                      />
                    )}
                  </label>
                ))}

                {error && (
                  <p className="text-red-400 text-xs uppercase tracking-widest2 mb-3">
                    {error}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-3 justify-end">
                  <button
                    onClick={() => setPending(null)}
                    className="px-4 py-3 text-[11px] uppercase tracking-widest2 text-bone/60"
                  >
                    re-pick
                  </button>
                  <button
                    onClick={submit}
                    disabled={busy}
                    className="inline-flex items-center gap-2 px-5 py-3 border border-gold text-gold hover:bg-gold hover:text-ink text-[11px] uppercase tracking-widest2 transition-colors disabled:opacity-50"
                  >
                    {busy ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> uploading
                      </>
                    ) : (
                      "upload"
                    )}
                  </button>
                </div>
              </>
            )}

            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onFile}
            />
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFile}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
