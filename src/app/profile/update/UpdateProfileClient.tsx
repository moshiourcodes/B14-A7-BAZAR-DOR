"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfileClient() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState<string | null>(null);
  const [loading, startTransition] = useTransition();

  const currentName = session?.user?.name ?? "";
  const inputName = name ?? currentName;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = inputName.trim();

    if (!trimmedName) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    if (trimmedName === currentName) {
      toast.error("আপনি কোনো পরিবর্তন করেননি।");
      return;
    }

    startTransition(async () => {
      try {
        const { error } = await authClient.updateUser({
          name: trimmedName,
        });

        if (error) {
          toast.error(error.message || "নাম আপডেট করা যায়নি।");
          return;
        }

        setName(null);
        toast.success("আপনার তথ্য আপডেট হয়েছে!");

        router.replace("/profile");
        router.refresh();
      } catch {
        toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    });
  }

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#F0F5F0] p-6">
        <div className="mx-auto max-w-3xl animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-[#DCE5DD]" />
          <div className="h-64 rounded-2xl bg-[#FAFCFA]" />
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#F0F5F0] p-8 text-center text-[#263329]">
        <p>আপডেট করতে আগে সাইন ইন করুন।</p>

        <Link
          className="mt-4 inline-block text-[#008A43] hover:underline"
          href="/sign-in"
        >
          সাইন ইন
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 py-10 text-[#263329]">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">তথ্য আপডেট</h1>
          <p className="mt-1 text-sm text-[#707A72]">
            আপনার নাম পরিবর্তন করুন।
          </p>
        </header>

        <section className="rounded-2xl border border-[#DFE8E0] bg-[#FAFCFA] p-5 sm:p-8">
          <h2 className="font-bold">তথ্য</h2>

          <form onSubmit={handleSubmit} className="mt-8">
            <label
              htmlFor="name"
              className="mb-2 block text-base font-medium"
            >
              নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={inputName}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={100}
              disabled={loading}
              placeholder="আপনার নাম লিখুন"
              className="min-h-12 w-full rounded-lg border border-[#DCE5DD] bg-transparent px-4 py-3 text-base outline-none transition focus:border-[#008A43] focus:ring-2 focus:ring-[#008A43]/10 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-[#008A43] px-4 py-3 font-semibold text-white shadow-[0_3px_0_#006C34] transition hover:bg-[#00783A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>

          <Link
            href="/profile"
            className="mt-6 block text-center text-[#008A43] hover:underline"
          >
            ← প্রোফাইলে ফিরে যান
          </Link>
        </section>
      </div>
    </main>
  );
}