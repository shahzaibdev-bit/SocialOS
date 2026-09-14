import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/backend/auth";
import { DashboardNav } from "@/components/DashboardNav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,240,255,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,0,60,0.10),transparent_34%),#070A12] p-4 text-white md:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <DashboardNav name={user.name} />
        <section className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}
