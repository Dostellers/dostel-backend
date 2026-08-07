import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Inter,
  JetBrains_Mono,
  Noto_Sans_Devanagari,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingProvider } from "@/components/BookingProvider";
import { ApolloProviderWrapper } from "@/lib/apollo-provider";

// Display — printed, not rendered. Replaces Playfair Display, which reads as
// the default "authentic travel brand" serif. See .paperclip/design/brand-platform.md
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

// Body — retained deliberately: most legible UI face at small sizes on low-end
// Android, and already in the bundle. The rebrand is carried by display + colour.
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

// Data — proof primitives only: timestamps, speeds, booking refs. Makes the
// Verified Hill-Stay Card read as an instrument reading, not marketing copy.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-data",
  subsets: ["latin"],
});

// Devanagari — the brand is bilingual at its root. दोस्त must be settable
// anywhere in the product, not trapped inside a logo bitmap.
const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-deva",
  subsets: ["devanagari"],
});

export const metadata: Metadata = {
  title: "Dostel — arrive a stranger",
  description:
    "दोस्त + hostel. Hostel stays in the Indian hills where the staff remember your name, the Wi-Fi speed is measured not claimed, and you can see who's in the room before you book.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable} ${jetbrainsMono.variable} ${notoDevanagari.variable}`}
    >
      <head>
        {/* Scroll-reveal hides content until IntersectionObserver fires. With
            JS off that would leave the page blank, so force it all visible. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen flex flex-col">
        <BookingProvider>
          <ApolloProviderWrapper>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ApolloProviderWrapper>
        </BookingProvider>
      </body>
    </html>
  );
}
