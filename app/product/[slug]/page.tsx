'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getProductBySlug, Product } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import PriceSummary from '@/components/PriceSummary';
import MarketTable from '@/components/MarketTable';

const toBengaliNumber = (num: number) => {
  if (num === undefined || num === null || isNaN(num)) return '০';
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bengaliDigits[parseInt(d)]);
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { data: session, isPending: sessionPending } = useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Session check — লগইন না থাকলে সাইনইনে রিডাইরেক্ট
  useEffect(() => {
    if (!sessionPending && !session) {
      toast.error('প্রোডাক্ট দেখতে লগইন করুন');
      router.push(`/signin?redirect=/product/${slug}`);
    }
  }, [session, sessionPending, router, slug]);

  // API কল
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setNotFound(false);
        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug && session) fetchData();
  }, [slug, session]);

  // লোডিং স্টেট
  if (sessionPending || loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!session) return null;

  // ৪০৪
  if (notFound || !product) {
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

  // Min, Max, Avg ক্যালকুলেট
  const allMins = product.markets.map((m) => m.min);
  const allMaxs = product.markets.map((m) => m.max);
  const minPrice = allMins.length > 0 ? Math.min(...allMins) : 0;
  const maxPrice = allMaxs.length > 0 ? Math.max(...allMaxs) : 0;
  const avgPrice =
    allMins.length + allMaxs.length > 0
      ? (allMins.reduce((a, b) => a + b, 0) + allMaxs.reduce((a, b) => a + b, 0)) /
        (allMins.length + allMaxs.length)
      : 0;

  const isUp = product.changeDir === 'up';
  const isDown = product.changeDir === 'down';

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-green-600">
          হোম
        </Link>
        <span>/</span>
        <Link href={`/category/${product.category}`} className="hover:text-green-600">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      {/* Product Summary Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <span className="text-6xl">{product.emoji}</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {product.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{product.unit}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {product.categoryIcon} {product.categoryName}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400">আজকের দাম</p>
          <p className="text-3xl font-bold text-gray-800">
            {toBengaliNumber(product.price)} টাকা
          </p>
          <span
            className={`text-sm font-semibold ${
              isUp ? 'text-red-500' : isDown ? 'text-green-500' : 'text-gray-500'
            }`}
          >
            {isUp ? '▲' : isDown ? '▼' : '—'} {toBengaliNumber(Math.abs(product.change))}%
          </span>
        </div>
      </div>

      {/* Price Summary */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-2">দামের সারসংক্ষেপ</h2>
      <PriceSummary minPrice={minPrice} maxPrice={maxPrice} avgPrice={avgPrice} />

      {/* Market Table */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        বাজারভিত্তিক আজকের দাম
      </h2>
      <MarketTable markets={product.markets} />
    </div>
  );
}