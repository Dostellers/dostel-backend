'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '@/lib/queries';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      if (data?.signup?.token) {
        localStorage.setItem('token', data.signup.token);
        router.push('/');
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup({
      variables: {
        input: {
          ...formData,
          dateOfBirth: null, // Optional field
          referralCode: null, // Optional field
        },
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-forest-900">Join Dostel</h1>
          <p className="mt-2 text-sm text-stone-600">Sign up to book hostels and access exclusive member benefits</p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-stone-700">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-sunset focus:outline-none focus:ring-sunset"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-sunset focus:outline-none focus:ring-sunset"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-stone-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-sunset focus:outline-none focus:ring-sunset"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-sunset focus:outline-none focus:ring-sunset"
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-sunset px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>

          <div className="text-center text-sm text-stone-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/login')}
              className="text-sunset hover:underline"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}