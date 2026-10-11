"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import PriceTicker from "./priceTicker";
import Image from "next/image";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

type Category = {
  id?: string;
  slug: string;
  nameBn: string;
  icon?: string;
  emoji?: string;
};

const fallbackCategories: Category[] = [
  { slug: "chal", nameBn: "চাল", icon: "🍚" },
  { slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { slug: "tel", nameBn: "তেল", icon: "🛢️" },
  { slug: "shobji", nameBn: "সবজি", icon: "🥬" },
  { slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { slug: "chini-dudh", nameBn: "চিনি-দুধ", icon: "🥛" },
  { slug: "moshla", nameBn: "মসলা", icon: "🌶️" },
];

function extractCategories(result: unknown): Category[] {
  let data: unknown = result;

  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    "data" in data
  ) {
    data = data.data;
  }

  if (!Array.isArray(data)) return [];

  return data.filter((item): item is Category =>
    Boolean(
      item &&
      typeof item === "object" &&
      "slug" in item &&
      typeof item.slug === "string" &&
      "nameBn" in item &&
      typeof item.nameBn === "string",
    ),
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [signingOut, setSigningOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const date = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const response = await fetch(`${API_URL}/categories`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const result: unknown = await response.json();
        const data = extractCategories(result);

        if (data.length > 0) {
          setCategories(data);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Category API error:", error);
      }
    }

    loadCategories();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const categoryParam = searchParams.get("category");

  const activeCategory = categories.find((category) => {
    if (pathname === `/category/${category.slug}`) {
      return true;
    }

    return pathname === "/" && categoryParam === category.slug;
  });

  const handleCategoryClick = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleLogoClick = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি।");
        return;
      }

      setMenuOpen(false);
      setProfileOpen(false);

      toast.success("সফলভাবে সাইন আউট হয়েছে।");

      router.replace("/sign-in");
      router.refresh();
    } catch {
      toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-[#FBFCFA]">
      <div className="mx-auto flex min-h-19 max-w-362.5 items-center justify-between gap-4 px-4 sm:px-6 lg:px-17.5">
        <Link
          href="/"
          aria-label="বাজার দর হোম"
          onClick={handleLogoClick}
          className="flex shrink-0 items-center gap-2"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-700 text-2xl">
            🛒
          </span>

          <span className="flex flex-col">
            <span className="text-xl font-extrabold leading-tight text-gray-900 sm:text-2xl">
              বাজার দর
            </span>

            <span className="mt-1 text-[10px] font-medium text-gray-600 sm:text-xs">
              {date}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          {isPending ? (
            <div className="h-10 w-36 animate-pulse rounded-lg bg-gray-200" />
          ) : session ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((previous) => !previous)}
                aria-label="প্রোফাইল মেনু"
                aria-expanded={profileOpen}
                aria-haspopup="true"
                className="flex items-center gap-3 rounded-xl px-2 py-2 text-gray-800 transition hover:bg-[#F0F5F0]"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    className="h-18 w-18 rounded-[22px] object-cover"
                  />
                ) : (
                  <span className="flex h-18 w-18 items-center justify-center rounded-[22px] bg-green-100 text-2xl font-bold text-green-800">
                    {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}

                <span className="max-w-40 truncate text-xl font-semibold">
                  {session.user.name}
                </span>

                <svg
                  className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.5 7.5a.75.75 0 0 1 1.06 0L10 10.94l3.44-3.44a.75.75 0 1 1 1.06 1.06l-3.97 3.97a.75.75 0 0 1-1.06 0L5.5 8.56a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-60 mt-4 w-[min(510px,calc(100vw-2rem))] rounded-[30px] border border-[#DFE8E0] bg-[#FAFCFA] p-8 shadow-[0_12px_24px_rgba(38,51,41,0.18)]">
                  <div className="mb-7">
                    <h2 className="wrap-break-word text-2xl font-semibold text-[#263329]">
                      {session.user.name}
                    </h2>

                    <p className="mt-1 break-all text-lg text-[#707A72]">
                      {session.user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl py-3 text-xl text-[#263329] transition hover:bg-[#F0F5F0]"
                  >
                    <svg
                      className="h-7 w-7 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5Z" />
                    </svg>
                    আমার প্রোফাইল
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="mt-2 flex w-full items-center gap-3 rounded-xl py-3 text-left text-xl text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    <svg
                      className="h-7 w-7 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 14 4 9l5-5" />
                      <path d="M4 9h10a6 6 0 0 1 0 12h-2" />
                    </svg>

                    {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-bold text-gray-800 transition hover:text-green-700"
              >
                সাইন ইন
              </Link>

              <Link
                href="/sign-up"
                className="rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-green-800/20 transition hover:bg-green-800"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-2xl text-gray-800 sm:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      <nav aria-label="পণ্যের বিভাগ" className="border-t border-gray-100">
        <div className="mx-auto hidden max-w-362.5 items-center gap-2 overflow-x-auto px-4 py-2 sm:flex sm:px-6 lg:gap-3 lg:px-17.5">
          {categories.map((category) => {
            const isActive = activeCategory?.slug === category.slug;

            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                onClick={handleCategoryClick}
                aria-current={isActive ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-green-100 text-green-800"
                    : "text-gray-700 hover:bg-gray-100 hover:text-green-700"
                }`}
              >
                <span>{category.icon || category.emoji || "🛒"}</span>
                <span>{category.nameBn}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-md sm:hidden">
          <nav
            aria-label="মোবাইল পণ্যের বিভাগ"
            className="grid grid-cols-2 gap-2"
          >
            {categories.map((category) => {
              const isActive = activeCategory?.slug === category.slug;

              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  onClick={handleCategoryClick}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-50 text-gray-700 hover:bg-green-50"
                  }`}
                >
                  <span>{category.icon || category.emoji || "🛒"}</span>
                  <span>{category.nameBn}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-gray-100 pt-4">
            {isPending ? (
              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
            ) : session ? (
              <div className="flex items-center justify-between gap-3">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-w-0 items-center gap-2 text-sm font-medium text-gray-800"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">
                      {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}

                  <span className="truncate">{session.user.name}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="shrink-0 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 disabled:opacity-60"
                >
                  {signingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-center text-sm font-bold text-gray-800"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg bg-green-700 px-3 py-2.5 text-center text-sm font-bold text-white"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <PriceTicker />
    </header>
  );
}
