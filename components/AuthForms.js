"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { passwordError, safeRedirect } from "@/lib/utils";
import { Spinner } from "@/components/ui";
import ImageInput from "@/components/ImageInput";

function PasswordField({ value, onChange, id = "password" }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        className="input pr-11"
        placeholder="••••••"
        value={value}
        onChange={onChange}
        autoComplete={id === "password" ? "current-password" : "new-password"}
      />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-muted">
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}

function GoogleButton({ redirect }) {
  const [loading, setLoading] = useState(false);
  async function handle() {
    setLoading(true);
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: redirect });
    if (error) {
      toast.error(error.message || "Google sign in failed");
      setLoading(false);
    }
  }
  return (
    <button type="button" onClick={handle} disabled={loading} className="btn-outline w-full">
      {loading ? <Spinner className="h-4 w-4" /> : <FcGoogle size={20} />} Continue with Google
    </button>
  );
}

const Divider = () => (
  <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted">
    <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
  </div>
);

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get("redirect"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Please enter your email and password");

    setLoading(true);
    clearToken();
    const { error } = await authClient.signIn.email({ email: form.email, password: form.password });
    if (error) {
      setLoading(false);
      return toast.error(error.message || "Invalid email or password");
    }

    // blocked users are not allowed in
    const { data: session } = await authClient.getSession();
    if (session?.user?.isBlocked) {
      await authClient.signOut();
      setLoading(false);
      return toast.error("Your account has been blocked. Please contact the salon.");
    }

    toast.success("Welcome back!");
    router.push(redirect);
    router.refresh();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <PasswordField value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button type="submit" disabled={loading} className="btn-dark w-full">
          {loading && <Spinner className="h-4 w-4" />} Sign In
        </button>
      </form>
      <Divider />
      <GoogleButton redirect={redirect} />
    </>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", image: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function validate() {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid email";
    const pw = passwordError(form.password);
    if (pw) next.password = pw;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return toast.error("Please fix the highlighted fields");

    setLoading(true);
    clearToken();
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email,
      password: form.password,
      image: form.image || undefined,
    });
    if (error) {
      setLoading(false);
      return toast.error(error.message || "Could not create your account");
    }
    toast.success("Account created! Welcome to SalonBook 🎉");
    router.push("/dashboard");
    router.refresh();
  }

  const err = (key) => errors[key] && <p className="mt-1 text-xs font-medium text-rose-600">{errors[key]}</p>;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="label">Full Name</label>
          <input id="name" className="input" placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
          {err("email")}
        </div>
        <div>
          <label htmlFor="new-password" className="label">Password</label>
          <PasswordField id="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {err("password") || <p className="mt-1 text-xs text-muted">Min 6 characters, with one uppercase and one lowercase letter.</p>}
        </div>
        <div>
          <span className="label">Profile Image <span className="font-normal text-muted">(optional)</span></span>
          <ImageInput value={form.image} onChange={(url) => setForm({ ...form, image: url })} allowUrl round onBusyChange={setUploading} />
        </div>
        <button type="submit" disabled={loading || uploading} className="btn-dark w-full">
          {loading && <Spinner className="h-4 w-4" />} Create Account
        </button>
      </form>
      <Divider />
      <GoogleButton redirect="/dashboard" />
    </>
  );
}
