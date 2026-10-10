"use client";

import { useEffect, useState } from "react";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryIcon?: string;
  image?: string;
  unit: string;
  today: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const response = await fetch(`${API_URL}/products`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result: unknown = await response.json();

        const payload = Array.isArray(result)
          ? result
          : result &&
              typeof result === "object" &&
              "data" in result &&
              Array.isArray(result.data)
            ? result.data
            : null;

        if (!payload) {
          throw new Error("Invalid products API response");
        }

        setProducts(payload as Product[]);
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Price ticker API error:", err);
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("bn-BD", {
      maximumFractionDigits: 2,
    }).format(price);

  if (loading) {
    return (
      <div className="flex h-11 items-center border-y border-[#DCE5DD] bg-white px-4">
        <span className="animate-pulse text-sm text-[#68716A]">
          আজকের বাজারদর লোড হচ্ছে...
        </span>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="flex h-11 items-center border-y border-[#DCE5DD] bg-white px-4">
        <p className="text-sm text-[#68716A]">
          এই মুহূর্তে বাজারদর দেখানো যাচ্ছে না।
        </p>
      </div>
    );
  }

  // Duplicate items for continuous scrolling.
  const tickerItems = [...products, ...products];

  return (
    <div
      className="w-full overflow-hidden border-y border-[#DCE5DD] bg-white"
      aria-label="আজকের পণ্যের বাজারদর"
    >
      <button
        type="button"
        onClick={() => setIsPaused((previous) => !previous)}
        aria-pressed={isPaused}
        aria-label={
          isPaused
            ? "বাজারদরের scrolling চালু করুন"
            : "বাজারদরের scrolling থামান"
        }
        className="block w-full cursor-pointer text-left"
      >
        <div
          className={`ticker-track flex w-max items-center py-3 ${
            isPaused ? "ticker-paused" : ""
          }`}
        >
          {tickerItems.map((product, index) => {
            const direction = product.change?.dir ?? "flat";
            const percentage = Number(product.change?.pct ?? 0);

            const changeColor =
              direction === "up"
                ? "text-red-600"
                : direction === "down"
                  ? "text-green-700"
                  : "text-gray-500";

            const arrow =
              direction === "up" ? "▲" : direction === "down" ? "▼" : "—";

            return (
              <span
                key={`${product.id}-${index}`}
                className="mx-5 inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm"
              >
                <span className="text-lg" aria-hidden="true">
                  {product.image || product.categoryIcon || "🛒"}
                </span>

                <span className="font-semibold text-[#202922]">
                  {product.nameBn}
                </span>

                <span className="text-[#68716A]">
                  {formatPrice(product.today)} টাকা
                  {product.unit ? `/${product.unit}` : ""}
                </span>

                <span className={`font-bold ${changeColor}`}>
                  {arrow} {formatPrice(Math.abs(percentage))}%
                </span>

                <span className="ml-3 text-[#DCE5DD]" aria-hidden="true">
                  |
                </span>
              </span>
            );
          })}
        </div>
      </button>

      <style jsx>{`
        .ticker-track {
          animation: ticker-scroll 55s linear infinite;
          will-change: transform;
        }

        .ticker-track.ticker-paused {
          animation-play-state: paused;
        }

        @keyframes ticker-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
