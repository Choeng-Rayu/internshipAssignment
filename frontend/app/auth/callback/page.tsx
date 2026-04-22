'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiClient from '@/src/lib/api-client';
import { useAuth } from '@/src/context/AuthContext';

function OAuthCallbackContent() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      // For simplicity, let's assume Google callback if code is present.
      // You might pass a provider query parameter or use different routes.
      
      if (!code) {
        setError('No authorization code provided');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      try {
        const response = await apiClient.get(`/api/v1/auth/google/callback?code=${code}&state=${state}`);
        login(response.data.access_token, response.data.user);
        router.push('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Authentication failed');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, login]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h2>
        <p>{error}</p>
        <p className="mt-4 text-sm text-slate-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <h2 className="text-xl font-bold">Completing authentication...</h2>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <OAuthCallbackContent />
    </Suspense>
  );
}