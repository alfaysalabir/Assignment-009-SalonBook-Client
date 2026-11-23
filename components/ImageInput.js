"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiUpload } from "react-icons/fi";
import { uploadImage } from "@/lib/api";
import { SmartImage, Spinner } from "@/components/ui";

// Upload an image (goes to ImgBB through our server). With allowUrl you can also paste an image link.
export default function ImageInput({ value, onChange, allowUrl = false, onBusyChange, round = false }) {
  const [mode, setMode] = useState("upload");
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    onBusyChange?.(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      onBusyChange?.(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className={`relative h-24 w-24 shrink-0 overflow-hidden border border-line bg-blush-100 ${round ? "rounded-full" : "rounded-2xl"}`}>
          <SmartImage src={value} alt="Preview" className="h-full w-full" />
          {uploading && (
            <div className="absolute inset-0 grid place-items-center bg-white/70 text-plum-700">
              <Spinner />
            </div>
          )}
        </div>

        <div className="flex-1">
          {allowUrl && (
            <div className="mb-2 inline-flex rounded-full bg-blush-100 p-1 text-xs font-bold">
              {["upload", "url"].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMode(m)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 capitalize transition ${
                    mode === m ? "bg-plum-900 text-white" : "text-plum-800"
                  }`}
                >
                  {m === "url" ? "Image URL" : "Upload"}
                </button>
              ))}
            </div>
          )}

          {mode === "upload" ? (
            <label className="btn-outline btn-sm cursor-pointer">
              <FiUpload /> {value ? "Change Image" : "Choose Image"}
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
            </label>
          ) : (
            <input
              type="url"
              className="input"
              placeholder="https://example.com/photo.jpg"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
          <p className="mt-2 text-xs text-muted">JPG, PNG or WebP · max 5MB</p>
        </div>
      </div>
    </div>
  );
}
