import { MongoClient, Db } from 'mongodb';

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not configured. Set it in .env.local for local development or in your deployment environment.',
    );
  }
  return uri;
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(getMongoUri());
  await client.connect();
  cachedClient = client;
  return client;
}

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const client = await getMongoClient();
  cachedDb = client.db('bazardor');
  return cachedDb;
}