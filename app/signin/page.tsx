'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });

      if (error) {
        toast.error(error.message || 'লগইন করতে সমস্যা হয়েছে');
      } else {
        toast.success('সফলভাবে লগইন হয়েছে!');
        router.push(redirect);
        router.refresh();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'লগইন করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: redirect,
      });
      if (error) {
        toast.error(error.message || `${provider} দিয়ে সাইন ইন করা যায়নি`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `${provider} দিয়ে সাইন ইন করা যায়নি`,
      );
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          সাইন ইন করুন
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          আপনার অ্যাকাউন্টে লগইন করুন
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">ইমেইল</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="আপনার পাসওয়ার্ড"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? 'অপেক্ষা করুন...' : 'লগইন করুন'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative text-center">
            <span className="bg-white px-2 text-xs text-gray-400 relative z-10">অথবা</span>
            <div className="absolute top-1/2 left-0 w-full border-t border-gray-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              onClick={() => handleSocialSignIn('google')}
              disabled={socialLoading !== null}
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50"
            >
              {socialLoading === 'google' ? 'অপেক্ষা করুন...' : 'Google'}
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignIn('github')}
              disabled={socialLoading !== null}
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50"
            >
              {socialLoading === 'github' ? 'অপেক্ষা করুন...' : 'GitHub'}
            </button>
          </div>
        </div>

        <p className="text-sm text-center text-gray-500 mt-6">
          অ্যাকাউন্ট নেই?{' '}
          <Link href="/signup" className="text-green-600 font-medium hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-12 px-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6 mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}