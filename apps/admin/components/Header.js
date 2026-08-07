import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Dostel Admin
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/" className="hover:underline">Dashboard</Link></li>
            <li><Link href="/hostels" className="hover:underline">Hostels</Link></li>
            <li><Link href="/rooms" className="hover:underline">Rooms</Link></li>
            <li><Link href="/bookings" className="hover:underline">Bookings</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}