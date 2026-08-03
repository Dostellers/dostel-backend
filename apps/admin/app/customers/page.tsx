import { useEffect, useState } from 'react';
import Link from 'next/link';
import client from '@/lib/graphqlClient';

const GET_CUSTOMERS = `
  query GetCustomers {
    customers {
      id
      fullName
      email
      phone
      address {
        city
        country
      }
      accountStatus
      tier
      contributions
      reputation
      tokenBalance
      loyaltyPoints
      referralCode
      referredBy {
        id
        fullName
      }
      referrals {
        id
        fullName
        email
      }
    }
  }
`;

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await client.request(GET_CUSTOMERS);
        setCustomers(data.customers);
        setError(null);
      } catch (err) {
        setError('Failed to load customers');
        console.error('GraphQL error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customers List</h1>
      {customers.length === 0 ? (
        <p className="text-center py-8">No customers found</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer: any) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{customer.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.address?.city}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.address?.country}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    customer.tier === 'Elder' ? 'bg-purple-100 text-purple-800'
                    : customer.tier === 'Dosteller' ? 'bg-blue-100 text-blue-800'
                    : customer.tier === 'Contributor' ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.tier}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{customer.referrals?.length || 0}</span>
                    {customer.referredBy && (
                      <span className="text-xs text-gray-500">← {customer.referredBy.fullName}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {customer.tokenBalance} tokens
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    customer.accountStatus === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : customer.accountStatus === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.accountStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => {
                      // TODO: Implement edit functionality
                      alert('Edit not implemented yet');
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Delete ${customer.fullName}?`)) {
                        // TODO: Implement delete functionality
                        alert('Delete not implemented yet');
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}