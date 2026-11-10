'use client';

import { useForm, FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';


import { useToast } from '@/components/ui/use-toast';
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
  const { addToast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: FieldValues) {
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

      if (response.errors?.length) {
        throw new Error(response.errors[0].message);
      }

      if (response.data?.signup?.token) {
        localStorage.setItem('token', response.data.signup.token);
        addToast({ title: 'Signup successful', description: 'You are now registered' });
        router.push('/dashboard');
        //onSuccess?.();
      } else {
        throw new Error('Signup failed - please try again');
      }
    } catch (error) {
      addToast({ title: 'Error', description: error instanceof Error ? error.message : 'Signup failed' });
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                id="email"
                placeholder="admin@dostel.com"
                {...register('email')}
                error={errors.email?.message?.split(':')[0] ?? ''}
              />
              {errors.email?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="•• • • • • • • • • • • • • • • • • • • • • • • • • • •"
                {...register('password')}
                error={errors.password?.message?.split(':')[0] ? errors.password?.message.split(':')[0] : ''}
              />
              {errors.password?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.password?.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            leftIcon={<Spinner className="animate-spin ml-2" />}
            color="primary"
            className="w-full bg-coral-600 hover:bg-coral-700 text-white transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
}

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={className ?? 'animate-spin h-5 w-5 text-coral-600'}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8z"
    />
  </svg>
);
