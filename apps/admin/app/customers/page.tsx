'use client';

/* Callers: Next.js /customers; Sidebar Guests nav. Existing file had orphan
   ApolloClient; UI now uses PageHeader/Button/Input — add those imports.
   Schema: customers CRUD via GraphQLProvider.
   User: "review and build admin dashboard end to end in dostellers colors" */

import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

  if (loading) {
    return (
      <main className="min-h-dvh px-5 py-7">
        <div className="mx-auto max-w-6xl space-y-3" aria-busy>
          <div className="skeleton h-10 w-48" />
          <div className="skeleton h-40 w-full" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh px-5 py-7 sm:px-8 lg:px-10">
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Guests"
        description="Customer profiles, loyalty, and booking history."
        actions={
          <Link href="/dashboard">
            <Button type="button" variant="outline">Dashboard</Button>
          </Link>
        }
      />

      <div className="mb-4">
        <label htmlFor="guest-search" className="sr-only">Search guests</label>
        <Input
          id="guest-search"
          type="search"
          placeholder="Search by name, email, or phone…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-error/30 bg-coral-50 p-3 text-sm text-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg font-bold text-ink-1000">
          {editingId ? 'Edit guest' : 'Add guest'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink-700" htmlFor="guest-name">Full name</label>
            <Input
              id="guest-name"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink-700" htmlFor="guest-email">Email</label>
            <Input
              id="guest-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink-700" htmlFor="guest-phone">Phone</label>
            <Input
              id="guest-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Button type="submit" disabled={creating || updating}>
            {creating || updating ? 'Saving…' : editingId ? 'Update guest' : 'Add guest'}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                setForm({ fullName: '', email: '', phone: '' });
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200 bg-ink-50 text-[0.7rem] uppercase tracking-[0.12em] text-ink-500">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Tier</th>
              <th className="px-4 py-3 font-semibold">Points</th>
              <th className="px-4 py-3 font-semibold">Bookings</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-ink-500">
                  No guests found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer: any) => (
                <tr key={customer.id} className="border-t border-ink-100 hover:bg-ink-50/80">
                  <td className="px-4 py-3 font-medium text-ink-900">{customer.fullName}</td>
                  <td className="px-4 py-3 text-ink-600">{customer.email}</td>
                  <td className="px-4 py-3 font-data text-ink-600">{customer.phone || '—'}</td>
                  <td className="px-4 py-3"><span className="stamp text-coral-700 border-coral-300">{customer.tier || 'Explorer'}</span></td>
                  <td className="px-4 py-3 font-data text-ink-700">{customer.loyaltyPoints || 0}</td>
                  <td className="px-4 py-3 font-data text-ink-700">{customer.bookings?.length || 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleEdit(customer)}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-error"
                        onClick={() => handleDelete(customer.id)}
                        disabled={deleting}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </main>
  );
}