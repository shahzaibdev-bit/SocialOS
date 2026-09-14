import { decryptSecret } from "./crypto";
import type { AiProvider, SafeAiApiKey, SocialPost } from "./types";

export const defaultModels: Record<AiProvider, string> = {
  openai: "gpt-4o-mini",
  openrouter: "openai/gpt-4o-mini",
  gemini: "gemini-1.5-flash",
};

type StoredKey = SafeAiApiKey & {
  encryptedKey: string;
};

export async function generateWithProvider({
  key,
  prompt,
  purpose,
  posts = [],
}: {
  key?: StoredKey | null;
  prompt: string;
  purpose: "draft" | "strategy";
  posts?: SocialPost[];
}) {
  const system =
    purpose === "strategy"
      ? "You are a senior social media strategist. Give concise, useful, platform-aware analytics and a practical action plan."
      : "You are a senior social media copywriter. Write polished, platform-aware social media content ready for human review.";

  const fallback = buildLocalFallback(prompt, purpose, posts);

  if (!key) {
    return fallback;
  }

  const apiKey = decryptSecret(key.encryptedKey);

  try {
    if (key.provider === "gemini") {
      return await callGemini(apiKey, key.defaultModel, system, prompt, posts);
    }

    return await callOpenAiCompatible(key.provider, apiKey, key.defaultModel, system, prompt, posts);
  } catch (error) {
    return `${fallback}\n\nAI provider note: ${error instanceof Error ? error.message : "Provider call failed."}`;
  }
}

function buildLocalFallback(prompt: string, purpose: "draft" | "strategy", posts: SocialPost[]) {
  if (purpose === "draft") {
    return `🚀 ${prompt.trim() || "New launch update"}\n\nBuilt with OmniSocial OS: clear message, platform-aware copy, and human approval before publishing.`;
  }

  const total = posts.length;
  const pending = posts.filter((post) => post.status === "pending_approval").length;
  const scheduled = posts.filter((post) => post.status === "scheduled").length;
  const published = posts.filter((post) => post.status === "published").length;

  return [
    `Strategy brief for: ${prompt.trim() || "all connected platforms"}`,
    "",
    `Current workspace: ${total} posts, ${pending} pending approval, ${scheduled} scheduled, ${published} published.`,
    "Recommended next moves:",
    "1. Turn pending approvals into scheduled posts with one clear CTA per platform.",
    "2. Use LinkedIn for thought leadership and Facebook/Instagram for visual proof and community updates.",
    "3. Review post performance weekly, then double down on topics with higher engagement.",
    "4. Keep AI in draft-only mode until platform publishing and analytics permissions are fully verified.",
  ].join("\n");
}

async function callOpenAiCompatible(
  provider: "openai" | "openrouter",
  apiKey: string,
  model: string,
  system: string,
  prompt: string,
  posts: SocialPost[],
) {
  const endpoint = provider === "openai" ? "https://api.openai.com/v1/chat/completions" : "https://openrouter.ai/api/v1/chat/completions";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  if (provider === "openrouter") {
    headers["HTTP-Referer"] = "https://bugchase-socialos.vercel.app";
    headers["X-Title"] = "BugChase SocialOS";
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: buildUserPrompt(prompt, posts) },
      ],
      temperature: 0.7,
    }),
  });

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } };

  if (!response.ok) {
    throw new Error(data.error?.message || `${provider} request failed.`);
  }

  return data.choices?.[0]?.message?.content?.trim() || "AI provider returned an empty response.";
}

async function callGemini(apiKey: string, model: string, system: string, prompt: string, posts: SocialPost[]) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: buildUserPrompt(prompt, posts) }] }],
    }),
  });

  const data = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } };

  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini request failed.");
  }

  return data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n").trim() || "Gemini returned an empty response.";
}

function buildUserPrompt(prompt: string, posts: SocialPost[]) {
  if (!posts.length) {
    return prompt;
  }

  return `${prompt}\n\nWorkspace posts:\n${posts
    .slice(0, 20)
    .map((post) => `- [${post.status}] ${post.targetPlatforms.join(", ")}: ${post.content.slice(0, 220)}`)
    .join("\n")}`;
}
