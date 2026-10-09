const BASE_URL = 'https://api.api-store.workers.dev/api/bazardor';

export interface ApiProduct {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  change: { dir: 'up' | 'down' | 'flat'; pct: number };
  markets: { market: string; division: string; min: number; max: number }[];
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  emoji: string;
  unit: string;
  price: number;
  change: number;
  changeDir: 'up' | 'down' | 'flat';
  category: string;
  categoryName: string;
  categoryIcon: string;
  markets: ApiProduct['markets'];
}

function mapProduct(item: ApiProduct): Product {
  const unitMap: Record<string, string> = {
    kg: 'প্রতি কেজি',
    litre: 'প্রতি লিটার',
    dozen: 'প্রতি ডজন',
    piece: 'প্রতি পিস',
  };
  return {
    id: item.id,
    slug: item.slug,
    name: item.nameBn,
    emoji: item.image || item.categoryIcon || '📦',
    unit: unitMap[item.unit] || `প্রতি ${item.unit}`,
    price: item.today,
    change: item.change.pct,
    changeDir: item.change.dir,
    category: item.category,
    categoryName: item.categoryNameBn,
    categoryIcon: item.categoryIcon,
    markets: item.markets,
  };
}

export async function getProducts(category?: string): Promise<Product[]> {
  const url = category ? `${BASE_URL}/products?category=${category}` : `${BASE_URL}/products`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  const data: ApiProduct[] = await res.json();
  return data.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${slug}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch product');
  const data: ApiProduct = await res.json();
  return mapProduct(data);
}