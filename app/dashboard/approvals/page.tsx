import { getCurrentUser } from "@/lib/backend/auth";
import { listPosts } from "@/lib/backend/services";
import { PageTitle, Panel } from "@/components/Panel";
import { ApprovalActions } from "./ApprovalActions";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const user = await getCurrentUser();
  const posts = user ? await listPosts(user.id, "pending_approval") : [];

  return (
    <>
      <PageTitle title="Approval Queue" subtitle="Human-in-the-loop guardrails. AI can draft, but a manager approves before execution." />
      <div className="grid gap-4">
        {posts.map((post) => (
          <Panel key={post.id}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-retro-yellow">{post.targetPlatforms.join(" / ")}</p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-200">{post.content}</p>
            <ApprovalActions postId={post.id} />
          </Panel>
        ))}
        {!posts.length && <Panel>No posts waiting for approval.</Panel>}
      </div>
    </>
  );
}
