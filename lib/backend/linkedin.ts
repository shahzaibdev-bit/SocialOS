import { decryptSecret } from "./crypto";
import { readDb } from "./db";
import type { ConnectedAccount } from "./types";

const LINKEDIN_VERSION = "202608";
const analyticsScopes = ["r_member_social", "r_member_postAnalytics"];
const metricTypes = ["IMPRESSION", "MEMBERS_REACHED", "REACTION", "COMMENT", "RESHARE"] as const;

type MetricType = (typeof metricTypes)[number];

type LinkedInPost = {
  id: string;
  text: string;
  publishedAt?: string;
};

type LinkedInAnalyticsResult = {
  connected: boolean;
  available: boolean;
  accountName?: string;
  latestPost?: LinkedInPost;
  metrics?: Partial<Record<MetricType, number>>;
  impressions?: number | null;
  requiredScopes?: string[];
  grantedScopes?: string[];
  reason?: string;
};

type LinkedInApiError = Error & {
  status?: number;
};

function headers(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Linkedin-Version": LINKEDIN_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
    "Content-Type": "application/json",
  };
}

function hasAnalyticsScopes(account: ConnectedAccount) {
  const granted = new Set(account.scopes ?? []);
  return analyticsScopes.every((scope) => granted.has(scope));
}

async function fetchLinkedInJson<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, { headers: headers(accessToken), cache: "no-store" });
  const text = await response.text();
  const data = (text ? JSON.parse(text) : {}) as Record<string, unknown>;

  if (!response.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : typeof data.error_description === "string"
          ? data.error_description
          : typeof data.error === "string"
            ? data.error
            : `LinkedIn request failed with status ${response.status}.`;
    const error = new Error(message) as LinkedInApiError;
    error.status = response.status;
    throw error;
  }

  return data as T;
}

function extractText(post: Record<string, unknown>) {
  const commentary = post.commentary;

  if (typeof commentary === "string") {
    return commentary;
  }

  const content = post.content as Record<string, unknown> | undefined;
  const article = content?.article as Record<string, unknown> | undefined;
  return [article?.title, article?.description].filter((item): item is string => typeof item === "string").join(" · ");
}

function normalizePost(post: Record<string, unknown>): LinkedInPost | null {
  if (typeof post.id !== "string") {
    return null;
  }

  const timestamp = typeof post.publishedAt === "number" ? post.publishedAt : typeof post.createdAt === "number" ? post.createdAt : undefined;

  return {
    id: post.id,
    text: extractText(post) || "LinkedIn post",
    publishedAt: timestamp ? new Date(timestamp).toISOString() : undefined,
  };
}

function analyticsEntityParam(postUrn: string) {
  if (postUrn.includes(":ugcPost:")) {
    return `(ugc:${encodeURIComponent(postUrn)})`;
  }

  return `(share:${encodeURIComponent(postUrn)})`;
}

function metricFromValue(value: unknown): MetricType | null {
  if (typeof value === "string" && metricTypes.includes(value as MetricType)) {
    return value as MetricType;
  }

  if (value && typeof value === "object") {
    for (const nested of Object.values(value)) {
      const metric = metricFromValue(nested);
      if (metric) {
        return metric;
      }
    }
  }

  return null;
}

function extractMetricCount(payload: unknown, metricType: MetricType) {
  const elements = (payload as { elements?: Array<Record<string, unknown>> })?.elements ?? [];
  return elements.reduce((total, element) => {
    const metric = metricFromValue(element.metricType);
    const count = Number(element.count ?? 0);
    return metric === metricType && Number.isFinite(count) ? total + count : total;
  }, 0);
}

async function fetchLatestPost(account: ConnectedAccount, accessToken: string) {
  const authorUrn = `urn:li:person:${account.platformAccountId}`;
  const url = new URL("https://api.linkedin.com/rest/posts");
  url.searchParams.set("q", "author");
  url.searchParams.set("author", authorUrn);
  url.searchParams.set("count", "10");
  url.searchParams.set("sortBy", "LAST_MODIFIED");

  const data = await fetchLinkedInJson<{ elements?: Array<Record<string, unknown>> }>(url.toString(), accessToken);
  const posts = (data.elements ?? []).map(normalizePost).filter((post): post is LinkedInPost => Boolean(post));

  return posts.sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())[0];
}

async function fetchPostMetrics(postUrn: string, accessToken: string) {
  const metrics: Partial<Record<MetricType, number>> = {};

  await Promise.all(
    metricTypes.map(async (metricType) => {
      const url = `https://api.linkedin.com/rest/memberCreatorPostAnalytics?q=entity&entity=${analyticsEntityParam(
        postUrn,
      )}&queryType=${metricType}&aggregation=TOTAL`;

      const data = await fetchLinkedInJson<unknown>(url, accessToken);
      metrics[metricType] = extractMetricCount(data, metricType);
    }),
  );

  return metrics;
}

export async function getLinkedInLatestAnalytics(userId: string): Promise<LinkedInAnalyticsResult> {
  const db = await readDb();
  const account = db.connectedAccounts.find(
    (candidate) => candidate.userId === userId && candidate.platform === "linkedin" && candidate.connectionType === "oauth",
  );

  if (!account) {
    return {
      connected: false,
      available: false,
      requiredScopes: analyticsScopes,
      reason: "LinkedIn is not connected with a real OAuth account yet.",
    };
  }

  if (!hasAnalyticsScopes(account)) {
    return {
      connected: true,
      available: false,
      accountName: account.displayName,
      grantedScopes: account.scopes ?? [],
      requiredScopes: analyticsScopes,
      reason: "Your current LinkedIn token was created before analytics read permissions were added. Reconnect LinkedIn after enabling the required LinkedIn products/scopes.",
    };
  }

  try {
    const accessToken = decryptSecret(account.accessToken);
    const latestPost = await fetchLatestPost(account, accessToken);

    if (!latestPost) {
      return {
        connected: true,
        available: true,
        accountName: account.displayName,
        grantedScopes: account.scopes ?? [],
        requiredScopes: analyticsScopes,
        reason: "LinkedIn connected successfully, but no member posts were returned for this account.",
      };
    }

    const metrics = await fetchPostMetrics(latestPost.id, accessToken);

    return {
      connected: true,
      available: true,
      accountName: account.displayName,
      latestPost,
      metrics,
      impressions: metrics.IMPRESSION ?? null,
      grantedScopes: account.scopes ?? [],
      requiredScopes: analyticsScopes,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "LinkedIn analytics request failed.";
    return {
      connected: true,
      available: false,
      accountName: account.displayName,
      grantedScopes: account.scopes ?? [],
      requiredScopes: analyticsScopes,
      reason:
        message.includes("not enough permissions") || message.includes("ACCESS_DENIED") || (error as LinkedInApiError).status === 403
          ? "LinkedIn rejected the analytics request. Your LinkedIn developer app likely needs approval for r_member_social and r_member_postAnalytics, then you must reconnect the account."
          : message,
    };
  }
}
