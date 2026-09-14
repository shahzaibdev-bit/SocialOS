import { cookies } from "next/headers";
import { createId, createSecret, hashPassword, hashSecret, verifyPassword } from "./crypto";
import { readDb, updateDb } from "./db";
import type { SafeUser, User } from "./types";

export const SESSION_COOKIE = "omnisocial_session";

const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    tokenCount: user.mcpApiTokens.length,
  };
}

export async function signUpUser(input: { name: string; email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim() || email.split("@")[0] || "Operator";

  if (!email.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }

  if (input.password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  return updateDb(async (db) => {
    if (db.users.some((user) => user.email === email)) {
      throw new Error("An account with this email already exists.");
    }

    const now = new Date().toISOString();
    const user: User = {
      id: createId("user"),
      email,
      name,
      passwordHash: hashPassword(input.password),
      aiApiKeys: [],
      mcpApiTokens: [],
      createdAt: now,
    };

    db.users.push(user);
    db.brandProfiles.push({
      userId: user.id,
      voice: "Confident, concise, useful, and slightly futuristic. Keep posts clear, human, and platform-aware.",
      bannedWords: ["guaranteed", "free money", "miracle"],
      approvalMode: "draft_only",
      updatedAt: now,
    });

    return toSafeUser(user);
  });
}

export async function logInUser(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const db = await readDb();
  const user = db.users.find((candidate) => candidate.email === email);

  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new Error("Email or password is incorrect.");
  }

  return toSafeUser(user);
}

export async function createSession(userId: string) {
  const token = createSecret("sess");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + sessionMaxAgeSeconds * 1000).toISOString();

  await updateDb((db) => {
    db.sessions.push({
      id: createId("session"),
      userId,
      tokenHash: hashSecret(token),
      expiresAt,
      createdAt: now.toISOString(),
    });
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionMaxAgeSeconds,
    path: "/",
  });

  return token;
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const tokenHash = hashSecret(token);
    try {
      await updateDb((db) => {
        db.sessions = db.sessions.filter((session) => session.tokenHash !== tokenHash);
      });
    } catch {
      // If the database is temporarily unavailable, still clear the browser cookie locally.
    }
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashSecret(token);
  let db;

  try {
    db = await readDb();
  } catch {
    return null;
  }

  const session = db.sessions.find((candidate) => candidate.tokenHash === tokenHash);

  if (!session || new Date(session.expiresAt).getTime() < Date.now()) {
    return null;
  }

  const user = db.users.find((candidate) => candidate.id === session.userId);
  return user ? toSafeUser(user) : null;
}
