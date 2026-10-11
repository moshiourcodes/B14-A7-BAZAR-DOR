"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import SignOutButton from "@/app/components/SignOutButton";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (!file.type.startsWith("image/")) {
      setError("একটি সঠিক ছবি নির্বাচন করুন।");
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("ছবির সাইজ ১ MB-এর কম হতে হবে।");
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("ছবি পড়া যায়নি।"));
          }
        };

        reader.onerror = () => reject(new Error("ছবি পড়া যায়নি।"));

        reader.readAsDataURL(file);
      });

      const { error: updateError } = await authClient.updateUser({
        image: imageData,
      });

      if (updateError) {
        setError(updateError.message || "ছবি আপডেট করা যায়নি।");
        return;
      }

      setProfileImage(imageData);
      setSuccess("প্রোফাইল ছবি আপডেট হয়েছে।");
    } catch {
      setError("ছবি আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const user = session?.user;
    if (!user) return;

    const trimmedName = (name ?? user.name ?? "").trim();

    if (!trimmedName) {
      setError("আপনার নাম লিখুন।");
      return;
    }

    if (trimmedName === (savedName ?? user.name)) {
      setError("আপনি কোনো পরিবর্তন করেননি।");
      return;
    }

    startTransition(async () => {
      try {
        const { error: updateError } = await authClient.updateUser({
          name: trimmedName,
        });

        if (updateError) {
          setError(updateError.message || "নাম আপডেট করা যায়নি।");
          return;
        }

        setName(trimmedName);
        setSavedName(trimmedName);
        setSuccess("আপনার নাম সফলভাবে আপডেট হয়েছে।");
      } catch {
        setError("নাম আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    });
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F0F5F0] text-[#263329]">
        প্রোফাইল লোড হচ্ছে...
      </main>
    );
  }

  const user = session.user;
  const displayName = savedName ?? user.name;
  const displayImage = profileImage ?? user.image;

  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 py-10 text-[#263329]">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">আমার প্রোফাইল</h1>

          <p className="mt-2 text-base text-[#707A72]">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </header>

        <section className="flex flex-col gap-5 rounded-[26px] border border-[#DFE8E0] bg-[#FAFCFA] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <label
              htmlFor="profile-image"
              title="প্রোফাইল ছবি পরিবর্তন করুন"
              className={`group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-[24px] bg-[#E8EDE8] text-3xl font-bold text-[#008A43] ${
                isUploading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt="Profile photo"
                  width={96}
                  height={96}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                displayName?.charAt(0).toUpperCase() || "U"
              )}

              <span className="absolute inset-0 flex items-center justify-center bg-black/55 px-1 text-center text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                ছবি পরিবর্তন
              </span>
            </label>

            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="sr-only"
            />

            <span className="text-xs text-[#707A72]">
              {isUploading ? "আপলোড হচ্ছে..." : "ছবি পরিবর্তন"}
            </span>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2 className="wrap-break-word text-2xl font-semibold">
              {displayName}
            </h2>

            <p className="mt-1 break-all text-base text-[#707A72] sm:text-lg">
              {user.email}
            </p>
          </div>

          <div className="shrink-0 self-center">
            <SignOutButton />
          </div>
        </section>

        <section className="mt-8 rounded-[26px] border border-[#DFE8E0] bg-[#FAFCFA] p-6 sm:p-8">
          <h2 className="text-2xl font-bold">তথ্য</h2>

          <form onSubmit={handleSubmit} className="mt-12 px-0 sm:px-2">
            <label htmlFor="name" className="mb-3 block text-lg font-medium">
              নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={name ?? user.name ?? ""}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              required
              disabled={isSaving}
              placeholder="আপনার নাম লিখুন"
              className="min-h-14.5 w-full rounded-xl border border-[#DCE5DD] bg-transparent px-4 py-3 text-base outline-none transition focus:border-[#008A43] focus:ring-2 focus:ring-[#008A43]/15 disabled:opacity-60"
            />

            {error && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="mt-3 text-sm text-[#008A43]">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="mt-7 flex min-h-14.5 w-full items-center justify-center rounded-xl bg-[#008A43] px-5 py-3 text-lg font-semibold text-white shadow-[0_4px_0_#006C34] transition-colors hover:bg-[#00783A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008A43] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
