"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এবার সাইন ইন করো।");

      router.push("/sign-in");
    } catch {
      toast.error("রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(provider: "google" | "github") {
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "সোশ্যাল লগইন করা যায়নি।");
        setSocialLoading("");
      }
    } catch {
      toast.error("সোশ্যাল লগইন ব্যর্থ হয়েছে। Configuration পরীক্ষা করো।");
      setSocialLoading("");
    }
  }

  const busy = loading || socialLoading !== "";

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#F0F5F0] px-4 py-8 sm:py-12">
      <div className="w-full max-w-104">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#26332B] sm:text-[28px]">
            অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="mt-2 text-sm text-[#788179]">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
          </p>
        </header>

        {/* Registration card */}
        <section className="rounded-2xl border border-[#DFE8E0] bg-[#FAFCFA] p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-[#26332B]"
              >
                নাম
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="যেমন: রহিম উদ্দিন"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={100}
                disabled={busy}
                className="h-10 w-full rounded-lg border border-[#DFE8E0] bg-transparent px-3 text-sm text-[#26332B] outline-none transition placeholder:text-[#8A938C] focus:border-[#39864B] focus:ring-2 focus:ring-[#39864B]/15 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#26332B]"
              >
                ইমেইল
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={busy}
                className="h-10 w-full rounded-lg border border-[#DFE8E0] bg-transparent px-3 text-sm text-[#26332B] outline-none transition placeholder:text-[#8A938C] focus:border-[#39864B] focus:ring-2 focus:ring-[#39864B]/15 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#26332B]"
              >
                পাসওয়ার্ড
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                maxLength={128}
                required
                disabled={busy}
                className="h-10 w-full rounded-lg border border-[#DFE8E0] bg-transparent px-3 text-sm text-[#26332B] outline-none transition placeholder:text-[#8A938C] focus:border-[#39864B] focus:ring-2 focus:ring-[#39864B]/15 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-[#26332B]"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="আবার লিখুন"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                disabled={busy}
                className="h-10 w-full rounded-lg border border-[#DFE8E0] bg-transparent px-3 text-sm text-[#26332B] outline-none transition placeholder:text-[#8A938C] focus:border-[#39864B] focus:ring-2 focus:ring-[#39864B]/15 disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="flex h-10 w-full items-center justify-center rounded-lg bg-[#39864B] px-4 text-sm font-bold text-white shadow-md shadow-green-900/15 transition hover:bg-[#2F743F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#39864B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#DFE8E0]" />
            <span className="text-xs text-[#788179]">অথবা</span>
            <div className="h-px flex-1 bg-[#DFE8E0]" />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => void handleSocialLogin("google")}
              disabled={busy}
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#DFE8E0] px-2 text-xs font-semibold text-[#26332B] transition hover:bg-[#F0F5F0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                aria-hidden="true"
                className="text-base font-extrabold text-[#4285F4]"
              >
                G
              </span>
              {socialLoading === "google"
                ? "চালু হচ্ছে..."
                : "Google দিয়ে চালিয়ে যান"}
            </button>

            <button
              type="button"
              onClick={() => void handleSocialLogin("github")}
              disabled={busy}
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#DFE8E0] px-2 text-xs font-semibold text-[#26332B] transition hover:bg-[#F0F5F0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current"
              >
                <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.76 2.35 3.23 1.68.1-.73.4-1.23.7-1.52-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-2.99 0 0 .95-.3 3.08 1.16a10.7 10.7 0 0 1 5.6 0c2.13-1.45 3.08-1.16 3.08-1.16.61 1.55.23 2.7.11 2.99.72.79 1.16 1.8 1.16 3.03 0 4.32-2.63 5.28-5.14 5.56.4.35.75 1.03.75 2.08v3.07c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
              </svg>
              {socialLoading === "github"
                ? "চালু হচ্ছে..."
                : "GitHub দিয়ে চালিয়ে যান"}
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-[#59635B]">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#39864B] hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </section>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[#788179] transition hover:text-[#39864B]"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
