import { betterAuth } from 'better-auth';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { nextCookies } from 'better-auth/next-js';
import { getDb } from './mongodb';

function getDeploymentOrigin(host?: string): string | undefined {
  if (!host) return undefined;
  return new URL(`https://${host}`).origin;
}

function getAuthBaseURL(): string | undefined {
  const configuredURL = process.env.BETTER_AUTH_URL?.trim();
  const productionOrigin = getDeploymentOrigin(
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  );
  const deploymentOrigin = getDeploymentOrigin(process.env.VERCEL_URL);
  const isLocalURL = configuredURL
    ? /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i.test(configuredURL)
    : false;

  if (process.env.NODE_ENV === 'production' && isLocalURL) {
    return productionOrigin ?? deploymentOrigin;
  }

  return configuredURL || productionOrigin || deploymentOrigin;
}

function createAuth(db: Awaited<ReturnType<typeof getDb>>) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
  const baseURL = getAuthBaseURL();
  const trustedOrigins = [
    baseURL,
    getDeploymentOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
    getDeploymentOrigin(process.env.VERCEL_URL),
  ].filter((origin): origin is string => Boolean(origin));

  return betterAuth({
    database: mongodbAdapter(db),
    baseURL,
    trustedOrigins: [...new Set(trustedOrigins)],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      ...(googleClientId && googleClientSecret
        ? {
            google: {
              clientId: googleClientId,
              clientSecret: googleClientSecret,
            },
          }
        : {}),
      ...(githubClientId && githubClientSecret
        ? {
            github: {
              clientId: githubClientId,
              clientSecret: githubClientSecret,
            },
          }
        : {}),
    },
    plugins: [nextCookies()],
  });
}

let authInstance: ReturnType<typeof createAuth> | null = null;

export async function getAuth() {
  if (authInstance) return authInstance;

  const db = await getDb();
  authInstance = createAuth(db);
  return authInstance;
}
