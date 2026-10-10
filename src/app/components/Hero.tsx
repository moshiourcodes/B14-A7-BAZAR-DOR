
"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(
      new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );
  }, []);

  const scrollToProducts = () => {
    document.getElementById("সর্ব-পণ্য")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="bg-[#f1f6f0] px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[280px] max-w-[1280px] grid-cols-1 items-center gap-5 overflow-hidden rounded-[28px] border border-[#dce6dc] bg-[#fbfdfb] px-5 py-7 sm:px-8 md:min-h-[310px] md:grid-cols-[1.5fr_0.7fr] md:px-10 md:py-8 lg:grid-cols-[1.7fr_0.8fr] lg:px-12">
        {/* Left: Hero content */}
        <div className="flex flex-col items-start">
          {/* Date badge */}
          <span className="inline-flex rounded-full bg-[#e1f1e7] px-3.5 py-1.5 text-xs font-medium text-green-700 sm:text-sm">
            {date || "\u00a0"}
          </span>

          {/* Main heading */}
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-[1.35] tracking-tight text-[#202820] sm:text-4xl lg:text-[42px] lg:leading-[1.3]">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#66716a] sm:text-base sm:leading-8">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, চিনি ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং
            দামের পরিবর্তন এক জায়গায়।
          </p>

          {/* CTA button */}
          <button
            type="button"
            onClick={scrollToProducts}
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white shadow-md shadow-green-800/25 transition duration-200 hover:-translate-y-0.5 hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
          >
            সব পণ্য দেখুন
          </button>
        </div>

        {/* Right: Grocery basket illustration */}
        <div
          className="mx-auto flex w-full max-w-[300px] items-center justify-center md:max-w-[340px] lg:max-w-[380px]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 320 280"
            className="h-auto w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow */}
            <ellipse
              cx="160"
              cy="258"
              rx="128"
              ry="13"
              fill="#202820"
              opacity=".09"
            />

            {/* Red tomato */}
            <circle cx="110" cy="105" r="42" fill="#F04449" />
            <ellipse
              cx="96"
              cy="94"
              rx="11"
              ry="16"
              fill="#FF9292"
              opacity=".8"
            />
            <path
              d="M110 67 L104 51 L119 61 L132 51 L127 70"
              fill="#15803D"
            />

            {/* Green pepper */}
            <path
              d="M158 91 C148 57 163 32 184 29 C207 25 225 49 224 78 C242 96 238 123 219 136 L174 137 C156 123 150 106 158 91Z"
              fill="#20C765"
            />
            <path
              d="M183 44 C183 30 171 20 163 18 M183 44 C185 29 194 18 207 14"
              stroke="#15803D"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <ellipse
              cx="203"
              cy="85"
              rx="9"
              ry="16"
              fill="#8AE6A7"
              opacity=".8"
              transform="rotate(24 203 85)"
            />

            {/* Purple onion */}
            <ellipse cx="77" cy="142" rx="26" ry="19" fill="#A855F7" />
            <path
              d="M77 124 Q79 112 91 109"
              stroke="#15803D"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Orange tomato */}
            <ellipse cx="153" cy="135" rx="25" ry="19" fill="#F97316" />
            <path
              d="M152 117 L148 109 L158 114 L165 107 L163 119"
              fill="#15803D"
            />

            {/* Yellow fruit */}
            <ellipse cx="237" cy="140" rx="26" ry="19" fill="#F9A80D" />
            <path
              d="M235 121 Q238 108 251 105"
              stroke="#15803D"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Basket body */}
            <path
              d="M54 166 H266 L249 247 Q247 255 237 255 H83 Q73 255 70 245Z"
              fill="#B45309"
            />

            {/* Basket weave */}
            <path
              d="M76 183 L87 245 M113 178 L120 249 M151 174 L151 250 M190 174 L185 249 M229 178 L220 245"
              stroke="#873C0A"
              strokeWidth="4"
              strokeLinecap="round"
              opacity=".85"
            />

            <path
              d="M65 198 Q108 211 157 198 T255 198 M70 221 Q116 234 160 221 T250 221 M77 242 Q115 251 160 242 T244 242"
              stroke="#D97724"
              strokeWidth="5"
              strokeLinecap="round"
              opacity=".8"
            />

            {/* Basket rim */}
            <path
              d="M49 162 H271 L266 183 H54Z"
              fill="#92400E"
            />
            <path
              d="M54 165 H266"
              stroke="#78350F"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
