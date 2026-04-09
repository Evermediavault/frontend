import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'EverMedia Vault - Turn Real Web3 Data into Trusted Knowledge',
  description:
    'Turn Real Web3 Data into Trusted Knowledge. EverMedia Vault helps projects anchor authentic data into verifiable records, building a shared knowledge layer for communities, users, and intelligent systems.',
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
