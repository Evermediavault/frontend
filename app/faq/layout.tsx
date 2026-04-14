import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — EverMedia Vault',
  description:
    'Frequently asked questions about EverMedia Vault: the alliance, verifiable records, storage, and roadmap.',
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
