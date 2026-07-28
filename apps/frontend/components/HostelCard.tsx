import Link from "next/link";
import Image from "next/image";
import SocialProof from "./SocialProof";
import { TrendingIcon } from "./Icons";

interface HostelCardProps {
  slug: string;
  name: string;
  location: string;
  tagline: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  isNew?: boolean;
  isTrending?: boolean;
  soldOut?: boolean;
  bookedThisWeek?: number;
  dostellerPrice?: number;
  variant?: "grid" | "list";
}

export default function HostelCard({
  slug,
  name,
  location,
  tagline,
  price,
  rating,
  reviewCount,
  image,
  tags,
  isNew,
  isTrending,
  soldOut,
  bookedThisWeek,
  dostellerPrice,
  variant = "grid",
}: HostelCardProps) {
  if (variant === "list") {
    return (
      <Link
        href={`/hostels/${slug}`}
        className={`group flex gap-4 rounded-xl border border-stone-200 bg-white p-3 transition-all duration-250 hover:shadow-md hover:-translate-y-0.5 ${
          soldOut ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-32">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="128px"
          />
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-600">
                Sold out
              </span>
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-forest-900 truncate">{name}</h3>
              <div className="flex items-center gap-1 shrink-0">
                <svg className="h-3.5 w-3.5 fill-sunset text-sunset" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-semibold text-forest-900">{rating}</span>
                <span className="text-xs text-stone-400">({reviewCount})</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">{location}</p>
            <p className="text-xs text-stone-400 mt-1 line-clamp-1">{tagline}</p>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-forest-900">₹{price}</span>
              <span className="text-xs text-stone-400">/night</span>
              {dostellerPrice && (
                <span className="text-xs font-medium text-forest-500">Dosteller ₹{dostellerPrice}</span>
              )}
            </div>
            <div className="flex gap-1">
              {isNew && (
                <span className="rounded-full bg-forest-500 px-2 py-0.5 text-xs font-medium text-white">New</span>
              )}
              {isTrending && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sunset px-2 py-0.5 text-xs font-medium text-white">
                  <TrendingIcon className="h-3 w-3" />
                  Trending
                </span>
              )}
            </div>
          </div>
          {bookedThisWeek && <SocialProof count={bookedThisWeek} label="booked this week" />}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/hostels/${slug}`}
      className={`group block transition-all duration-250 hover:-translate-y-0.5 ${
        soldOut ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white hover:shadow-md">
        <div className="relative aspect-[5/4] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {isNew && (
              <span className="rounded-full bg-forest-500 px-2.5 py-1 text-xs font-semibold text-white uppercase tracking-wider">
                New launch
              </span>
            )}
            {isTrending && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sunset px-2.5 py-1 text-xs font-semibold text-white uppercase tracking-wider">
                <TrendingIcon className="h-3.5 w-3.5" />
                Trending
              </span>
            )}
            {soldOut && (
              <span className="rounded-full bg-stone-600 px-2.5 py-1 text-xs font-semibold text-white uppercase tracking-wider">
                Sold out
              </span>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-xs font-medium text-white/80 line-clamp-1 mb-1">{tagline}</p>
            <h3 className="font-semibold text-white text-base leading-tight line-clamp-1">{name}</h3>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 fill-sunset text-sunset" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-semibold text-white">{rating}</span>
                <span className="text-xs text-white/60">({reviewCount})</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-white text-sm">₹{price}</span>
                <span className="text-xs text-white/60">/night</span>
                {dostellerPrice && (
                  <p className="text-xs font-medium text-forest-100">Dosteller ₹{dostellerPrice}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 space-y-2">
          <p className="text-xs text-stone-400">{location}</p>
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-600">
                {tag}
              </span>
            ))}
          </div>
          {bookedThisWeek && <SocialProof count={bookedThisWeek} label="booked this week" />}
        </div>
      </div>
    </Link>
  );
}
