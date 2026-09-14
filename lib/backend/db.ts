import type { OmniDatabase } from "./types";
import { ensureMongoIndexes, getMongoDb } from "./mongo";
import { promises as fs } from "fs";
import path from "path";

const emptyDb: OmniDatabase = {
  users: [],
  sessions: [],
  connectedAccounts: [],
  posts: [],
  brandProfiles: [],
};

const fallbackPath = path.join(process.cwd(), "data", "omnisocial-dev-db.json");
const fallbackEnabled = process.env.MONGODB_FALLBACK_TO_FILE !== "false";
const storageMode = process.env.MONGODB_STORAGE_MODE ?? (process.env.NODE_ENV === "development" ? "file" : "mongo");
let mongoUnavailableUntil = 0;
let lastMongoError = "";

function shouldSkipMongo() {
  return storageMode === "file" || (fallbackEnabled && Date.now() < mongoUnavailableUntil);
}

function markMongoUnavailable(error: unknown) {
  lastMongoError = error instanceof Error ? error.message : "MongoDB is not reachable.";
  mongoUnavailableUntil = Date.now() + 60_000;
}

async function readFallbackDb(): Promise<OmniDatabase> {
  try {
    const raw = await fs.readFile(fallbackPath, "utf8");
    return { ...emptyDb, ...JSON.parse(raw) };
  } catch {
    return structuredClone(emptyDb);
  }
}

async function writeFallbackDb(db: OmniDatabase) {
  await fs.mkdir(path.dirname(fallbackPath), { recursive: true });
  await fs.writeFile(fallbackPath, JSON.stringify(db, null, 2));
}

function normalizeMongoError(error: unknown) {
  if (!fallbackEnabled || !(error instanceof Error)) {
    throw error;
  }

  if (/querySrv|ECONNREFUSED|ENOTFOUND|ETIMEOUT|server selection/i.test(error.message)) {
    markMongoUnavailable(error);
    return;
  }

  throw error;
}

export async function readDb(): Promise<OmniDatabase> {
  if (shouldSkipMongo()) {
    return readFallbackDb();
  }

  try {
    await ensureMongoIndexes();
    const db = await getMongoDb();
    const [users, sessions, connectedAccounts, posts, brandProfiles] = await Promise.all([
      db.collection<OmniDatabase["users"][number]>("users").find({}, { projection: { _id: 0 } }).toArray(),
      db.collection<OmniDatabase["sessions"][number]>("sessions").find({}, { projection: { _id: 0 } }).toArray(),
      db.collection<OmniDatabase["connectedAccounts"][number]>("connectedAccounts").find({}, { projection: { _id: 0 } }).toArray(),
      db.collection<OmniDatabase["posts"][number]>("posts").find({}, { projection: { _id: 0 } }).toArray(),
      db.collection<OmniDatabase["brandProfiles"][number]>("brandProfiles").find({}, { projection: { _id: 0 } }).toArray(),
    ]);

    return { ...emptyDb, users, sessions, connectedAccounts, posts, brandProfiles } as unknown as OmniDatabase;
  } catch (error) {
    normalizeMongoError(error);
    return readFallbackDb();
  }
}

export async function writeDb(db: OmniDatabase) {
  if (shouldSkipMongo()) {
    await writeFallbackDb(db);
    return;
  }

  try {
    await ensureMongoIndexes();
    const mongo = await getMongoDb();

    await Promise.all([
      mongo.collection("users").deleteMany({}),
      mongo.collection("sessions").deleteMany({}),
      mongo.collection("connectedAccounts").deleteMany({}),
      mongo.collection("posts").deleteMany({}),
      mongo.collection("brandProfiles").deleteMany({}),
    ]);

    await Promise.all([
      db.users.length ? mongo.collection("users").insertMany(db.users) : Promise.resolve(),
      db.sessions.length ? mongo.collection("sessions").insertMany(db.sessions) : Promise.resolve(),
      db.connectedAccounts.length ? mongo.collection("connectedAccounts").insertMany(db.connectedAccounts) : Promise.resolve(),
      db.posts.length ? mongo.collection("posts").insertMany(db.posts) : Promise.resolve(),
      db.brandProfiles.length ? mongo.collection("brandProfiles").insertMany(db.brandProfiles) : Promise.resolve(),
    ]);
  } catch (error) {
    normalizeMongoError(error);
    await writeFallbackDb(db);
  }
}

export async function updateDb<T>(updater: (db: OmniDatabase) => T | Promise<T>) {
  const db = await readDb();
  const result = await updater(db);
  await writeDb(db);
  return result;
}

export function getDatabaseRuntimeInfo() {
  return {
    storageMode,
    fallbackEnabled,
    usingFallback: shouldSkipMongo(),
    lastMongoError,
    fallbackPath,
  };
}
