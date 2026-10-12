
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <h1 className="text-8xl font-extrabold text-orange-500">
        404
      </h1>

      <h2 className="mt-4 text-3xl font-bold text-gray-900">
        Page Not Found!
      </h2>

      <p className="mt-3 text-lg text-gray-600">
        দুঃখিত! আপনি যে পেজটি খুঁজছেন, সেটি পাওয়া যায়নি।
      </p>

      <p className="mt-1 text-gray-500">
        হোম পেজে ফিরে যান এবং আপনার পছন্দের পণ্য খুঁজুন।
      </p>

      <Link
        href="/"
        className="mt-8 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
