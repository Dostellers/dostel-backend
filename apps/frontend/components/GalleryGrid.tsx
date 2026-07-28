"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  name: string;
}

export default function GalleryGrid({ images, name }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-96 rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-muted)]">
        <div className="col-span-2 row-span-2 relative cursor-pointer group" onClick={() => setLightbox(0)}>
          <Image 
            src={images[0]} 
            alt={name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {images.slice(1, 4).map((img, i) => (
          <div 
            key={i} 
            className="relative cursor-pointer group" 
            onClick={() => setLightbox(i + 1)}
          >
            <Image 
              src={img} 
              alt={`${name} ${i + 2}`} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
        <div 
          className="relative cursor-pointer group" 
          onClick={() => setLightbox(0)}
        >
          <Image 
            src={images[0]} 
            alt={`${name} gallery`} 
            fill 
            className="object-cover brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-200">
            <span className="px-4 py-2 bg-white/90 text-[var(--color-brand-primary)] text-xs font-bold rounded-full backdrop-blur-sm">
              View all photos
            </span>
          </div>
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button 
            className="absolute top-4 right-4 text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] transition-colors duration-200"
            onClick={() => setLightbox(null)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-4xl max-h-[80vh] mx-4 aspect-video">
            <Image 
              src={images[lightbox]} 
              alt={name} 
              fill 
              className="object-contain rounded-xl shadow-2xl"
            />
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200"
                  onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length); }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200"
                  onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length); }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}