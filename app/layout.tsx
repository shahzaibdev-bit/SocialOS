import type {Metadata} from 'next';
import { Press_Start_2P, JetBrains_Mono, VT323 } from 'next/font/google';
import './globals.css'; // Global styles
import { GlobalSpark } from "@/components/react-bits/GlobalSpark";

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
});

export const metadata: Metadata = {
  title: 'BugChase OS',
  description: 'The first multi-tenant AI social media OS.',
  openGraph: {
    title: 'BugChase OS',
    description: 'The first multi-tenant AI social media OS.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BugChase OS',
    description: 'The first multi-tenant AI social media OS.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${jetbrainsMono.variable} ${vt323.variable}`}>
      <body className="min-h-screen bg-retro-bg text-white font-mono crt" suppressHydrationWarning>
        <GlobalSpark sparkColor="#00F0FF" />
        {children}
      </body>
    </html>
  );
}

