'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      toast.error('প্রোফাইল দেখতে লগইন করুন');
      router.push('/signin');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="h-20 w-20 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">আমার প্রোফাইল</h1>
      <p className="text-sm text-gray-500 mb-6">আপনার অ্যাকাউন্টের তথ্য দেখুন</p>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {session.user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">{session.user.name}</p>
            <p className="text-sm text-gray-500">{session.user.email}</p>
          </div>
        </div>

        <Link
          href="/profile/update"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition whitespace-nowrap"
        >
          ✏️ তথ্য আপডেট
        </Link>
      </div>
    </div>
  );
}