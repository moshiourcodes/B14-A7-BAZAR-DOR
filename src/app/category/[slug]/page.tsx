"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

type Category = {
  slug?: string;
  nameBn?: string;
  name?: string;
  icon?: string;
  emoji?: string;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  image?: string;
  unit: string;
  today: number;
  change?: {
    dir?: "up" | "down" | "flat";
    pct?: number;
  };
};

type SortType = "default" | "low" | "high";

function extractData(value: unknown): unknown {
  if (Array.isArray(value)) return value;

  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;

    if (Array.isArray(object.data)) return object.data;

    if (object.data && typeof object.data === "object") {
      return object.data;
    }
  }

  return value;
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[20px] border border-[#DCE5DD] bg-[#FAFCFA] p-5"
        >
          <div className="flex gap-4">
            <div className="h-14 w-14 rounded-xl bg-[#E5EBE5]" />
            <div className="flex-1 space-y-3 pt-2">
              <div className="h-4 w-2/3 rounded bg-[#E5EBE5]" />
              <div className="h-3 w-1/3 rounded bg-[#E5EBE5]" />
            </div>
          </div>
          <div className="mt-7 h-3 w-1/3 rounded bg-[#E5EBE5]" />
          <div className="mt-3 h-6 w-1/2 rounded bg-[#E5EBE5]" />
        </div>
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const direction = product.change?.dir ?? "flat";
  const percentage = Number(product.change?.pct ?? 0);

  const price = new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(product.today);

  const change = new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(Math.abs(percentage));

  const badgeClass =
    direction === "up"
      ? "bg-red-50 text-red-600"
      : direction === "down"
        ? "bg-green-50 text-green-700"
        : "bg-[#EFF3EF] text-[#202922]";

  const arrow = direction === "up" ? "▲" : direction === "down" ? "▼" : "—";

  return (
    <article className="rounded-[20px] border border-[#DCE5DD] bg-[#FAFCFA] p-5 transition hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-14.5 w-14.5 shrink-0 items-center justify-center rounded-2xl bg-[#EFF3EF] text-3xl">
          {product.image || product.categoryIcon || "🛒"}
        </div>

        <div>
          <h2 className="font-bold text-[#202922]">{product.nameBn}</h2>
          <p className="mt-1 text-sm text-[#68716A]">প্রতি {product.unit}</p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-2">
        <div>
          <p className="text-sm text-[#68716A]">আজকের দাম</p>
          <p className="mt-1 text-xl font-extrabold text-[#202922]">
            {price} <span className="text-base font-normal">টাকা</span>
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${badgeClass}`}
        >
          {arrow} {change}%
        </span>
      </div>
    </article>
  );
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortType>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategory() {
      setLoading(true);
      setError(false);
      setCategory(null);
      setProducts([]);

      try {
        const [categoryResponse, productResponse] = await Promise.all([
          fetch(`${API_URL}/categories/${encodeURIComponent(slug)}`, {
            signal: controller.signal,
            cache: "no-store",
          }),
          fetch(`${API_URL}/products?category=${encodeURIComponent(slug)}`, {
            signal: controller.signal,
            cache: "no-store",
          }),
        ]);

        if (!categoryResponse.ok || !productResponse.ok) {
          throw new Error("Category API request failed");
        }

        const [categoryJson, productJson] = await Promise.all([
          categoryResponse.json(),
          productResponse.json(),
        ]);

        const categoryData = extractData(categoryJson);
        const productData = extractData(productJson);

        if (
          !categoryData ||
          typeof categoryData !== "object" ||
          !Array.isArray(productData)
        ) {
          throw new Error("Unexpected API response");
        }

        setCategory(categoryData as Category);
        setProducts(productData as Product[]);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Category page error:", error);
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCategory();

    return () => controller.abort();
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "low") {
      return result.sort((a, b) => a.today - b.today);
    }

    if (sort === "high") {
      return result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sort]);

  const title = category?.nameBn || category?.name || slug;

  const icon = category?.icon || category?.emoji || "🛒";

  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-343.75">
        <header className="mb-7 flex items-center gap-4 rounded-[20px] border border-[#DCE5DD] bg-[#FAFCFA] p-5 sm:p-7">
          <span className="text-4xl" aria-hidden="true">
            {icon}
          </span>

          <div>
            <h1 className="text-2xl font-extrabold text-[#202922] sm:text-3xl">
              {title}
            </h1>

            <p className="mt-1 text-sm text-[#68716A]">
              {loading
                ? "পণ্যের তথ্য লোড হচ্ছে..."
                : `${products.length.toLocaleString("bn-BD")}টি পণ্যের আজকের দাম ও পরিবর্তন`}
            </p>
          </div>
        </header>

        <div className="mb-5 flex justify-end rounded-[20px] border border-[#DCE5DD] bg-[#FAFCFA] p-4">
          <label
            htmlFor="sort"
            className="flex items-center gap-3 text-sm text-[#68716A]"
          >
            সাজান
            <select
              id="sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortType)}
              disabled={loading || error}
              className="rounded-xl border border-[#D0D7D0] bg-white px-3 py-2.5 text-[#202922] outline-none focus:border-[#07883D]"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low">দাম: কম থেকে বেশি</option>
              <option value="high">দাম: বেশি থেকে কম</option>
            </select>
          </label>
        </div>

        {loading && <ProductSkeleton />}

        {!loading && error && (
          <div className="rounded-[20px] border border-[#DCE5DD] bg-[#FAFCFA] px-5 py-16 text-center">
            <h2 className="text-2xl font-bold text-[#202922]">
              তথ্য লোড করা যায়নি
            </h2>
            <p className="mt-2 text-[#68716A]">
              ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করো।
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[#07883D] px-6 py-3 font-bold text-white"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-[20px] border border-[#DCE5DD] bg-[#FAFCFA] px-5 py-16 text-center">
            <p className="text-5xl">🔎</p>
            <h2 className="mt-4 text-2xl font-extrabold text-[#202922]">
              ৪০৪ — কোনো পণ্য পাওয়া যায়নি
            </h2>
            <p className="mt-2 text-[#68716A]">
              এই ক্যাটাগরিতে কোনো পণ্য নেই অথবা ঠিকানা সঠিক নয়।
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-xl bg-[#07883D] px-6 py-3 font-bold text-white hover:bg-[#066D32]"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <p className="mb-5 text-sm text-[#68716A]">
              মোট {sortedProducts.length.toLocaleString("bn-BD")}টি পণ্য দেখানো
              হচ্ছে
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
