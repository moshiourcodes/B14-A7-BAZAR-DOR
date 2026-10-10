"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "https://openapi.programming-hero.com/api/bazardor/products";

type Product = {
  id?: string | number;
  _id?: string | number;
  slug?: string;

  name?: string;
  nameBn?: string;
  name_bn?: string;
  title?: string;

  icon?: string;
  emoji?: string;
  image?: string;
  imageUrl?: string;
  image_url?: string;
  thumbnail?: string;

  unit?: string;
  price?: number | string;
  today?: number | string;
  todayPrice?: number | string;
  today_price?: number | string;
  currentPrice?: number | string;
  current_price?: number | string;

  change?: unknown;
  changePercent?: number | string;
  change_percent?: number | string;
  changeDirection?: string;
  change_direction?: string;

  [key: string]: unknown;
};

type Direction = "up" | "down" | "flat";

function getProducts(value: unknown): Product[] {
  if (Array.isArray(value)) return value as Product[];

  if (!value || typeof value !== "object") return [];

  const obj = value as Record<string, unknown>;

  for (const key of ["data", "products", "result", "items"]) {
    const nested = obj[key];

    if (Array.isArray(nested)) {
      return nested as Product[];
    }

    if (nested && typeof nested === "object") {
      const found = getProducts(nested);
      if (found.length) return found;
    }
  }

  return [];
}

function firstValue(...values: unknown[]): unknown {
  return values.find(
    (value) => value !== undefined && value !== null && value !== "",
  );
}

function getName(product: Product): string {
  const value = firstValue(
    product.nameBn,
    product.name_bn,
    product.name,
    product.title,
  );

  return typeof value === "string" ? value : "পণ্য";
}

function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value !== "string") return 0;

  const digits = "০১২৩৪৫৬৭৮৯";

  const normalized = value
    .replace(/[০-৯]/g, (digit) => String(digits.indexOf(digit)))
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "");

  return Number(normalized) || 0;
}

function getPrice(product: Product): number {
  const value = firstValue(
    product.todayPrice,
    product.today_price,
    product.today,
    product.currentPrice,
    product.current_price,
    product.price,
  );

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return toNumber(firstValue(obj.current, obj.today, obj.amount, obj.value));
  }

  return toNumber(value);
}

function getChangeValue(product: Product): number {
  const change = product.change;

  if (typeof change === "number" || typeof change === "string") {
    return toNumber(change);
  }

  if (change && typeof change === "object") {
    const obj = change as Record<string, unknown>;

    return toNumber(
      firstValue(obj.pct, obj.percentage, obj.percent, obj.value),
    );
  }

  return toNumber(firstValue(product.changePercent, product.change_percent));
}

