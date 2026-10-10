'use client';

import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient, useSession } from '@/lib/auth-client';
import { categories } from '@/lib/data';

const dateOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
};

function subscribeToDate() {
  return () => {};
}

function getBengaliDate() {
  return new Date().toLocaleDateString('bn-BD', dateOptions);
}

function getServerDate() {
  return '';
}

export default function Navbar() {
  const bengaliDate = useSyncExternalStore(
    subscribeToDate,
    getBengaliDate,
    getServerDate,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success('সফলভাবে লগআউট হয়েছে');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'লগআউট করতে সমস্যা হয়েছে',
      );
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex flex-col">
          <span className="text-2xl font-bold text-green-600 flex items-center gap-1">
            🛒 বাজার দর
          </span>
          <span className="text-xs text-gray-500">আজকের তারিখ: {bengaliDate || '...'}</span>
        </Link>

        <div className="relative">
          {isPending ? (
            <div className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {session.user.name}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md border border-gray-100 w-56 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{session.user.name}</p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                  >
                    আমার প্রোফাইল
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    সাইন আউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto whitespace-nowrap text-sm font-medium text-gray-700">
          <Link href="/" className="text-green-600 font-bold">
            🏠 হোম
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="hover:text-green-600 transition"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}