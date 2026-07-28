"use client";

import { useState, useEffect, useCallback } from "react";
import { heroSlides } from "@/lib/data";
import Image from "next/image";

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div className="relative w-full h-full">
      {heroSlides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg text-white/90 max-w-md">
                {slide.subtitle}
              </p>
              <button className="mt-4 px-6 py-2 bg-[var(--color-brand-secondary)] text-white text-sm font-bold rounded-xl hover:bg-[var(--color-brand-secondary)]/90 transition-colors duration-300">
                Explore Now
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full w-3 h-3 ${i === current ? "bg-white" : "bg-white/50"} hover:bg-white/70`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
