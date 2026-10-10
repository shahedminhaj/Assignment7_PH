'use client';

import { useState, useEffect } from 'react';
import { getProducts, Product } from '@/lib/api';

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    async function fetchTicker() {
      try {
        const data = await getProducts();
        setProducts(data);
        setFetchFailed(false);
      } catch (err) {
        console.error('Ticker fetch failed', err);
        setFetchFailed(true);
      }
    }
    fetchTicker();
  }, []);

  if (products.length === 0) {
    return (
      <div className="bg-gray-900 text-white py-2 overflow-hidden">
        <div className={`text-center text-sm ${fetchFailed ? '' : 'animate-pulse'}`}>
          {fetchFailed ? 'দামের তথ্য সাময়িকভাবে পাওয়া যাচ্ছে না' : 'লোড হচ্ছে...'}
        </div>
      </div>
    );
  }

  const items = [...products, ...products];

  return (
    <div className="bg-gray-900 text-white py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, idx) => {
          const isUp = item.changeDir === 'up';
          const isDown = item.changeDir === 'down';
          return (
            <span key={idx} className="mx-6 flex items-center gap-1 text-sm">
              <span>{item.emoji}</span>
              <span>{item.name}</span>
              <span className="text-gray-400">|</span>
              <span>{item.price} টাকা/{item.unit.replace('প্রতি ', '')}</span>
              <span className={isUp ? 'text-red-400' : isDown ? 'text-green-400' : 'text-gray-400'}>
                {isUp ? '▲' : isDown ? '▼' : '—'} {Math.abs(item.change)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}