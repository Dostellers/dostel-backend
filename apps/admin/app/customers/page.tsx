'use client';

import { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://65.109.113.80:4000/graphql',
  cache: new InMemoryCache(),
});

const GET_CUSTOMERS = gql`
  query GetCustomers {
    customers {
      id
      fullName
      email
      phone
      tier
      loyaltyPoints
      bookings {
        id
      }
    }
  }
`;

const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      id
      fullName
      email
    }
  }
`;

const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: ID!, $input: CustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      fullName
      email
      phone
      tier
      loyaltyPoints
    }
  }
`;

const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id)
  }
`;

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: queryData, refetch } = useQuery(GET_CUSTOMERS);
  const [createCustomer, { loading: creating }] = useMutation(CREATE_CUSTOMER);
  const [updateCustomer, { loading: updating }] = useMutation(UPDATE_CUSTOMER);
  const [deleteCustomer, { loading: deleting }] = useMutation(DELETE_CUSTOMER);

  useEffect(() => {
    if (queryData?.customers) {
      setCustomers(queryData.customers);
      setLoading(false);
    }
  }, [queryData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email) {
      setError('Name and email are required');
      return;
    }
    try {
      if (editingId) {
        await updateCustomer({
          variables: { id: editingId, input: form },
        });
        setEditingId(null);
      } else {
        const { data } = await createCustomer({
          variables: { input: form },
        });
        if (data) {
          setCustomers([data.createCustomer, ...customers]);
        }
      }
      setForm({ fullName: '', email: '', phone: '' });
      setError(null);
      refetch();
    } catch (err: any) {
      setError(err.message || 'Failed to save customer');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer({ variables: { id } });
        refetch();
      } catch (err: any) {
        setError(err.message || 'Failed to delete customer');
      }
    }
  };

  const handleEdit = (customer: any) => {
    setForm({
      fullName: customer.fullName || '',
      email: customer.email || '',
      phone: customer.phone || '',
    });
    setEditingId(customer.id);
  };

  const filteredCustomers = customers.filter((c: any) =>
    (c.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (c.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6 text-gray-600">Loading customers...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-stone-900">Customers</h1>
        <Link href="/admin" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded px-4 py-2 text-sm"
        />
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-800 rounded">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Customer' : 'Add New Customer'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={creating || updating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {creating || updating ? 'Saving...' : editingId ? 'Update Customer' : 'Add Customer'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ fullName: '', email: '', phone: '' });
              }}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Customers Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loyalty Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer: any) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.tier || 'Explorer'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.loyaltyPoints || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.bookings?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        disabled={deleting}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}