function getDirection(product: Product): Direction {
  const change = product.change;
  let rawDirection: unknown = firstValue(
    product.changeDirection,
    product.change_direction,
  );

  if (change && typeof change === "object") {
    const obj = change as Record<string, unknown>;

    rawDirection = firstValue(obj.dir, obj.direction, obj.trend, rawDirection);
  }

  const direction = String(rawDirection ?? "")
    .toLowerCase()
    .trim();

  if (
    ["up", "increase", "increased", "rise", "rising", "বৃদ্ধি", "বেড়েছে"].some(
      (word) => direction.includes(word),
    )
  ) {
    return "up";
  }

  if (
    ["down", "decrease", "decreased", "fall", "falling", "কমেছে", "হ্রাস"].some(
      (word) => direction.includes(word),
    )
  ) {
    return "down";
  }

  const amount = getChangeValue(product);

  if (amount > 0) return "up";
  if (amount < 0) return "down";

  return "flat";
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

function getProductHref(product: Product): string {
  const id = firstValue(product.slug, product.id, product._id);

  return id !== undefined ? `/product/${encodeURIComponent(String(id))}` : "/";
}

function ProductVisual({ product }: { product: Product }) {
  const raw = firstValue(
    product.imageUrl,
    product.image_url,
    product.image,
    product.thumbnail,
    product.icon,
    product.emoji,
  );

  const icon = typeof raw === "string" ? raw.trim() : "";

  const isImage =
    /^https?:\/\//i.test(icon) ||
    icon.startsWith("/") ||
    icon.startsWith("data:image/");

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F0F5F0] text-2xl">
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={icon}
          alt={getName(product)}
          className="h-full w-full object-contain p-1"
          loading="lazy"
        />
      ) : icon ? (
        <span>{icon}</span>
      ) : (
        <span className="text-sm text-[#667168]">—</span>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const direction = getDirection(product);
  const change = Math.abs(getChangeValue(product));
  const price = getPrice(product);

  const badgeClass =
    direction === "up"
      ? "bg-[#FCEEEE] text-[#D93636]"
      : direction === "down"
        ? "bg-[#EAF7EE] text-[#159447]"
        : "bg-[#EFF3EF] text-[#59635B]";

  return (
    <Link
      href={getProductHref(product)}
      className="group flex min-w-0 flex-col justify-between rounded-2xl border border-[#DFE8E0] bg-[#FAFCFA] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#B8D8BF] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
    >
      <div className="flex min-w-0 items-center gap-3">
        <ProductVisual product={product} />

        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-[#26332B]">
            {getName(product)}
          </h3>
          <p className="mt-0.5 text-xs text-[#667168]">
            {typeof product.unit === "string" && product.unit
              ? `প্রতি ${product.unit}`
              : "প্রতি কেজি"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-[#667168]">আজকের দাম</p>
          <p className="mt-0.5 text-lg font-bold text-[#26332B]">
            {formatPrice(price)} টাকা
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}
        >
          {direction === "up" ? "▲" : direction === "down" ? "▼" : "—"}{" "}
          {formatPrice(change)}%
        </span>
      </div>
    </Link>
  );
}

function ProductGrid({
  title,
  products,
  direction,
  subtitle,
}: {
  title: string;
  products: Product[];
  direction?: Direction;
  subtitle?: string;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#26332B]">
        {direction === "up" && <span className="text-[#D93636]">▲</span>}
        {direction === "down" && <span className="text-[#159447]">▼</span>}
        {title}
      </h2>

      {subtitle && <p className="mb-4 text-sm text-[#788179]">{subtitle}</p>}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={String(
                firstValue(product.id, product._id, product.slug) ??
                  `${getName(product)}-${index}`,
              )}
              product={product}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-[#DFE8E0] bg-white p-5 text-sm text-[#667168]">
          এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
        </p>
      )}
    </section>
  );
}

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch(API_URL, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result: unknown = await response.json();
      const list = getProducts(result);

      if (list.length === 0) {
        throw new Error("API response-এ products list পাওয়া যায়নি।");
      }

      setProducts(list);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "পণ্যের তথ্য লোড করা যায়নি।",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(API_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result: unknown = await response.json();
        const list = getProducts(result);

        if (list.length === 0) {
          throw new Error("API response-এ products list পাওয়া যায়নি।");
        }

        if (!cancelled) {
          setProducts(list);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "পণ্যের তথ্য লোড করা যায়নি।",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-360 px-5 py-10 sm:px-8 lg:px-12">
        <p className="text-center text-[#667168]">পণ্যের তথ্য লোড হচ্ছে...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-360 px-5 py-10 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-center">
          <p role="alert" className="wrap-break-word text-sm text-red-600">
            পণ্যের তথ্য লোড করা যায়নি: {error}
          </p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError("");
              void loadProducts();
            }}
            className="mt-4 rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            আবার চেষ্টা করো
          </button>
        </div>
      </section>
    );
  }

  const risers = products
    .filter((product) => getDirection(product) === "up")
    .sort((a, b) => Math.abs(getChangeValue(b)) - Math.abs(getChangeValue(a)))
    .slice(0, 6);

  const fallers = products
    .filter((product) => getDirection(product) === "down")
    .sort((a, b) => Math.abs(getChangeValue(b)) - Math.abs(getChangeValue(a)))
    .slice(0, 6);

  return (
    <main className="w-full bg-[#F0F5F0]">
      <div className="mx-auto w-full max-w-360 px-5 py-8 sm:px-8 lg:px-12">
        <ProductGrid title="আজ দাম বেড়েছে" products={risers} direction="up" />

        <ProductGrid title="আজ দাম কমেছে" products={fallers} direction="down" />

     
<section
  id="সকল-পণ্য"
  className="scroll-mt-24"
>
  <ProductGrid
    title="সব পণ্য"
    products={products}
    subtitle={`মোট ${formatPrice(products.length)}টি পণ্য দেখানো হচ্ছে`}
  />
</section>

      </div>
    </main>
  );
}
