import type { OmniDatabase } from "./types";
import { ensureMongoIndexes, getMongoDb } from "./mongo";

const emptyDb: OmniDatabase = {
  users: [],
  sessions: [],
  connectedAccounts: [],
  posts: [],
  brandProfiles: [],
};

export async function readDb(): Promise<OmniDatabase> {
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
}

export async function writeDb(db: OmniDatabase) {
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
}

export async function updateDb<T>(updater: (db: OmniDatabase) => T | Promise<T>) {
  const db = await readDb();
  const result = await updater(db);
  await writeDb(db);
  return result;
}

export function getDatabaseRuntimeInfo() {
  return {
    storageMode: "mongo",
    fallbackEnabled: false,
    usingFallback: false,
  };
}
