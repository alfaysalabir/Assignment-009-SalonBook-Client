"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { Spinner } from "@/components/ui";
import ImageInput from "@/components/ImageInput";

// Used for both "Add Service" and "Update Service"
export default function ServiceForm({ service }) {
  const router = useRouter();
  const editing = !!service;
  const [form, setForm] = useState({
    serviceName: service?.serviceName || "",
    category: service?.category || "",
    description: service?.description || "",
    price: service?.price ?? "",
    duration: service?.duration ?? "",
    image: service?.image || "",
    status: service?.status || "active", // default: active
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.serviceName.trim().length < 3) return toast.error("Service name must be at least 3 characters");
    if (!form.category) return toast.error("Please choose a category");
    if (form.description.trim().length < 10) return toast.error("Description must be at least 10 characters");
    if (!(Number(form.price) > 0)) return toast.error("Price must be a positive number");
    if (!(Number(form.duration) > 0)) return toast.error("Duration must be a positive number");
    if (!form.image) return toast.error("Please upload a service image");

    setSaving(true);
    try {
      const body = { ...form, price: Number(form.price), duration: Number(form.duration) };
      const res = await apiFetch(editing ? `/api/services/${service._id}` : "/api/services", {
        method: editing ? "PUT" : "POST",
        body,
      });
      toast.success(res.message);
      router.push("/dashboard/admin/services");
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-3xl space-y-5 p-6" noValidate>
      <div>
        <span className="label">Service Image</span>
        <ImageInput value={form.image} onChange={(url) => setForm({ ...form, image: url })} onBusyChange={setUploading} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="serviceName" className="label">Service Name</label>
          <input id="serviceName" className="input" value={form.serviceName} onChange={set("serviceName")} placeholder="e.g. Hydrating Glow Facial" />
        </div>
        <div>
          <label htmlFor="category" className="label">Service Category</label>
          <select id="category" className="input" value={form.category} onChange={set("category")}>
            <option value="">Choose a category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="price" className="label">Price (USD)</label>
          <input id="price" type="number" min="1" step="0.01" className="input" value={form.price} onChange={set("price")} placeholder="45" />
        </div>
        <div>
          <label htmlFor="duration" className="label">Estimated Duration (minutes)</label>
          <input id="duration" type="number" min="1" step="1" className="input" value={form.duration} onChange={set("duration")} placeholder="60" />
        </div>
        <div>
          <label htmlFor="status" className="label">Service Status</label>
          <select id="status" className="input" value={form.status} onChange={set("status")}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="label">Description</label>
        <textarea id="description" rows={4} className="input" value={form.description} onChange={set("description")} placeholder="Describe what is included in this service…" />
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving || uploading} className="btn-dark">
          {saving && <Spinner className="h-4 w-4" />} {editing ? "Update Service" : "Add Service"}
        </button>
        <button type="button" onClick={() => router.push("/dashboard/admin/services")} className="btn-outline" disabled={saving}>Cancel</button>
      </div>
    </form>
  );
}
