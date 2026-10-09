'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import PriceTicker from '@/components/PriceTicker';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import { getProducts, Product } from '@/lib/api';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('ডেটা লোড করতে সমস্যা হয়েছে');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const risers = products.filter((p) => p.changeDir === 'up').slice(0, 6);
  const fallers = products.filter((p) => p.changeDir === 'down').slice(0, 6);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  return (
    <>
      <PriceTicker />
      <Hero />

      <section className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-red-500">▲</span> আজ দাম বেড়েছে
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {risers.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto py-10 px-4 bg-gray-50 rounded-lg my-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-green-500">▼</span> আজ দাম কমেছে
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {fallers.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </section>

      <section id="all-products" className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">সব পণ্য</h2>
        <p className="text-gray-500 mb-6">প্রতিদিনের বাজারের সব পণ্যের দাম এক জায়গায়</p>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}