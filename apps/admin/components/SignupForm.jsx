'use client';

import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthResponse } from '@/lib/types';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function SignupForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(data: FieldValues) {
    setSubmitting(true);
    try {
      const result = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation Signup($input: SignupInput!) { signup(input: $input) { token user { id email name role } } }`,
          variables: { input: { email: data.email, password: data.password } },
        }),
      });

      const response: AuthResponse = await result.json();

      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      if (response.data?.signup?.token) {
        localStorage.setItem('token', response.data.signup.token);
        setError('');
        router.push('/dashboard');
        onSuccess?.();
      } else {
        throw new Error('Signup failed - please try again');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 w-full">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center px-4">
          <h1 className="text-3xl font-bold text-gray-900">Create Admin Account</h1>
          <p className="mt-2 text-sm text-gray-500">
            Complete your registration to manage Dostel hostels
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@dostel.com"
                {...register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.email?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                {...register('password')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.password?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.password?.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || isSubmitting}
            className="w-full bg-coral-600 hover:bg-coral-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {submitting || isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
