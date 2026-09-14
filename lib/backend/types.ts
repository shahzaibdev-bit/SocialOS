export type Platform = "x" | "linkedin" | "instagram" | "facebook";

export type PostStatus = "draft" | "pending_approval" | "scheduled" | "published" | "failed";

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  mcpApiTokens: Array<{
    id: string;
    name: string;
    tokenHash: string;
    createdAt: string;
    lastUsedAt?: string;
  }>;
  createdAt: string;
};

export type Session = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
};

export type ConnectedAccount = {
  id: string;
  userId: string;
  platform: Platform;
  platformAccountId: string;
  displayName: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
};

export type SocialPost = {
  id: string;
  userId: string;
  content: string;
  mediaUrls: string[];
  targetPlatforms: Platform[];
  status: PostStatus;
  scheduledFor: string | null;
  timezone: string;
  socialPostIds: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};

export type BrandProfile = {
  userId: string;
  voice: string;
  bannedWords: string[];
  approvalMode: "draft_only" | "auto_schedule";
  updatedAt: string;
};

export type OmniDatabase = {
  users: User[];
  sessions: Session[];
  connectedAccounts: ConnectedAccount[];
  posts: SocialPost[];
  brandProfiles: BrandProfile[];
};

export type SafeUser = Pick<User, "id" | "email" | "name" | "createdAt"> & {
  tokenCount: number;
};
