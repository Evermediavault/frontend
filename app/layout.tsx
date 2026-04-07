import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'EverMedia Vault - A Collaborative Data Alliance',
  description:
    'A collaborative data alliance for the AI and decentralized era. Data should not merely be stored — it should be activated, enhanced, and leveraged through collaboration.',
  keywords: 'Web3, Data Alliance, AI, Decentralized, Blockchain, Data Storage',
};

const publicEnv = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} flex min-h-screen flex-col`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__PUBLIC_ENV__=${JSON.stringify(publicEnv)};`,
          }}
        />
        <div className="flex-1">{children}</div>
        <Footer />
        {/* Global portal root for overlays (stable stacking vs flex/transform ancestors) */}
        <div id="emv-modal-root" />
      </body>
    </html>
  );
}
