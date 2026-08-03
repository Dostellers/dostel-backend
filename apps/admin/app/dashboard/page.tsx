'use client';

import { gql, useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DASHBOARD_QUERY = gql`
  query Dashboard {
    hostels {
      id
      name
      status
    }
    bookings {
      id
      customerName
      status
      totalPrice
    }
    customers {
      id
      name
      email
    }
  }
`;

export default function DashboardPage() {
  const { data, loading, error } = useQuery(DASHBOARD_QUERY);

  if (loading) return <div className="flex items-center justify-center p-8">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 p-8">Error loading dashboard: {error.message}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Hostels</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.hostels.length}</p>
            <p className="text-sm text-gray-600">Total hostels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.bookings.length}</p>
            <p className="text-sm text-gray-600">Total bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.customers.length}</p>
            <p className="text-sm text-gray-600">Total customers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.bookings.slice(0, 5).map((booking: any) => (
                <div key={booking.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-sm text-gray-600">{booking.status}</p>
                  </div>
                  <p className="font-bold">₹{booking.totalPrice}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.customers.slice(0, 5).map((customer: any) => (
                <div key={customer.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}