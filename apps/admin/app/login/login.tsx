'use client';

import { useForm, FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AuthResponse } from '@/lib/types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginForm() {
  const router = useRouter();
  const { addToast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: FieldValues) {
    try {
      const result = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { token user { id email name } } }`,
          variables: { email: data.email, password: data.password },
        }),
      });

      const response: AuthResponse = await result.json();

      if (response.data?.login?.token) {
        localStorage.setItem('token', response.data.login.token);
        addToast({ title: 'Login successful', description: 'You are now logged in' });
        router.replace('/dashboard');
      } else {
        addToast({ title: 'Login failed', description: response.errors?.[0]?.message || 'Invalid credentials' });
      }
    } catch (error) {
      addToast({ title: 'Error', description: 'Network error. Please try again.' });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-500">Sign in to access the Dostel admin panel</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              placeholder="admin@dostel.com"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-coral-600 hover:bg-coral-700 text-white"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}