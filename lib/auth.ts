import { betterAuth } from 'better-auth';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { nextCookies } from 'better-auth/next-js';
import { getDb } from './mongodb';

function createAuth(db: Awaited<ReturnType<typeof getDb>>) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

  return betterAuth({
    database: mongodbAdapter(db),
    baseURL: process.env.BETTER_AUTH_URL,
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
