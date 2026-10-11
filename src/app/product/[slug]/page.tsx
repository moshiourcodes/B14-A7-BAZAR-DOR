import Link from "next/link";
import { notFound } from "next/navigation";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id?: number | string;
  slug?: string;
  name?: string;
  nameBn?: string;
  name_bn?: string;
  title?: string;
  category?: string | { name?: string; nameBn?: string };
  categoryName?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  image?: string;
  unit?: string;
  today?: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: {
    dir?: string;
    pct?: number;
  };
  markets?: Market[];
};

function extractProduct(value: unknown): Product | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const obj = value as Record<string, unknown>;

  if (obj.product && typeof obj.product === "object") {
    return extractProduct(obj.product);
  }

  if (obj.data && typeof obj.data === "object") {
    return extractProduct(obj.data);
  }

  if (obj.today !== undefined && Array.isArray(obj.markets)) {
    return obj as unknown as Product;
  }

  return null;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${API_URL}/products/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return null;
    }

    const result: unknown = await response.json();

    return extractProduct(result);
  } catch (error) {
    console.error("Product API error:", error);
    return null;
  }
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

function getName(product: Product) {
  return (
    product.nameBn ??
    product.name_bn ??
    product.name ??
    product.title ??
    "পণ্যের নাম"
  );
}

function getCategory(product: Product) {
  if (typeof product.category === "object" && product.category) {
    return (
      product.category.nameBn ??
      product.category.name ??
      product.categoryNameBn ??
      product.categoryName ??
      "অন্যান্য"
    );
  }

  return (
    product.categoryNameBn ??
    product.categoryName ??
    product.category ??
    "অন্যান্য"
  );
}

function getUnit(unit?: string) {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    gram: "প্রতি গ্রাম",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
    dozen: "প্রতি ডজন",
  };

  return units[unit?.toLowerCase() ?? ""] ?? unit ?? "প্রতি ইউনিট";
}

