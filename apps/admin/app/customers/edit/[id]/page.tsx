'use client';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Protected from '@/app/protected';
import Link from 'next/link';

const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      id
      fullName
      email
      phone
      accountStatus
      newsletterSubscription
    }
  }
`;

const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: ID!, $input: CustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      fullName
      email
    }
  }
`;

export default function EditCustomer() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);
  const { data, loading, error } = useQuery(GET_CUSTOMER, {
    variables: { id },
  });
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    accountStatus: '',
    newsletterSubscription: false,
  });

  useEffect(() => {
    if (data?.customer) {
      const customer = data.customer;
      setFormData({
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone || '',
        accountStatus: customer.accountStatus,
        newsletterSubscription: customer.newsletterSubscription,
      });
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No customer found</p>;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    const newValue = type === 'checkbox' && event.target instanceof HTMLInputElement
      ? event.target.checked
      : value;
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCustomer({ variables: { id, input: formData } });
      router.push('/customers');
    } catch (err) {
      console.error('Failed to update customer:', err);
      // Optionally set an error state to show in the UI
    }
  };

  return (
    <Protected>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Customer</h1>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                <select
                  name="accountStatus"
                  value={formData.accountStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <input
                    type="checkbox"
                    name="newsletterSubscription"
                    checked={formData.newsletterSubscription}
                    onChange={handleChange}
                  />
                  Subscribe to newsletter
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Update Customer
                </button>
                <Link href="/admin/customers">
                  <button
                    type="button"
                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Protected>
  );
}