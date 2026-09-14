import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | BugChase SocialOS",
  description: "Privacy Policy for BugChase SocialOS.",
};

const appUrl = "https://bugchase-socialos.vercel.app";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-retro-bg text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/" className="text-sm font-semibold text-retro-cyan hover:text-retro-yellow">
          ← Back to home
        </Link>

        <div className="mt-10 border-4 border-retro-cyan bg-[#101018] p-6 shadow-retro-cyan md:p-10">
          <p className="font-pixel text-xs uppercase text-retro-yellow">Effective date: September 14, 2026</p>
          <h1 className="mt-4 font-pixel text-3xl uppercase leading-relaxed text-white">Privacy Policy</h1>
          <p className="mt-6 text-gray-300">
            BugChase SocialOS, also referred to as OmniSocial OS, is an AI-assisted social media management platform.
            This Privacy Policy explains how we collect, use, store, and protect information when you use {appUrl}.
          </p>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">Information we collect</h2>
            <p>
              We may collect account information such as your name, email address, encrypted password, connected social
              account identifiers, OAuth access tokens, refresh tokens, post drafts, scheduled content, brand voice
              preferences, approval settings, and API/MCP token metadata.
            </p>
            <p>
              When you connect LinkedIn, Facebook, or Instagram, we request only the permissions needed to authenticate
              your account, read the connected profile/page/account required for posting, and publish content that you
              explicitly create, approve, or schedule through the platform.
            </p>
          </section>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">How we use information</h2>
            <p>
              We use your information to provide login, dashboard access, social account connection, AI draft generation,
              post approval workflows, scheduling, API access, security, rate limiting, and platform diagnostics.
            </p>
            <p>
              We do not sell your personal information. We do not publish content to social platforms unless you or an
              authorized user has created, approved, scheduled, or requested that action.
            </p>
          </section>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">Third-party platforms</h2>
            <p>
              Social platform integrations are provided through official platform APIs, including LinkedIn and Meta
              services such as Facebook Pages and Instagram professional accounts. Your use of those integrations is also
              governed by each platform’s own terms, developer policies, and privacy rules.
            </p>
          </section>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">Data storage and security</h2>
            <p>
              We use reasonable technical safeguards such as encrypted tokens, hashed passwords, authenticated sessions,
              environment-based secrets, and rate limiting. No system is perfectly secure, but we work to protect your
              information against unauthorized access, loss, misuse, or disclosure.
            </p>
          </section>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">Data deletion</h2>
            <p>
              You may request deletion of your account, connected social accounts, stored tokens, drafts, and related
              workspace data by contacting the project owner. Disconnecting an integration removes the stored connection
              record from the application.
            </p>
            <p>
              Detailed deletion instructions are available at{" "}
              <Link className="text-retro-yellow underline" href="/data-deletion">
                {appUrl}/data-deletion
              </Link>
              .
            </p>
          </section>

          <section className="mt-8 space-y-4 text-gray-300">
            <h2 className="font-pixel text-lg uppercase text-retro-cyan">Contact</h2>
            <p>
              For privacy requests, contact the project owner through the GitHub repository at{" "}
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
