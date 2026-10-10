export default function Footer() {
  return (
    <footer className="w-full border-t border-[#E1E9E2] bg-[#F8FBF8]">
      <div className="mx-auto flex min-h-21 max-w-360 flex-col items-center justify-between gap-3 px-5 py-5 sm:px-8 md:min-h-21 md:flex-row md:gap-6 md:px-12 lg:px-[6%]">
        <p className="text-center text-sm font-normal leading-6 text-[#26332B] md:text-left md:text-base">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="text-center text-sm font-normal leading-6 text-[#26332B] md:text-right md:text-base">
          সকল দাম সম্ভাব্য; বাজার অবস্থার উপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>

      
    </footer>
  );
}
