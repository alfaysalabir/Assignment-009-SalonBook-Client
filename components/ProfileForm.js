"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui";
import ImageInput from "@/components/ImageInput";

// Used by both Customer and Admin. Only name, image and phone can be changed (role / blocked status cannot).
export default function ProfileForm() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [form, setForm] = useState({ name: "", image: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || "", image: user.image || "", phone: user.phone || "" });
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Name must be at least 2 characters");
    if (form.phone && !/^[+\d][\d\s-]{6,17}$/.test(form.phone)) return toast.error("Please enter a valid phone number");

    setSaving(true);
    const { error } = await authClient.updateUser({
      name: form.name.trim(),
      image: form.image || null,
      phone: form.phone.trim(),
    });
    setSaving(false);
    if (error) return toast.error(error.message || "Could not update your profile");
    toast.success("Profile updated successfully");
  }

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-5 p-6" noValidate>
      <div>
        <span className="label">Profile Image</span>
        <ImageInput value={form.image} onChange={(url) => setForm({ ...form, image: url })} allowUrl round onBusyChange={setUploading} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Full Name</label>
          <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label htmlFor="phone" className="label">Phone Number</label>
          <input id="phone" className="input" placeholder="+880 1XXX-XXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" className="input bg-blush-100" value={user.email} disabled />
        </div>
        <div>
          <label htmlFor="role" className="label">Role</label>
          <input id="role" className="input bg-blush-100 capitalize" value={user.role || "customer"} disabled />
        </div>
      </div>
      <button type="submit" disabled={saving || uploading} className="btn-dark">
        {saving && <Spinner className="h-4 w-4" />} Save Changes
      </button>
    </form>
  );
}
