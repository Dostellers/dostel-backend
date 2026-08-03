import '../styles/globals.css';
import Header from './components/Header';

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Dostel Admin Panel</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin dashboard cards will go here */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Hostels Management</h2>
            <p className="text-gray-600">Manage hostel properties and settings</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Rooms Management</h2>
            <p className="text-gray-600">Manage room types and availability</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Bookings Overview</h2>
            <p className="text-gray-600">View and manage all bookings</p>
          </div>
        </div>
      </main>
    </div>
  );
}