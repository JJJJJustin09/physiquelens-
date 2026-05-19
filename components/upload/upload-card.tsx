"use client";

import { ChangeEvent, DragEvent, useRef } from "react";
import Image from "next/image";
import { ImagePlus, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { Panel } from "@/components/layout/ui";

type UploadCardProps = {
  id: string;
  label: string;
  description: string;
  previewUrl?: string;
  fileName?: string;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
};

export function UploadCard({
  id,
  label,
  description,
  previewUrl,
  fileName,
  onFileSelected,
  onRemove,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelected(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <Panel className="p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-white">{label}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        <ImagePlus className="h-4 w-4 text-cyan-300" />
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {!previewUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="grid min-h-56 cursor-pointer place-items-center rounded-xl border border-dashed border-slate-500/50 bg-slate-900/40 p-4 text-center transition hover:border-cyan-400/60 hover:bg-cyan-500/5"
        >
          <div>
            <UploadCloud className="mx-auto h-7 w-7 text-cyan-200" />
            <p className="mt-3 text-sm font-medium text-slate-200">Click to upload</p>
            <p className="text-xs text-slate-400">or drag and drop your image here</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10">
            <Image src={previewUrl} alt={`${label} preview`} fill className="object-cover" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="max-w-[220px] truncate text-xs text-slate-400">{fileName}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10"
              >
                <RefreshCw className="h-3 w-3" />
                Replace photo
              </button>
              <button
                onClick={onRemove}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200 transition hover:bg-rose-500/20"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
