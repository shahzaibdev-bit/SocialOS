import { getCurrentUser } from "@/lib/backend/auth";
import { getBrandProfile } from "@/lib/backend/services";
import { PageTitle } from "@/components/Panel";
import { BrandForm } from "./BrandForm";

export const dynamic = "force-dynamic";

export default async function BrandPage() {
  const user = await getCurrentUser();
  const brand = user ? await getBrandProfile(user.id) : { userId: "", voice: "", bannedWords: [], approvalMode: "draft_only" as const, updatedAt: "" };

  return (
    <>
      <PageTitle title="Brand Voice" subtitle="This profile is injected into AI drafting so generated content follows tone and compliance rules." />
      <BrandForm brand={brand} />
    </>
  );
}
