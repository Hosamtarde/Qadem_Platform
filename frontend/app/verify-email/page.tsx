'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyEmail } from '@/lib/auth';
import { useT } from '@/lib/i18n/context';

type State = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const t = useT();
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
      setMessage(t('verify.noToken'));
      return;
    }

    verifyEmail(token)
      .then((res) => {
        setState('success');
        setMessage(res.message);
      })
      .catch((err) => {
        setState('error');
        setMessage(err.message ?? t('verify.failed'));
      });
  }, [token, t]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border p-8 text-center">
        {state === 'loading' && (
          <p className="text-muted">{t('verify.working')}</p>
        )}

        {state === 'success' && (
          <>
            <h1 className="mb-3 text-2xl font-semibold">{t('verify.successTitle')}</h1>
            <p className="mb-6 text-gray-600">{message}</p>
            <Link
              href="/login"
              className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white"
            >
              {t('verify.goToLogin')}
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <h1 className="mb-3 text-2xl font-semibold">
              {t('verify.failedTitle')}
            </h1>
            <p className="mb-6 text-gray-600">{message}</p>
            <Link href="/login" className="text-blue-600 underline">
              {t('verify.backToLogin')}
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