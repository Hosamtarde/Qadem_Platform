'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyEmail } from '@/lib/auth';

type State = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get('token');

  const [state, setState] = useState<State>('loading');
  const [message, setMessage] = useState('');
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    if (!token) {
      setState('error');
      setMessage('No verification token was provided.');
      return;
    }

    verifyEmail(token)
      .then((res) => {
        setState('success');
        setMessage(res.message);
      })
      .catch((err) => {
        setState('error');
        setMessage(err.message ?? 'Verification failed.');
      });
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border p-8 text-center">
        {state === 'loading' && (
          <p className="text-gray-600">Verifying your account…</p>
        )}

        {state === 'success' && (
          <>
            <h1 className="mb-3 text-2xl font-semibold">Account verified</h1>
            <p className="mb-6 text-gray-600">{message}</p>
            <Link
              href="/login"
              className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white"
            >
              Go to login
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <h1 className="mb-3 text-2xl font-semibold">
              Verification failed
            </h1>
            <p className="mb-6 text-gray-600">{message}</p>
            <Link href="/login" className="text-blue-600 underline">
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}