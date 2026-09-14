import { createId, createSecret, encryptSecret, hashSecret } from "./crypto";
import { readDb, updateDb } from "./db";
import { cacheKeysForUser, deleteCache, getCache, invalidateUserCache, setCache } from "./redis";
import type { BrandProfile, ConnectedAccount, Platform, PostStatus, SocialPost } from "./types";

const platformLabels: Record<Platform, string> = {
  x: "X",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
};

function assertPlatform(platform: string): asserts platform is Platform {
  if (!["x", "linkedin", "instagram", "facebook"].includes(platform)) {
    throw new Error("Unsupported platform.");
  }
}

export async function listDashboardData(userId: string) {
  const cacheKey = cacheKeysForUser(userId).dashboard;
  const cached = await getCache<{
    accounts: ConnectedAccount[];
    posts: SocialPost[];
    brand: BrandProfile | undefined;
    stats: {
      connectedAccounts: number;
      pendingApprovals: number;
      scheduledPosts: number;
      publishedPosts: number;
    };
  }>(cacheKey);

  if (cached) {
    return cached;
  }

  const db = await readDb();
  const posts = db.posts.filter((post) => post.userId === userId);
  const accounts = db.connectedAccounts.filter((account) => account.userId === userId);
  const brand = db.brandProfiles.find((profile) => profile.userId === userId);

  const dashboard = {
    accounts,
    posts,
    brand,
    stats: {
      connectedAccounts: accounts.length,
      pendingApprovals: posts.filter((post) => post.status === "pending_approval").length,
      scheduledPosts: posts.filter((post) => post.status === "scheduled").length,
      publishedPosts: posts.filter((post) => post.status === "published").length,
    },
  };

  await setCache(cacheKey, dashboard, 30);
  return dashboard;
}

export async function connectMockAccount(userId: string, platformRaw: string) {
  assertPlatform(platformRaw);
  const platform = platformRaw;

  const account = await updateDb((db) => {
    const existing = db.connectedAccounts.find((account) => account.userId === userId && account.platform === platform);

    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const account: ConnectedAccount = {
      id: createId("acct"),
      userId,
      platform,
      platformAccountId: `${platform}_${userId.slice(-6)}`,
      displayName: `${platformLabels[platform]} Demo Account`,
      accessToken: `encrypted_demo_access_${platform}`,
      refreshToken: `encrypted_demo_refresh_${platform}`,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      createdAt: now,
      connectionType: "demo",
      scopes: [],
      tokenType: "Bearer",
    };

    db.connectedAccounts.push(account);
    return account;
  });

  await invalidateUserCache(userId);
  return account;
}

export async function upsertOAuthAccount(
  userId: string,
  input: {
    platform: Platform;
    platformAccountId: string;
    displayName: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt: string;
    scopes?: string[];
    tokenType?: string;
  },
) {
  const account = await updateDb((db) => {
    const now = new Date().toISOString();
    const existing = db.connectedAccounts.find(
      (candidate) => candidate.userId === userId && candidate.platform === input.platform,
    );

    if (existing) {
      existing.platformAccountId = input.platformAccountId;
      existing.displayName = input.displayName;
      existing.accessToken = encryptSecret(input.accessToken);
      existing.refreshToken = encryptSecret(input.refreshToken ?? "");
      existing.expiresAt = input.expiresAt;
      existing.connectionType = "oauth";
      existing.scopes = input.scopes ?? [];
      existing.tokenType = input.tokenType ?? "Bearer";
      return existing;
    }

    const created: ConnectedAccount = {
      id: createId("acct"),
      userId,
      platform: input.platform,
      platformAccountId: input.platformAccountId,
      displayName: input.displayName,
      accessToken: encryptSecret(input.accessToken),
      refreshToken: encryptSecret(input.refreshToken ?? ""),
      expiresAt: input.expiresAt,
      createdAt: now,
      connectionType: "oauth",
      scopes: input.scopes ?? [],
      tokenType: input.tokenType ?? "Bearer",
    };

    db.connectedAccounts.push(created);
    return created;
  });

  await invalidateUserCache(userId);
  return account;
}

export async function disconnectAccount(userId: string, accountId: string) {
  await updateDb((db) => {
    db.connectedAccounts = db.connectedAccounts.filter((account) => !(account.id === accountId && account.userId === userId));
  });
  await invalidateUserCache(userId);
}

