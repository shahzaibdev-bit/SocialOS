import { MongoClient, type Db } from "mongodb";

const dbName = process.env.MONGODB_DB_NAME || "omnisocial_os";

declare global {
  var omniMongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoClientPromise() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!globalThis.omniMongoClientPromise) {
    globalThis.omniMongoClientPromise = new MongoClient(mongoUri, {
      appName: "OmniSocial OS",
      serverSelectionTimeoutMS: 10000,
    })
      .connect()
      .catch((error) => {
        globalThis.omniMongoClientPromise = undefined;
        throw error;
      });
  }

  return globalThis.omniMongoClientPromise;
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClientPromise();
  return client.db(dbName);
}

export async function ensureMongoIndexes() {
  const db = await getMongoDb();

  await Promise.all([
      db.collection("users").createIndex({ email: 1 }, { unique: true }),
      db.collection("users").createIndex({ id: 1 }, { unique: true }),
    db.collection("sessions").createIndex({ tokenHash: 1 }, { unique: true }),
    db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("connectedAccounts").createIndex({ userId: 1, platform: 1 }, { unique: true }),
    db.collection("posts").createIndex({ userId: 1, status: 1, createdAt: -1 }),
    db.collection("brandProfiles").createIndex({ userId: 1 }, { unique: true }),
  ]);
}
