import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSecret } from "./crypto";
import type { Platform } from "./types";
import { upsertOAuthAccount } from "./services";

type OAuthPlatform = Extract<Platform, "linkedin" | "facebook" | "instagram">;

type TokenResponse = {
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  token_type?: string;
  scope?: string;
};

const stateCookieName = "omnisocial_oauth_state";

export function getOAuthConfigured(platform: Platform) {
  if (platform === "linkedin") {
    return Boolean(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);
  }

  if (platform === "facebook" || platform === "instagram") {
    return Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET);
  }

  return false;
}

export function getOAuthRedirectUri(request: Request, platform: OAuthPlatform) {
  const origin = new URL(request.url).origin;
  return `${origin}/api/oauth/${platform}/callback`;
}

function getConfig(platform: OAuthPlatform) {
  if (platform === "linkedin") {
    return {
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      authorizeUrl: "https://www.linkedin.com/oauth/v2/authorization",
      tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
      scopes: ["openid", "profile", "email", "w_member_social"],
    };
  }

  return {
    clientId: process.env.META_APP_ID,
    clientSecret: process.env.META_APP_SECRET,
    authorizeUrl: "https://www.facebook.com/v20.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v20.0/oauth/access_token",
    scopes:
      platform === "facebook"
        ? ["public_profile", "email", "pages_show_list", "pages_read_engagement", "pages_manage_posts"]
        : ["public_profile", "email", "pages_show_list", "pages_read_engagement", "instagram_basic", "instagram_content_publish"],
  };
}

export async function createOAuthStartResponse(request: Request, platform: OAuthPlatform) {
  const config = getConfig(platform);

  if (!config.clientId || !config.clientSecret) {
    redirect(`/dashboard/integrations?oauth_error=${platform}_not_configured`);
  }

  const state = createSecret("state");
  const cookieStore = await cookies();
  cookieStore.set(stateCookieName, `${platform}:${state}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  });

  const redirectUri = getOAuthRedirectUri(request, platform);
  const url = new URL(config.authorizeUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", config.scopes.join(" "));

  redirect(url.toString());
}

async function exchangeCodeForToken(platform: OAuthPlatform, code: string, redirectUri: string) {
  const config = getConfig(platform);

  if (!config.clientId || !config.clientSecret) {
    throw new Error(`${platform} OAuth is not configured.`);
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: redirectUri,
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const token = (await response.json()) as TokenResponse & { error?: string; error_description?: string; message?: string };

  if (!response.ok || !token.access_token) {
    throw new Error(token.error_description || token.message || token.error || `Could not connect ${platform}.`);
  }

  return token;
}

async function fetchLinkedInProfile(accessToken: string) {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const profile = (await response.json()) as { sub?: string; name?: string; email?: string; localizedFirstName?: string; localizedLastName?: string };

  if (!response.ok || !profile.sub) {
    throw new Error("LinkedIn connected, but profile lookup failed.");
  }

  return {
    id: profile.sub,
    name: profile.name || [profile.localizedFirstName, profile.localizedLastName].filter(Boolean).join(" ") || profile.email || "LinkedIn Member",
  };
}

async function fetchMetaProfile(accessToken: string) {
  const response = await fetch(`https://graph.facebook.com/v20.0/me?fields=id,name,email&access_token=${encodeURIComponent(accessToken)}`);
  const profile = (await response.json()) as { id?: string; name?: string; email?: string; error?: { message?: string } };

  if (!response.ok || !profile.id) {
    throw new Error(profile.error?.message || "Meta connected, but profile lookup failed.");
  }

  return {
    id: profile.id,
    name: profile.name || profile.email || "Meta Account",
  };
}

export async function completeOAuthCallback(request: Request, platform: OAuthPlatform, userId: string) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error_description") || url.searchParams.get("error");

  if (error) {
    redirect(`/dashboard/integrations?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    redirect(`/dashboard/integrations?oauth_error=missing_oauth_code`);
  }

  const cookieStore = await cookies();
  const expected = cookieStore.get(stateCookieName)?.value;
  cookieStore.delete(stateCookieName);

  if (expected !== `${platform}:${state}`) {
    redirect(`/dashboard/integrations?oauth_error=invalid_oauth_state`);
  }

  const redirectUri = getOAuthRedirectUri(request, platform);
  const token = await exchangeCodeForToken(platform, code, redirectUri);
  const profile = platform === "linkedin" ? await fetchLinkedInProfile(token.access_token) : await fetchMetaProfile(token.access_token);
  const expiresAt = new Date(Date.now() + (token.expires_in ?? 60 * 60 * 24 * 60) * 1000).toISOString();

  await upsertOAuthAccount(userId, {
    platform,
    platformAccountId: profile.id,
    displayName: profile.name,
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    expiresAt,
    scopes: token.scope?.split(/[,\s]+/).filter(Boolean) ?? getConfig(platform).scopes,
    tokenType: token.token_type,
  });

  redirect(`/dashboard/integrations?oauth_success=${platform}`);
}