export async function listPosts(userId: string, status?: PostStatus) {
  const cacheKey = status ? `cache:posts:${userId}:${status}` : cacheKeysForUser(userId).posts;
  const cached = await getCache<SocialPost[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const db = await readDb();
  const posts = db.posts
    .filter((post) => post.userId === userId && (!status || post.status === status))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  await setCache(cacheKey, posts, 30);
  return posts;
}

export async function createPost(
  userId: string,
  input: {
    content: string;
    targetPlatforms: Platform[];
    status?: PostStatus;
    scheduledFor?: string | null;
    timezone?: string;
    mediaUrls?: string[];
  },
) {
  if (!input.content.trim()) {
    throw new Error("Post content is required.");
  }

  if (!input.targetPlatforms.length) {
    throw new Error("Choose at least one platform.");
  }

  input.targetPlatforms.forEach(assertPlatform);

  const now = new Date().toISOString();
  const post: SocialPost = {
    id: createId("post"),
    userId,
    content: input.content.trim(),
    mediaUrls: input.mediaUrls ?? [],
    targetPlatforms: input.targetPlatforms,
    status: input.status ?? "pending_approval",
    scheduledFor: input.scheduledFor ?? null,
    timezone: input.timezone || "Asia/Karachi",
    socialPostIds: {},
    createdAt: now,
    updatedAt: now,
  };

  await updateDb((db) => {
    db.posts.push(post);
  });

  await invalidateUserCache(userId);
  return post;
}

export async function approvePost(userId: string, postId: string) {
  const post = await updateDb((db) => {
    const post = db.posts.find((candidate) => candidate.id === postId && candidate.userId === userId);

    if (!post) {
      throw new Error("Post not found.");
    }

    post.status = post.scheduledFor ? "scheduled" : "draft";
    post.updatedAt = new Date().toISOString();
    return post;
  });

  await invalidateUserCache(userId);
  return post;
}

export async function updatePostStatus(userId: string, postId: string, status: PostStatus) {
  const post = await updateDb((db) => {
    const post = db.posts.find((candidate) => candidate.id === postId && candidate.userId === userId);

    if (!post) {
      throw new Error("Post not found.");
    }

    post.status = status;
    post.updatedAt = new Date().toISOString();
    return post;
  });

  await invalidateUserCache(userId);
  return post;
}

export async function getBrandProfile(userId: string) {
  const cacheKey = cacheKeysForUser(userId).brand;
  const cached = await getCache<BrandProfile>(cacheKey);

  if (cached) {
    return cached;
  }

  const db = await readDb();
  const brand = (
    db.brandProfiles.find((profile) => profile.userId === userId) ?? {
      userId,
      voice: "",
      bannedWords: [],
      approvalMode: "draft_only",
      updatedAt: new Date().toISOString(),
    }
  );

  await setCache(cacheKey, brand, 60);
  return brand;
}

export async function updateBrandProfile(userId: string, input: Partial<BrandProfile>) {
  const profile = await updateDb((db) => {
    const now = new Date().toISOString();
    let profile = db.brandProfiles.find((candidate) => candidate.userId === userId);

    if (!profile) {
      profile = {
        userId,
        voice: "",
        bannedWords: [],
        approvalMode: "draft_only",
        updatedAt: now,
      };
      db.brandProfiles.push(profile);
    }

    profile.voice = input.voice ?? profile.voice;
    profile.bannedWords = input.bannedWords ?? profile.bannedWords;
    profile.approvalMode = input.approvalMode ?? profile.approvalMode;
    profile.updatedAt = now;
    return profile;
  });

  await invalidateUserCache(userId);
  return profile;
}

export async function createMcpToken(userId: string, name: string) {
  const rawToken = createSecret("omni");
  const tokenHash = hashSecret(rawToken);
  const now = new Date().toISOString();

  const token = await updateDb((db) => {
    const user = db.users.find((candidate) => candidate.id === userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const item = {
      id: createId("token"),
      name: name.trim() || "Claude Desktop token",
      tokenHash,
      createdAt: now,
    };
    user.mcpApiTokens.push(item);
    return item;
  });

  await deleteCache(cacheKeysForUser(userId).dashboard);
  return { ...token, token: rawToken };
}

export async function validateMcpToken(rawToken: string) {
  const tokenHash = hashSecret(rawToken);
  const db = await readDb();

  for (const user of db.users) {
    const token = user.mcpApiTokens.find((candidate) => candidate.tokenHash === tokenHash);

    if (token) {
      token.lastUsedAt = new Date().toISOString();
      await updateDb((nextDb) => {
        const nextUser = nextDb.users.find((candidate) => candidate.id === user.id);
        const nextToken = nextUser?.mcpApiTokens.find((candidate) => candidate.id === token.id);
        if (nextToken) {
          nextToken.lastUsedAt = token.lastUsedAt;
        }
      });

      return { userId: user.id, tokenId: token.id };
    }
  }

  return null;
}

export async function generateDraftFromPrompt(userId: string, prompt: string) {
  const brand = await getBrandProfile(userId);
  const content = `🚀 ${prompt.trim() || "New launch update"}\n\nBuilt with OmniSocial OS: clear message, platform-aware copy, and human approval before publishing.`;

  return createPost(userId, {
    content: `${content}\n\nVoice: ${brand.voice.slice(0, 120)}`,
    targetPlatforms: ["x", "linkedin"],
    status: brand.approvalMode === "draft_only" ? "pending_approval" : "scheduled",
    scheduledFor: brand.approvalMode === "draft_only" ? null : new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    timezone: "Asia/Karachi",
  });
}
