// "use client";

// import { useState, type FormEvent } from "react";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";
// import { authClient } from "@/lib/auth-client";

// type SocialProvider = "google" | "github";

// function getSafeCallbackURL(requestedURL: string | null): string {
//   if (
//     requestedURL &&
//     requestedURL.startsWith("/") &&
//     !requestedURL.startsWith("//") &&
//     !requestedURL.includes("\\")
//   ) {
//     return requestedURL;
//   }

//   return "/profile";
// }

// export default function SignInPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const callbackURL = getSafeCallbackURL(searchParams.get("callbackURL"));

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(
//     null,
//   );

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!email.trim() || !password) {
//       toast.error("ইমেইল এবং পাসওয়ার্ড লিখুন।");
//       return;
//     }

//     setLoading(true);

//     try {
//       const { error } = await authClient.signIn.email({
//         email: email.trim(),
//         password,
//         callbackURL,
//       });

//       if (error) {
//         toast.error(error.message || "লগইন করা যায়নি। আবার চেষ্টা করুন।");
//         return;
//       }

//       toast.success("সফলভাবে সাইন ইন হয়েছে!");

//       // Go back to the requested product or profile page.
//       router.replace(callbackURL);
//       router.refresh();
//     } catch {
//       toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSocialLogin = async (provider: SocialProvider) => {
//     setSocialLoading(provider);

//     try {
//       const { error } = await authClient.signIn.social({
//         provider,
//         callbackURL,
//       });

//       if (error) {
//         toast.error(error.message || "সোশ্যাল লগইন ব্যর্থ হয়েছে।");
//         setSocialLoading(null);
//       }
//     } catch {
//       toast.error("লগইন করা যায়নি। আবার চেষ্টা করুন।");
//       setSocialLoading(null);
//     }
//   };

//   const isBusy = loading || socialLoading !== null;

//   return (
//     <main className="min-h-screen bg-[#F0F5F0] px-4 py-8 text-[#263329] sm:py-12">
//       <div className="mx-auto w-full max-w-104">
//         <header className="mb-6 text-center">
//           <h1 className="text-2xl font-bold tracking-tight">সাইন ইন</h1>

//           <p className="mt-2 text-sm text-[#707A72]">
//             বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
//           </p>
//         </header>

//         <section className="rounded-2xl border border-[#DFE8E0] bg-[#FAFCFA] p-6">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label htmlFor="email" className="mb-2 block text-sm font-medium">
//                 ইমেইল
//               </label>

//               <input
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(event) => setEmail(event.target.value)}
//                 required
//                 disabled={isBusy}
//                 className="h-10 w-full rounded-lg border border-[#DCE5DD] bg-transparent px-3 text-sm outline-none transition placeholder:text-[#89928B] focus:border-[#008A43] focus:ring-2 focus:ring-[#008A43]/10 disabled:opacity-60"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="mb-2 block text-sm font-medium"
//               >
//                 পাসওয়ার্ড
//               </label>

//               <input
//                 id="password"
//                 type="password"
//                 autoComplete="current-password"
//                 placeholder="আপনার পাসওয়ার্ড লিখুন"
//                 value={password}
//                 onChange={(event) => setPassword(event.target.value)}
//                 required
//                 disabled={isBusy}
//                 className="h-10 w-full rounded-lg border border-[#DCE5DD] bg-transparent px-3 text-sm outline-none transition placeholder:text-[#89928B] focus:border-[#008A43] focus:ring-2 focus:ring-[#008A43]/10 disabled:opacity-60"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={isBusy}
//               className="flex h-10 w-full items-center justify-center rounded-lg bg-[#008A43] text-sm font-semibold text-white shadow-[0_3px_0_#006C34] transition hover:bg-[#00783A] disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
//             </button>
//           </form>

//           {/* Divider */}
//           <div className="my-5 flex items-center gap-4">
//             <div className="h-px flex-1 bg-[#DCE5DD]" />

//             <span className="text-sm text-[#707A72]">অথবা</span>

//             <div className="h-px flex-1 bg-[#DCE5DD]" />
//           </div>

//           {/* Social login buttons */}
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//             <button
//               type="button"

//               // goggle 
//               onClick={() => handleSocialLogin("google")}
//               disabled={isBusy}
//               className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#DCE5DD] px-2 text-sm font-semibold transition hover:bg-[#F0F5F0] disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <span
//                 aria-hidden="true"
//                 className="text-base font-bold text-[#4285F4]"
//               >
//                 G
//               </span>

//               <span>
//                 {socialLoading === "google"
//                   ? "অপেক্ষা করুন..."
//                   : "Google দিয়ে চালিয়ে যান"}
//               </span>
//             </button>
              