function getMarketAverage(market: Market) {
  return (Number(market.min) + Number(market.max)) / 2;
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const markets = product.markets ?? [];
  const todayPrice = Number(product.today ?? 0);

  const minPrice = markets.length
    ? Math.min(...markets.map((market) => Number(market.min)))
    : todayPrice;

  const maxPrice = markets.length
    ? Math.max(...markets.map((market) => Number(market.max)))
    : todayPrice;

  const averagePrice = markets.length
    ? markets.reduce((total, market) => total + getMarketAverage(market), 0) /
      markets.length
    : todayPrice;

  const direction = product.change?.dir ?? "stable";
  const isUp = direction === "up";
  const isDown = direction === "down";

  const changeColor = isUp
    ? "text-red-600"
    : isDown
      ? "text-green-700"
      : "text-gray-500";

  const changeSymbol = isUp ? "▲" : isDown ? "▼" : "—";
  const productName = getName(product);
  const categoryName = getCategory(product);

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-4 py-6 text-[#263329] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500"
        >
          <Link href="/" className="transition hover:text-green-700">
            হোম
          </Link>

          <span>›</span>

          <Link
            href={
              typeof product.category === "string"
                ? `/category/${product.category}`
                : "/"
            }
            className="transition hover:text-green-700"
          >
            {categoryName}
          </Link>

          <span>›</span>

          <span className="font-semibold text-[#263329]">{productName}</span>
        </nav>

        {/* Product summary */}
        <section className="mb-6 flex flex-col justify-between gap-6 rounded-3xl border border-[#dfe7de] bg-[#fbfcfa] p-5 sm:p-7 lg:flex-row lg:items-center">
          <div className="flex min-w-0 items-start gap-4 sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#f0f4ee] text-4xl">
              {product.image || product.categoryIcon || "🛒"}
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {productName}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {getUnit(product.unit)} · {categoryName}
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                বিভিন্ন বাজারের আজকের দামের তথ্য এক জায়গায় দেখুন।
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  {categoryName}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {getUnit(product.unit)}
                </span>
              </div>
            </div>
          </div>

          {/* Today's price */}
          <div className="shrink-0 rounded-2xl bg-[#f0f4ee] px-8 py-5 text-center lg:min-w-52">
            <p className="text-sm text-gray-500">আজকের দাম</p>

            <p className="mt-1 text-3xl font-extrabold">
              {formatPrice(todayPrice)}
            </p>

            <p className="mt-1 text-sm text-gray-500">টাকা / ইউনিট</p>

            {product.change && (
              <p className={`mt-3 text-sm font-bold ${changeColor}`}>
                {changeSymbol} {formatPrice(Number(product.change.pct ?? 0))}%
              </p>
            )}
          </div>
        </section>

        {/* Price summary */}
        <section className="mb-6 rounded-3xl border border-[#dfe7de] bg-[#fbfcfa] p-5 sm:p-7">
          <h2 className="mb-5 text-xl font-extrabold">দামের সারসংক্ষেপ</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Minimum price */}
            <div className="rounded-2xl bg-[#f0f4ee] p-5 sm:p-6">
              <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>

              <p className="mt-2 text-2xl font-extrabold text-green-700">
                {formatPrice(minPrice)}{" "}
                <span className="text-base font-medium">টাকা</span>
              </p>

              <p className="mt-2 text-sm text-gray-500">
                সবচেয়ে কম দামের বাজার
              </p>
            </div>

            {/* Maximum price */}
            <div className="rounded-2xl bg-[#f0f4ee] p-5 sm:p-6">
              <p className="text-sm text-gray-500">সর্বাধিক দাম</p>

              <p className="mt-2 text-2xl font-extrabold text-red-600">
                {formatPrice(maxPrice)}{" "}
                <span className="text-base font-medium">টাকা</span>
              </p>

              <p className="mt-2 text-sm text-gray-500">
                সবচেয়ে বেশি দামের বাজার
              </p>
            </div>

            {/* Average price */}
            <div className="rounded-2xl bg-[#f0f4ee] p-5 sm:p-6">
              <p className="text-sm text-gray-500">গড় দাম</p>

              <p className="mt-2 text-2xl font-extrabold text-green-700">
                {formatPrice(averagePrice)}{" "}
                <span className="text-base font-medium">টাকা</span>
              </p>

              <p className="mt-2 text-sm text-gray-500">বাজারগুলোর গড় হিসাব</p>
            </div>
          </div>
        </section>

        {/* Market-wise prices */}
        <section className="rounded-3xl border border-[#dfe7de] bg-[#fbfcfa] p-5 sm:p-7">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold">বাজারভিত্তিক আজকের দাম</h2>

            <p className="mt-2 text-sm text-gray-500">
              বিভিন্ন বাজারের সর্বনিম্ন ও সর্বাধিক দাম দেখুন।
            </p>
          </div>

          {markets.length === 0 ? (
            <p className="rounded-xl bg-[#f0f4ee] p-6 text-center text-gray-500">
              এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#dfe7de]">
              <table className="w-full min-w-162.5 border-collapse text-left text-sm">
                <thead className="bg-[#f0f4ee] text-gray-600">
                  <tr>
                    <th className="px-4 py-4 font-semibold">বাজার</th>
                    <th className="px-4 py-4 font-semibold">বিভাগ</th>
                    <th className="px-4 py-4 text-right font-semibold">
                      সর্বনিম্ন
                    </th>
                    <th className="px-4 py-4 text-right font-semibold">
                      সর্বাধিক
                    </th>
                    <th className="px-4 py-4 text-right font-semibold">গড়</th>
                  </tr>
                </thead>

                <tbody>
                  {markets.map((market, index) => (
                    <tr
                      key={`${market.market}-${market.division}`}
                      className={
                        index % 2 === 0
                          ? "border-t border-[#e4e9e2] bg-[#fbfcfa]"
                          : "border-t border-[#e4e9e2] bg-[#f0f4ee]"
                      }
                    >
                      <td className="whitespace-nowrap px-4 py-4 font-medium">
                        {market.market}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        {market.division}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right">
                        {formatPrice(Number(market.min))} টাকা
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right">
                        {formatPrice(Number(market.max))} টাকা
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right font-bold">
                        {formatPrice(getMarketAverage(market))} টাকা
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
