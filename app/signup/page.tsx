'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email: form.email,
        password: form.password,
        name: form.name,
      });

      if (error) {
        toast.error(error.message || 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে');
      } else {
        toast.success('সফলভাবে রেজিস্ট্রেশন হয়েছে! এখন লগইন করুন।');
        router.push('/signin');
      }
    } catch (err) {
      toast.error('কিছু সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await authClient.signIn.social({ provider: 'google', callbackURL: '/' });
    } catch (err) {
      toast.error('Google সাইনআপে সমস্যা হয়েছে');
    }
  };

  const handleGithubSignUp = async () => {
    try {
      await authClient.signIn.social({ provider: 'github', callbackURL: '/' });
    } catch (err) {
      toast.error('GitHub সাইনআপে সমস্যা হয়েছে');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          বিনামূল্যে সাইন আপ করুন এবং সব সুবিধা পান
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">নাম</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="আপনার নাম"
            />
          </div>
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
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="কমপক্ষে ৬ অক্ষর"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? 'অপেক্ষা করুন...' : 'রেজিস্টার করুন'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative text-center">
            <span className="bg-white px-2 text-xs text-gray-400 relative z-10">অথবা</span>
            <div className="absolute top-1/2 left-0 w-full border-t border-gray-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={handleGoogleSignUp}
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50"
            >
              Google
            </button>
            <button
              onClick={handleGithubSignUp}
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50"
            >
              GitHub
            </button>
          </div>
        </div>

        <p className="text-sm text-center text-gray-500 mt-6">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
          <Link href="/signin" className="text-green-600 font-medium hover:underline">
            সাইন ইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}