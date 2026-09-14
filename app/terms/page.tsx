import Link from "next/link";

export const metadata = {
  title: "Terms of Service | BugChase SocialOS",
  description: "Terms of Service for BugChase SocialOS.",
};

const appUrl = "https://bugchase-socialos.vercel.app";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-retro-bg text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/" className="text-sm font-semibold text-retro-cyan hover:text-retro-yellow">
          ← Back to home
        </Link>

        <div className="mt-10 border-4 border-retro-magenta bg-[#101018] p-6 shadow-retro-magenta md:p-10">
          <p className="font-pixel text-xs uppercase text-retro-yellow">Effective date: September 14, 2026</p>
          <h1 className="mt-4 font-pixel text-3xl uppercase leading-relaxed text-white">Terms of Service</h1>
          <p className="mt-6 text-gray-300">
            These Terms of Service govern your use of BugChase SocialOS, also referred to as OmniSocial OS, available at
            {" "}{appUrl}. By using the application, you agree to these terms.
          </p>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">Service purpose</h2>
            <p>
              BugChase SocialOS is an AI-assisted social media operations tool for drafting, reviewing, approving,
              scheduling, and publishing social media content through connected platform APIs.
            </p>
          </section>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">User responsibilities</h2>
            <p>
              You are responsible for the content you create, approve, schedule, or publish. You agree not to use the
              service to post unlawful, misleading, abusive, infringing, spam, or platform-prohibited content.
            </p>
            <p>
              You must comply with all applicable social platform rules, including LinkedIn policies and Meta platform
              policies for Facebook and Instagram.
            </p>
          </section>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">AI-generated content</h2>
            <p>
              AI draft generation is provided to assist users. You are responsible for reviewing AI-generated drafts for
              accuracy, legality, brand compliance, and platform compliance before approving or publishing them.
            </p>
          </section>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">Connected accounts</h2>
            <p>
              By connecting a social account, you authorize the application to use the granted OAuth permissions to
              support account management and posting workflows. You may disconnect connected accounts at any time.
            </p>
          </section>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">Availability and limitations</h2>
            <p>
              The service is provided on an “as is” and “as available” basis. We do not guarantee uninterrupted access,
              delivery of scheduled posts, API availability, or compatibility with every future platform API change.
            </p>
          </section>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">Contact</h2>
            <p>
              For questions about these terms, contact the project owner through the GitHub repository at{" "}
              <a className="text-retro-yellow underline" href="https://github.com/shahzaibdev-bit/SocialOS">
                github.com/shahzaibdev-bit/SocialOS
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
