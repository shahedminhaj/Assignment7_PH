import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto py-20 px-4 text-center">
      <h1 className="text-5xl font-bold text-gray-800">৪০৪</h1>
      <p className="text-gray-600 mt-4 mb-6">এই পণ্যটি খুঁজে পাওয়া যায়নি।</p>
      <Link
        href="/"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md inline-block"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}