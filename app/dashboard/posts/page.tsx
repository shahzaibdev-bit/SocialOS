import { getCurrentUser } from "@/lib/backend/auth";
import { listPosts } from "@/lib/backend/services";
import { PageTitle, Panel } from "@/components/Panel";
import { PostComposer } from "./PostComposer";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const user = await getCurrentUser();
  const posts = user ? await listPosts(user.id) : [];

  return (
    <>
      <PageTitle title="Posts & Drafts" subtitle="Create drafts, queue scheduled posts, and keep everything in one shared backend path." />
      <PostComposer />
      <div className="mt-6 grid gap-4">
        {posts.map((post) => (
          <Panel key={post.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="rounded-full bg-retro-yellow/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-retro-yellow">{post.status.replace("_", " ")}</p>
              <p className="text-xs text-slate-500">{post.timezone}{post.scheduledFor ? ` · ${new Date(post.scheduledFor).toLocaleString()}` : ""}</p>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-200">{post.content}</p>
            <p className="mt-4 text-sm font-medium text-retro-cyan">{post.targetPlatforms.join(" / ")}</p>
          </Panel>
        ))}
        {!posts.length && <Panel>No posts yet. Create your first draft above.</Panel>}
      </div>
    </>
  );
}
