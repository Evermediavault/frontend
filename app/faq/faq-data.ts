export type FaqItem = { q: string; a: string };

export type FaqGroup = {
  title: string;
  description: string;
  items: FaqItem[];
};

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'About EverMedia Vault',
    description:
      'Understand what EverMedia Vault is, who it is for, and why the alliance matters.',
    items: [
      {
        q: 'What is EverMedia Vault?',
        a: 'EverMedia Vault is a verifiable data alliance for Web3. It helps projects, researchers, and communities anchor important records into trusted storage and turn fragmented information into structured, discoverable knowledge.',
      },
      {
        q: 'Is EverMedia Vault a media platform?',
        a: 'No. EverMedia Vault is not a publishing platform or a news site. It is a proof-first infrastructure layer that helps members preserve, structure, and surface important records over time.',
      },
      {
        q: 'Who is EverMedia Vault for?',
        a: 'EverMedia Vault is designed for Web3 projects, media and research teams, ecosystem communities, governance groups, and data-rich organizations that want a trusted, structured, and long-term digital presence.',
      },
      {
        q: 'Why should a project join the alliance?',
        a: 'Projects join EverMedia Vault to gain verifiable record anchoring, long-term visibility, structured data identity, stronger discoverability inside a trusted network, and future access to intelligent query and visibility tools.',
      },
    ],
  },
  {
    title: 'Data & Records',
    description:
      'Learn how data is handled, what becomes a record, and how proof is represented.',
    items: [
      {
        q: 'What kind of data can be included?',
        a: 'EverMedia Vault can support project archives, research materials, governance history, event records, public reports, and media-related datasets. The goal is not to store everything, but to anchor meaningful records with proof and structure.',
      },
      {
        q: 'What does “verifiable” mean here?',
        a: 'It means a record can be traced to a storage proof and a persistent identifier such as a CID. Instead of relying only on centralized platforms, the record is anchored in decentralized storage and can be independently referenced over time.',
      },
      {
        q: 'Is all uploaded content public?',
        a: 'Not necessarily. EverMedia Vault can display public metadata and proof while keeping the underlying content private, encrypted, or access-controlled when needed.',
      },
      {
        q: 'What is a Proof Card?',
        a: 'A Proof Card is a structured record object inside EverMedia Vault. It represents an anchored dataset, archive, or milestone with essential metadata, proof references, and contributor identity. It is not just a file preview — it is a verifiable record unit.',
      },
      {
        q: 'What is the difference between a file upload and a Vault Record?',
        a: 'A file upload is a raw data action. A Vault Record is a curated, structured record that represents meaningful data with proof and context. Not every uploaded file becomes a public-facing Vault Record.',
      },
    ],
  },
  {
    title: 'System & Future',
    description:
      'See how the current system works today and where it is going next.',
    items: [
      {
        q: 'How does storage work today?',
        a: 'At the current stage, EverMedia Vault uses Filecoin-based storage workflows to support verifiable data anchoring and operational management. The system has already integrated backend upload flows, role-based management, and payment logic for storage operations.',
      },
      {
        q: 'Can alliance members upload data themselves?',
        a: 'Yes. EverMedia Vault includes a backend system with role-based access. Alliance members can upload and manage data through the platform, while administrators oversee verification, payment, and publishing logic during the current phase.',
      },
      {
        q: 'How is payment handled?',
        a: 'Storage-related payment logic has already been integrated into the backend workflow. At the current stage, payments are administered through the platform while the system remains in internal testing and controlled rollout.',
      },
      {
        q: 'What does the alliance unlock beyond storage?',
        a: 'The alliance creates network value. It gives members a shared layer of credibility, structured presence across the ecosystem, future query visibility, and stronger potential for partnerships, discovery, and knowledge-based exposure.',
      },
      {
        q: 'What is the long-term direction of EverMedia Vault?',
        a: 'EverMedia Vault is evolving in three layers: Proof Archive, Verified Data Network, and AI Visibility Layer. The long-term goal is to become a verifiable knowledge layer for Web3.',
      },
      {
        q: 'Is EverMedia Vault already an AI product?',
        a: 'Not yet. The current focus is on building the trusted data foundation first. AI will be introduced as a later layer for query, summarization, and visibility — built on verified records rather than untrusted scraped data.',
      },
      {
        q: 'How can I join?',
        a: 'You can join by contacting the team through the website and sharing your project, data needs, or collaboration intent. The alliance is currently expanding in controlled phases to ensure the infrastructure and data standards remain strong.',
      },
    ],
  },
];
