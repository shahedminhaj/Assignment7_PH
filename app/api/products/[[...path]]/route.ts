const API_PATH = '/api/bazardor';
const FALLBACK_API_BASE_URLS = [
  'https://openapi.programming-hero.com/api/bazardor',
  'https://api.api-store.workers.dev/api/bazardor',
  'https://api.abcz.workers.dev/api/bazardor',
];

const CACHE_TTL_MS = 60_000;
const STALE_CACHE_TTL_MS = 15 * 60_000;
const productCache = new Map<string, CachedProductResponse>();
const pendingRequests = new Map<string, Promise<CachedProductResponse>>();

type CachedProductResponse = {
  body: string;
  contentType: string;
  cachedAt: number;
};

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

function getApiBaseUrls(): string[] {
  const configuredBaseUrl = process.env.PRODUCT_API_BASE_URL?.trim().replace(/\/+$/, '');
  const configuredApiUrl = configuredBaseUrl
    ? configuredBaseUrl.endsWith(API_PATH)
      ? configuredBaseUrl
      : `${configuredBaseUrl}${API_PATH}`
    : null;

  return [
    ...(configuredApiUrl ? [configuredApiUrl] : []),
    ...FALLBACK_API_BASE_URLS.filter((url) => url !== configuredApiUrl),
  ];
}

async function fetchProducts(upstreamPath: string): Promise<CachedProductResponse> {
  let lastError = 'No product API endpoint responded';

  for (const baseUrl of getApiBaseUrls()) {
    try {
      const upstream = await fetch(`${baseUrl}${upstreamPath}`, {
        cache: 'force-cache',
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(8000),
      });

      if (!upstream.ok) {
        lastError = `Product API returned ${upstream.status}`;
        continue;
      }

      return {
        body: await upstream.text(),
        contentType: upstream.headers.get('Content-Type') ?? 'application/json',
        cachedAt: Date.now(),
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown upstream error';
    }
  }

  throw new Error(lastError);
}

function createProductResponse(
  cached: CachedProductResponse,
  isStale = false,
): Response {
  return new Response(cached.body, {
    headers: {
      'Content-Type': cached.contentType,
      'Cache-Control':
        'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
      ...(isStale ? { 'X-Product-Data-Stale': 'true' } : {}),
    },
  });
}

export async function GET(request: Request, { params }: RouteContext) {
  const { path = [] } = await params;

  // This proxy only exposes product collection and product detail reads.
  if (path.length > 1 || path.some((part) => !/^[\w-]+$/.test(part))) {
    return Response.json({ error: 'Invalid product API path' }, { status: 400 });
  }

  const suffix = path.length ? `/${encodeURIComponent(path[0])}` : '';
  const incomingUrl = new URL(request.url);
  const query = new URLSearchParams();
  const category = incomingUrl.searchParams.get('category');
  if (category) query.set('category', category);
  const queryString = query.size ? `?${query.toString()}` : '';
  const upstreamPath = `/products${suffix}${queryString}`;
  const cacheKey = upstreamPath;
  const now = Date.now();
  const cached = productCache.get(cacheKey);

  if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
    return createProductResponse(cached);
  }

  let pending = pendingRequests.get(cacheKey);
  if (!pending) {
    pending = fetchProducts(upstreamPath)
      .then((response) => {
        productCache.set(cacheKey, response);
        return response;
      })
      .finally(() => pendingRequests.delete(cacheKey));
    pendingRequests.set(cacheKey, pending);
  }

  try {
    return createProductResponse(await pending);
  } catch (error) {
    if (cached && now - cached.cachedAt < STALE_CACHE_TTL_MS) {
      console.warn(
        'Product API unavailable; serving cached product data:',
        error instanceof Error ? error.message : 'Unknown upstream error',
      );
      return createProductResponse(cached, true);
    }

    const message =
      error instanceof Error ? error.message : 'Unknown upstream error';
    console.warn('Product API upstreams unavailable:', message);
    return Response.json(
      { error: `Product data is temporarily unavailable (${message})` },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
