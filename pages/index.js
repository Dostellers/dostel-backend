import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Dostel Admin Panel</title>
        <meta name="description" content="Admin panel for Dostel PMS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Dostel Admin Panel
          </h1>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/hostels" className="group">
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7-4 7 4m-6 4l-7 4 7-4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Hostel Management</h2>
                </div>
                <p className="text-gray-600">Manage hostel properties, locations, and settings</p>
              </div>
            </Link>
            
            <Link href="/rooms" className="group">
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 0h18a2 2 0 012 2v2H5V5z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Room Management</h2>
                </div>
                <p className="text-gray-600">Create and manage room types and inventory</p>
              </div>
            </Link>
            
            <Link href="/bookings" className="group">
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Booking Management</h2>
                </div>
                <p className="text-gray-600">View, modify, and track guest bookings</p>
              </div>
            </Link>
            
            <Link href="/customers" className="group">
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6.026M15 3a3 3 0 11-6 0 3 3 0 016 0zM6.142 6a4 4 0 01-.879 4.076A8.001 8.001 0 0012 10c1.716 0 3.41.571 4.868 1.576A4 4 0 016.142 6z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Customer Management</h2>
                </div>
                <p className="text-gray-600">Manage guest profiles and communication history</p>
              </div>
            </Link>
            
            <Link href="/analytics" className="group">
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5h3a2 2 0 012 2v3a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2zm0 8h3a2 2 0 012 2v3a2 2 0 01-2 2H9a2 2 0 01-2-2v-3a2 2 0 012-2zm4 0h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2v-3a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Analytics & Reports</h2>
                </div>
                <p className="text-gray-600">View occupancy, revenue, and performance metrics</p>
              </div>
            </Link>
            
            <Link href="/settings" className="group">
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-1.756.426-2.924.426-3.35 0a1.724 1.724 0 00-2.573-1.066c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 00-1.065-2.572c-.426-1.756-.426-2.924 0-3.35a1.724 1.724 0 001.066-2.573zm0 10.325c.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 00-2.573-1.066c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573zm0 10.325c.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 00-2.573-1.066c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
                </div>
                <p className="text-gray-600">Configure general settings and preferences</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
