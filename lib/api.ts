// Browser requests go through our own origin so the upstream API's CORS
// configuration cannot prevent product data from loading.
const API_BASE_URL = '/api';
const CLIENT_CACHE_TTL_MS = 30_000;

const productRequests = new Map<
  string,
  { promise: Promise<unknown>; expiresAt: number }
>();

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
  const now = Date.now();
  const cached = productRequests.get(path);
  if (cached && cached.expiresAt > now) {
    return cached.promise as Promise<T>;
  }

  const promise = (async () => {
    const res = await fetch(`${API_BASE_URL}${path}`);
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(
        body?.error ?? `Product API returned ${res.status} for ${path}`,
      );
    }
    return res.json();
  })();

  productRequests.set(path, {
    promise,
    expiresAt: now + CLIENT_CACHE_TTL_MS,
  });

  try {
    return (await promise) as T;
  } catch (error) {
    if (productRequests.get(path)?.promise === promise) {
      productRequests.delete(path);
    }
    throw error;
  }
}

export async function getProducts(category?: string): Promise<Product[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const data = await fetchApi<ApiProduct[]>(`/products${query}`);
  return data.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const products = await fetchApi<ApiProduct[]>('/products');
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    throw new Error(`Product not found: ${slug}`);
  }

  const data = await fetchApi<ApiProduct>(
    `/products/${encodeURIComponent(String(product.id))}`,
  );
  return mapProduct(data);
}
