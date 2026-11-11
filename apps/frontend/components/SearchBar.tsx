"use client";
import { Suspense } from "react";
import SearchBarInner from "./SearchBarInner";

interface SearchBarProps {
  variant?: "home" | "sticky" | "compact" | "hero";
  dark?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  destinations?: { label: string; slug: string }[];
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <Suspense fallback={<div className="h-14 w-full rounded-2xl bg-white/90 shadow animate-pulse" />}>
      <SearchBarInner {...props} />
    </Suspense>
  );
}