//               {/* github */}
//             <button
//               type="button"
//               onClick={() => handleSocialLogin("github")}
//               disabled={isBusy}
//               className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#DCE5DD] px-2 text-sm font-semibold transition hover:bg-[#F0F5F0] disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <svg
//                 aria-hidden="true"
//                 viewBox="0 0 24 24"
//                 className="h-4 w-4 shrink-0 fill-current"
//               >
//                 <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.24-5.1 5.52.4.35.75 1.03.75 2.08V22c0 .29.2.63.76.53A11.1 11.1 0 0 0 12 .9Z" />
//               </svg>

//               <span>
//                 {socialLoading === "github"
//                   ? "অপেক্ষা করুন..."
//                   : "GitHub দিয়ে চালিয়ে যান"}
//               </span>
//             </button>
//           </div>

//           <p className="mt-5 text-center text-sm">
//             অ্যাকাউন্ট নেই?{" "}
//             <Link
//               href="/sign-up"
//               className="font-medium text-[#008A43] hover:underline"
//             >
//               সাইন আপ করুন
//             </Link>
//           </p>
//         </section>

//         <div className="mt-6 text-center">
//           <Link
//             href="/"
//             className="text-sm text-[#707A72] transition hover:text-[#008A43]"
//           >
//             ← হোম পেজে ফিরে যান
//           </Link>
//         </div>
//       </div>
//     </main>
//   );
// }













"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type SocialProvider = "google" | "github";

function getSafeCallbackURL(requestedURL: string | null): string {
  if (
    requestedURL &&
    requestedURL.startsWith("/") &&
    !requestedURL.startsWith("//") &&
    !requestedURL.includes("\\")
  ) {
    return requestedURL;
  }

  return "/profile";
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackURL = getSafeCallbackURL(searchParams.get("callbackURL"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] =
    useState<SocialProvider | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("ইমেইল এবং পাসওয়ার্ড লিখুন।");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL,
      });

      if (error) {
        toast.error(error.message || "লগইন করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      router.replace(callbackURL);
      router.refresh();
    } catch {
      toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL,
      });

      if (error) {
        toast.error(error.message || "সোশ্যাল লগইন ব্যর্থ হয়েছে।");
        setSocialLoading(null);
      }
    } catch {
      toast.error("লগইন করা যায়নি। আবার চেষ্টা করুন।");
      setSocialLoading(null);
    }
  };

  const isBusy = loading || socialLoading !== null;

  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 py-8 text-[#263329] sm:py-12">
      <div className="mx-auto w-full max-w-104">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">সাইন ইন</h1>
          <p className="mt-2 text-sm text-[#707A72]">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </header>

        <section className="rounded-2xl border border-[#DFE8E0] bg-[#FAFCFA] p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                ইমেইল
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={isBusy}
                className="h-10 w-full rounded-lg border border-[#DCE5DD] bg-transparent px-3 text-sm outline-none transition placeholder:text-[#89928B] focus:border-[#008A43] focus:ring-2 focus:ring-[#008A43]/10 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={isBusy}
                className="h-10 w-full rounded-lg border border-[#DCE5DD] bg-transparent px-3 text-sm outline-none transition placeholder:text-[#89928B] focus:border-[#008A43] focus:ring-2 focus:ring-[#008A43]/10 disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="flex h-10 w-full items-center justify-center rounded-lg bg-[#008A43] text-sm font-semibold text-white shadow-[0_3px_0_#006C34] transition hover:bg-[#00783A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#DCE5DD]" />
            <span className="text-sm text-[#707A72]">অথবা</span>
            <div className="h-px flex-1 bg-[#DCE5DD]" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={isBusy}
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#DCE5DD] px-2 text-sm font-semibold transition hover:bg-[#F0F5F0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                aria-hidden="true"
                className="text-base font-bold text-[#4285F4]"
              >
                G
              </span>
              <span>
                {socialLoading === "google"
                  ? "অপেক্ষা করুন..."
                  : "Google দিয়ে চালিয়ে যান"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              disabled={isBusy}
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#DCE5DD] px-2 text-sm font-semibold transition hover:bg-[#F0F5F0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-current"
              >
                <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.24-5.1 5.52.4.35.75 1.03.75 2.08V22c0 .29.2.63.76.53A11.1 11.1 0 0 0 12 .9Z" />
              </svg>
              <span>
                {socialLoading === "github"
                  ? "অপেক্ষা করুন..."
                  : "GitHub দিয়ে চালিয়ে যান"}
              </span>
            </button>
          </div>

          <p className="mt-5 text-center text-sm">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-[#008A43] hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </section>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[#707A72] transition hover:text-[#008A43]"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F0F5F0] p-6">
          <div className="mx-auto max-w-md animate-pulse space-y-4">
            <div className="mx-auto h-8 w-40 rounded bg-[#DCE5DD]" />
            <div className="h-64 rounded-2xl bg-[#FAFCFA]" />
          </div>
        </main>
      }
    >
      <SignInForm />
    </Suspense>
  );
}