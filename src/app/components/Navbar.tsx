"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

type User = {
  name: string;
  avatarUrl?: string;
};

type NavbarProps = {
  user?: User | null;
  onSignOut?: () => void;
};

const categories = [
  { name: "চাল", emoji: "🍚", href: "/?category=rice" },
  { name: "ডাল", emoji: "🫘", href: "/?category=lentils" },
  { name: "তেল", emoji: "🛢️", href: "/?category=oil" },
  { name: "সবজি", emoji: "🥬", href: "/?category=vegetables" },
  { name: "মাছ", emoji: "🐟", href: "/?category=fish" },
  { name: "মাংস", emoji: "🍗", href: "/?category=meat" },
  { name: "চিনি-দুধ", emoji: "🥛", href: "/?category=dairy" },
  { name: "মসলা", emoji: "🌶️", href: "/?category=spices" },
];

export default function Navbar({ user = null, onSignOut }: NavbarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Format the current date for Bangladesh.
  const date = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  // Read the selected category from the URL.
  const categoryParam = searchParams.get("category");

  const categoryFromUrl = categories.find(
    (category) => category.href.split("=")[1] === categoryParam,
  );

  // Keep the selected category synchronized with navigation.
  const activeCategory = selectedCategory ?? categoryFromUrl?.name ?? "চাল";

  // Handle category selection.
  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setMenuOpen(false);
  };

  // Determine whether the current page is the homepage.
  const isHomePage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-[#fbfcfa]">
      {/* Top Navbar */}
      <div className="mx-auto flex min-h-19 max-w-360 items-center justify-between px-4 sm:px-6 lg:px-17.5">
        {/* Logo */}
        <Link
          href="/"
          aria-label="বাজার দর হোম"
          onClick={() => setSelectedCategory(null)}
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

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-8 sm:flex">
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-bold text-gray-800 transition hover:text-green-700"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}

                {user.name}
              </Link>

              <button
                type="button"
                onClick={onSignOut}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-100"
              >
                সাইন আউট
              </button>
            </>
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

        {/* Mobile Menu Button */}
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

      {/* Desktop Categories */}
      <nav aria-label="পণ্যের বিভাগ" className="border-t border-gray-100">
        <div className="mx-auto hidden max-w-360 items-center gap-2 overflow-x-auto px-4 py-2 sm:flex sm:px-6 lg:gap-3 lg:px-17.5">
          {categories.map((category) => {
            const isActive = isHomePage && activeCategory === category.name;

            return (
              <Link
                key={category.name}
                href={category.href}
                onClick={() => handleCategoryClick(category.name)}
                aria-current={isActive ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-green-100 text-green-800"
                    : "text-gray-700 hover:bg-gray-100 hover:text-green-700"
                }`}
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-md sm:hidden">
          <nav
            aria-label="মোবাইল পণ্যের বিভাগ"
            className="grid grid-cols-2 gap-2"
          >
            {categories.map((category) => {
              const isActive = isHomePage && activeCategory === category.name;

              return (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={() => handleCategoryClick(category.name)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-50 text-gray-700 hover:bg-green-50"
                  }`}
                >
                  <span>{category.emoji}</span>
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Authentication */}
          <div className="mt-4 flex gap-3 border-t border-gray-100 pt-4">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-center text-sm font-bold text-gray-800"
                >
                  প্রোফাইল
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onSignOut?.();
                  }}
                  className="flex-1 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600"
                >
                  সাইন আউট
                </button>
              </>
            ) : (
              <>
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
                  className="flex-1 rounded-lg bg-green-700 px-3 py-2.5 text-center text-sm font-bold text-white transition hover:bg-green-800"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}














