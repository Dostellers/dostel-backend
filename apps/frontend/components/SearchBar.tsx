"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const SearchBarInner = dynamic(() => import("./SearchBarInner"), { ssr: false });

interface SearchBarProps {
  variant?: "home" | "sticky" | "compact";
  dark?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <Suspense fallback={<div className="h-11 w-full max-w-2xl mx-auto rounded-2xl bg-white/10 animate-pulse" />}>
      <SearchBarInner {...props} />
    </Suspense>
  );
}
