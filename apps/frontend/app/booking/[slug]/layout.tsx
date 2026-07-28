import { BookingProvider } from "@/components/BookingProvider";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>;
}
