'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import SortDropdown from '@/components/SortDropdown';
import { getProducts, Product } from '@/lib/api';
import { categories } from '@/lib/data';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [error, setError] = useState(false);

  const categoryInfo = categories.find((c) => c.slug === slug);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(false);
        const data = await getProducts(slug);
        setProducts(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchData();
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'low-to-high') return a.price - b.price;
    if (sortBy === 'high-to-low') return b.price - a.price;
    return 0;
  });

  // ভুল ক্যাটাগরি স্লাগ হলে ৪০৪
  if (!categoryInfo) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-800">৪০৪</h1>
        <p className="text-gray-600 mt-4 mb-6">
          এই ক্যাটাগরিটি খুঁজে পাওয়া যায়নি।
        </p>
        <Link
          href="/"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md inline-block"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Category Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex items-center gap-4">
        <span className="text-5xl">{categoryInfo.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{categoryInfo.name}</h1>
          <p className="text-sm text-gray-500">এই ক্যাটাগরির সব পণ্যের দাম</p>
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="flex justify-end mb-6">
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error || sortedProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">
            এই ক্যাটাগরিতে কোনো পণ্য নেই।
          </p>
          <Link
            href="/"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md inline-block"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProducts.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </div>
  );
}