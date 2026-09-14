import { PageTitle } from "@/components/Panel";
import { ChatDraftForm } from "./ChatDraftForm";

export default function ChatPage() {
  return (
    <>
      <PageTitle title="AI Chat" subtitle="Generate social drafts through the same backend service used by the web dashboard and MCP endpoint." />
      <ChatDraftForm />
    </>
  );
}
