import { PageTitle } from "@/components/Panel";
import { getCurrentUser } from "@/lib/backend/auth";
import { listAiApiKeys } from "@/lib/backend/services";
import { ModelKeysClient } from "./ModelKeysClient";

export const dynamic = "force-dynamic";

export default async function ModelKeysPage() {
  const user = await getCurrentUser();
  const keys = user ? await listAiApiKeys(user.id) : [];

  return (
    <>
      <PageTitle
        title="Model Keys"
        subtitle="Bring your own OpenAI, OpenRouter, or Gemini API key. Keys are encrypted before storage and used for chat, post creation, and strategy generation."
      />
      <ModelKeysClient keys={keys} />
    </>
  );
}
