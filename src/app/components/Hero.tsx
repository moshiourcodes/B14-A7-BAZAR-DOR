import Image from "next/image";

function getCurrentDate(): string {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

export default function Hero() {
  const currentDate = getCurrentDate();

  return (
    <main className="bg-[#F0F5F0]">
      <section className="mx-auto grid min-h-86.25 max-w-343.75 grid-cols-1 items-center gap-6 overflow-hidden rounded-[30px] border border-[#DCE5DD] bg-[#FAFCFA] px-5 py-8 sm:px-8 md:grid-cols-[1fr_320px] md:px-10 lg:px-12">
        <div className="flex flex-col items-start">
          <p className="mb-4 rounded-full bg-[#E1F1E6] px-4 py-1.5 text-sm font-medium text-[#07883D] sm:text-base">
            {currentDate}
          </p>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#202922] sm:text-4xl lg:text-[42px]">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-6 max-w-177.5 text-base leading-7 text-[#68716A] sm:text-lg sm:leading-8">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তৃত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <a
            href="#সকল-পণ্য"
            className="mt-8 inline-flex min-h-12.5 items-center justify-center rounded-xl bg-[#07883D] px-7 py-3 font-bold text-white shadow-md transition-colors duration-200 hover:bg-[#066D32] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#07883D]"
          >
            সব পণ্য দেখুন
          </a>
        </div>

        <div className="flex items-center justify-center md:justify-end">
          <Image
            src="/bazar-hero.png"
            alt="তাজা সবজির ঝুড়ি"
            width={320}
            height={270}
            priority
            className="h-auto w-full max-w-[320px] object-contain"
          />
        </div>
      </section>
    </main>
  );
}
