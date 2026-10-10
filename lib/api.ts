const API_BASE_URLS = [
  'https://api.api-store.workers.dev/api/bazardor',
  'https://api.abcz.workers.dev/api/bazardor',
];

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

async function fetchApi<T>(path: string): Promise<T> {
  let lastError: Error | undefined;

  for (const baseUrl of API_BASE_URLS) {
    try {
      const res = await fetch(`${baseUrl}${path}`, { cache: 'no-store' });
      if (!res.ok) {
        lastError = new Error(`Product API returned ${res.status} for ${path}`);
        continue;
      }
      return (await res.json()) as T;
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error('Unknown product API error');
    }
  }

  throw new Error(
    `All product API endpoints failed for ${path}: ${lastError?.message ?? 'unknown error'}`,
  );
}

export async function getProducts(category?: string): Promise<Product[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const data = await fetchApi<ApiProduct[]>(`/products${query}`);
  return data.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const data = await fetchApi<ApiProduct>(`/products/${encodeURIComponent(slug)}`);
  return mapProduct(data);
}