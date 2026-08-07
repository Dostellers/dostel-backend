import { CalendarIcon, DownloadIcon, MapPinIcon, CheckIcon } from "./Icons";

interface ConfirmationCardProps {
  booking: {
    ref: string;
    hostelName: string;
    location: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    roomName: string;
    total: number;
  };
  contactEmail: string;
  contactPhone: string;
}

export default function ConfirmationCard({ booking, contactEmail, contactPhone }: ConfirmationCardProps) {
  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
  };

  const generateICS = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:Stay at ${booking.hostelName}`,
      `DTSTART:${new Date(booking.checkIn).toISOString().replace(/[-:]/g, "").split(".")[0]}`,
      `DTEND:${new Date(booking.checkOut).toISOString().replace(/[-:]/g, "").split(".")[0]}`,
      `LOCATION:${booking.location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dostel-${booking.ref}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="animate-[fadeIn_400ms_ease-out] text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckIcon className="h-8 w-8 text-success" />
        </div>
        <h1 className="font-heading text-2xl font-semibold text-forest-900">Booking confirmed!</h1>
        <p className="mt-2 text-sm text-stone-400">
          Ref: <span className="font-mono font-medium text-forest-700">{booking.ref}</span>
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-4">
        <div>
          <p className="font-semibold text-forest-900">{booking.hostelName}</p>
          <p className="text-sm text-stone-400">{booking.location}</p>
        </div>

        <div className="flex gap-4 text-sm">
          <div>
            <p className="text-xs text-stone-400">Check-in</p>
            <p className="font-medium text-forest-900">{formatDate(booking.checkIn)} · 2 PM</p>
          </div>
          <div>
            <p className="text-xs text-stone-400">Check-out</p>
            <p className="font-medium text-forest-900">{formatDate(booking.checkOut)} · 11 AM</p>
          </div>
          <div className="ml-auto">
            <p className="text-xs text-stone-400">Duration</p>
            <p className="font-medium text-forest-900">{booking.nights} {booking.nights === 1 ? "night" : "nights"}</p>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-600">{booking.roomName}</span>
            <span className="font-semibold text-forest-900">₹{booking.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-3">
        <h3 className="font-semibold text-forest-900 text-sm">What to bring</h3>
        <ul className="space-y-1.5 text-sm text-stone-600">
          <li className="flex items-start gap-2">
            <span aria-hidden="true">•</span>
            Govt-approved photo ID (original)
          </li>
          <li className="flex items-start gap-2">
            <span aria-hidden="true">•</span>
            Downloaded booking confirmation
          </li>
          <li className="flex items-start gap-2">
            <span aria-hidden="true">•</span>
            Power bank (limited sockets in dorms)
          </li>
          <li className="flex items-start gap-2">
            <span aria-hidden="true">•</span>
            Earplugs (recommended for shared dorms)
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-3">
        <h3 className="font-semibold text-forest-900 text-sm">How to reach</h3>
        <p className="text-sm text-stone-600">
          Reach out to the hostel for the best route from your location. Check your email for detailed directions.
        </p>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(booking.hostelName + " " + booking.location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-500 hover:text-forest-700 transition-colors"
        >
          <MapPinIcon className="h-4 w-4" />
          View on Google Maps →
        </a>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={generateICS}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-forest-500 px-4 text-sm font-medium text-forest-500 transition-all duration-150 active:scale-[0.97] hover:bg-forest-100 focus-visible:outline-2 focus-visible:outline-sky"
        >
          <CalendarIcon className="h-4 w-4" />
          Add to Calendar
        </button>
        <button
          type="button"
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-forest-500 px-4 text-sm font-medium text-forest-500 transition-all duration-150 active:scale-[0.97] hover:bg-forest-100 focus-visible:outline-2 focus-visible:outline-sky"
        >
          <DownloadIcon className="h-4 w-4" />
          Download Receipt
        </button>
      </div>

      <div className="text-center text-xs text-stone-400">
        <p>We&apos;ve sent your booking details to:</p>
        <p className="text-stone-600">{contactEmail} · {contactPhone}</p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
