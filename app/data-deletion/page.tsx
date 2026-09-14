import Link from "next/link";

export const metadata = {
  title: "Data Deletion Instructions | BugChase SocialOS",
  description: "How to request deletion of BugChase SocialOS account and integration data.",
};

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-retro-bg text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/" className="text-sm font-semibold text-retro-cyan hover:text-retro-yellow">
          ← Back to home
        </Link>

        <div className="mt-10 border-4 border-retro-yellow bg-[#101018] p-6 shadow-retro-yellow md:p-10">
          <p className="font-pixel text-xs uppercase text-retro-cyan">Effective date: September 14, 2026</p>
          <h1 className="mt-4 font-pixel text-3xl uppercase leading-relaxed text-white">Data Deletion Instructions</h1>
          <p className="mt-6 text-gray-300">
            BugChase SocialOS stores account, workspace, draft, scheduling, and social integration data only to provide
            the application’s social media management features.
          </p>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">How to request deletion</h2>
            <ol className="list-decimal space-y-3 pl-6">
              <li>Go to the GitHub repository for this project.</li>
              <li>Open an issue with the title “Data deletion request”.</li>
              <li>Include the email address used for your BugChase SocialOS account.</li>
              <li>Specify whether you want all account data removed or only a connected social account removed.</li>
            </ol>
            <p>
              Repository:{" "}
              <a className="text-retro-yellow underline" href="https://github.com/shahzaibdev-bit/SocialOS">
                github.com/shahzaibdev-bit/SocialOS
              </a>
            </p>
          </section>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">What will be deleted</h2>
            <p>
              We will delete the relevant user account, connected account records, OAuth tokens, social drafts, scheduled
              posts, brand profile settings, MCP token metadata, and related workspace data, unless retention is required
              for security, abuse prevention, or legal reasons.
            </p>
          </section>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">Connected platforms</h2>
            <p>
              You may also revoke app access directly from your LinkedIn, Facebook, or Instagram/Meta account settings.
              Revoking access on a social platform stops future API access from that platform.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
