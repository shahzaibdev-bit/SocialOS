import { NextResponse } from "next/server";
import { createPost, generateDraftFromPrompt, listPosts, validateMcpToken } from "@/lib/backend/services";
import type { Platform } from "@/lib/backend/types";

export const runtime = "nodejs";

const tools = [
  {
    name: "draft_social_post",
    description: "Create a human-reviewable social media draft from a prompt.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: { type: "string" },
      },
      required: ["prompt"],
    },
  },
  {
    name: "schedule_post",
    description: "Create a scheduled post for selected social platforms.",
    inputSchema: {
      type: "object",
      properties: {
        content: { type: "string" },
        targetPlatforms: { type: "array", items: { type: "string", enum: ["x", "linkedin", "instagram", "facebook"] } },
        scheduledFor: { type: "string" },
        timezone: { type: "string" },
      },
      required: ["content", "targetPlatforms"],
    },
  },
  {
    name: "list_posts",
    description: "List the user's social media posts and drafts.",
    inputSchema: { type: "object", properties: {} },
  },
];

function jsonRpc(id: unknown, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id, result });
}

function jsonRpcError(id: unknown, message: string, code = -32000) {
  return NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } }, { status: code === -32600 ? 400 : 200 });
}

async function authenticate(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
  return token ? validateMcpToken(token) : null;
}

export async function GET() {
  return NextResponse.json({
    name: "OmniSocial OS MCP",
    version: "1.0.0-local",
    transport: "stateless-http",
    tools,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id ?? null;

    if (body.method === "tools/list") {
      return jsonRpc(id, { tools });
    }

    const auth = await authenticate(request);

    if (!auth) {
      return jsonRpcError(id, "Invalid or missing MCP API token.", -32600);
    }

    if (body.method !== "tools/call") {
      return jsonRpcError(id, "Unsupported MCP method.", -32601);
    }

    const name = body.params?.name;
    const args = body.params?.arguments ?? {};

    if (name === "draft_social_post") {
      const post = await generateDraftFromPrompt(auth.userId, String(args.prompt ?? ""));
      return jsonRpc(id, { content: [{ type: "text", text: `Draft created: ${post.id}` }], post });
    }

    if (name === "schedule_post") {
      const post = await createPost(auth.userId, {
        content: String(args.content ?? ""),
        targetPlatforms: Array.isArray(args.targetPlatforms) ? (args.targetPlatforms as Platform[]) : [],
        status: "scheduled",
        scheduledFor: args.scheduledFor ? String(args.scheduledFor) : new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        timezone: String(args.timezone ?? "Asia/Karachi"),
      });
      return jsonRpc(id, { content: [{ type: "text", text: `Post scheduled: ${post.id}` }], post });
    }

    if (name === "list_posts") {
      const posts = await listPosts(auth.userId);
      return jsonRpc(id, { content: [{ type: "text", text: JSON.stringify(posts, null, 2) }], posts });
    }

    return jsonRpcError(id, "Tool not found.", -32602);
  } catch (error) {
    return jsonRpcError(null, error instanceof Error ? error.message : "MCP request failed.");
  }
}
