'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/signin');
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedName = (name ?? session?.user?.name ?? '').trim();
    if (!updatedName) {
      toast.error('নাম খালি রাখা যাবে না');
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.updateUser({
        name: updatedName,
      });

      if (error) {
        toast.error(error.message || 'আপডেট করতে সমস্যা হয়েছে');
      } else {
        toast.success('সফলভাবে আপডেট হয়েছে!');
        router.push('/profile');
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'আপডেট করতে সমস্যা হয়েছে',
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">তথ্য আপডেট করুন</h1>
        <p className="text-sm text-gray-500 mb-6">আপনার নাম পরিবর্তন করুন</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">নাম</label>
            <input
              type="text"
              required
              value={name ?? session.user.name ?? ''}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="আপনার নাম"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? 'অপেক্ষা করুন...' : 'আপডেট করুন'}
            </button>
            <Link
              href="/profile"
              className="flex-1 text-center border border-gray-300 text-gray-700 font-medium py-2 rounded-md hover:bg-gray-50 transition"
            >
              বাতিল
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}