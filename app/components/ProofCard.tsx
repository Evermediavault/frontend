/**
 * Vault Records card — layout aligned with vault-records reference (type + status, meta, CID row).
 */
'use client';

export type ProofRecordStatus = 'verified' | 'pending' | 'failed';

export type VaultRecordType =
  | 'snapshot'
  | 'milestone'
  | 'archive'
  | 'research'
  | 'event'
  | 'release'
  | 'other';

/** Display status for pill (reference: featured / anchored / verified) */
export type VaultDisplayStatus = 'featured' | 'anchored' | 'verified' | 'pending' | 'failed';

export interface ProofRecord {
  category: string;
  recordType: VaultRecordType;
  displayStatus: VaultDisplayStatus;
  status: ProofRecordStatus;
  title: string;
  contributor: string;
  createdAt: string;
  cid: string;
}

const TYPE_LABEL: Record<VaultRecordType, string> = {
  snapshot: 'Snapshot',
  milestone: 'Milestone',
  archive: 'Archive',
  research: 'Research',
  event: 'Event',
  release: 'Release',
  other: 'Record',
};

const TYPE_CLASS: Record<VaultRecordType, string> = {
  snapshot:
    'text-[#a78bfa] bg-[rgba(139,124,248,0.08)] border-[rgba(139,124,248,0.2)]',
  milestone:
    'text-[#60a5fa] bg-[rgba(96,165,250,0.08)] border-[rgba(96,165,250,0.2)]',
  archive:
    'text-[#34d399] bg-[rgba(52,211,153,0.08)] border-[rgba(52,211,153,0.2)]',
  research:
    'text-[#a3e635] bg-[rgba(163,230,53,0.08)] border-[rgba(163,230,53,0.2)]',
  event:
    'text-[#fb923c] bg-[rgba(251,146,60,0.08)] border-[rgba(251,146,60,0.2)]',
  release:
    'text-[#fbbf24] bg-[rgba(251,191,36,0.08)] border-[rgba(251,191,36,0.2)]',
  other: 'text-gray-400 bg-white/[0.04] border-white/10',
};

const STATUS_LABEL: Record<VaultDisplayStatus, string> = {
  featured: 'featured',
  anchored: 'anchored',
  verified: 'verified',
  pending: 'pending',
  failed: 'failed',
};

const STATUS_CLASS: Record<VaultDisplayStatus, string> = {
  featured:
    'text-[rgba(139,124,248,0.75)] bg-[rgba(139,124,248,0.07)] border-[rgba(139,124,248,0.18)]',
  anchored:
    'text-[rgba(52,211,153,0.7)] bg-[rgba(52,211,153,0.07)] border-[rgba(52,211,153,0.18)]',
  verified:
    'text-[rgba(96,165,250,0.75)] bg-[rgba(96,165,250,0.07)] border-[rgba(96,165,250,0.18)]',
  pending:
    'text-[rgba(251,191,36,0.85)] bg-[rgba(251,191,36,0.08)] border-[rgba(251,191,36,0.2)]',
  failed:
    'text-[rgba(248,113,113,0.85)] bg-[rgba(248,113,113,0.08)] border-[rgba(248,113,113,0.2)]',
};

function contributorAbbr(name: string): string {
  const t = name.trim();
  if (!t) return '?';
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return t.slice(0, 2).toUpperCase();
}

interface ProofCardProps {
  record: ProofRecord;
  style?: React.CSSProperties;
  onOpen?: () => void;
}

export default function ProofCard({ record, style, onOpen }: ProofCardProps) {
  const typeCls = TYPE_CLASS[record.recordType];
  const stCls = STATUS_CLASS[record.displayStatus];

  return (
    <article
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (!onOpen) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      style={style}
      className={`animate-vault-card-in flex cursor-pointer flex-col rounded-[14px] border border-white/[0.07] bg-[#0e1420] px-[22px] py-5 transition-[border-color,transform] duration-200 hover:-translate-y-px hover:border-[rgba(124,201,255,0.25)] ${
        onOpen ? 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC9FF]/40' : ''
      }`}
      aria-label={`Record: ${record.title}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span
          className={`rounded-xl border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.06em] ${typeCls}`}
        >
          {TYPE_LABEL[record.recordType]}
        </span>
        <span
          className={`shrink-0 rounded-[10px] border px-2 py-1 text-[10px] tracking-[0.04em] ${stCls}`}
        >
          {STATUS_LABEL[record.displayStatus]}
        </span>
      </div>

      <h3 className="font-poppins text-[14px] font-semibold leading-snug text-white line-clamp-3 mb-3.5 flex-1">
        {record.title}
      </h3>

      <div className="mb-3.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-[rgba(240,240,255,0.28)]">
          <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border border-[rgba(139,124,248,0.22)] bg-[rgba(139,124,248,0.1)] font-poppins text-[7px] font-bold text-[#a78bfa]">
            {contributorAbbr(record.contributor)}
          </span>
          <span className="truncate">{record.contributor}</span>
        </div>
        <time
          className="shrink-0 text-[11px] text-[rgba(240,240,255,0.28)]"
          dateTime={record.createdAt}
        >
          {record.createdAt}
        </time>
      </div>

      <div className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.05] bg-white/[0.025] px-3 py-2">
        <span className="shrink-0 text-[9px] font-medium uppercase tracking-[0.08em] text-[rgba(240,240,255,0.28)]">
          CID
        </span>
        <span
          className="min-w-0 flex-1 text-right font-mono text-[10px] text-[rgba(139,124,248,0.55)] truncate"
          title={record.cid}
        >
          {record.cid}
        </span>
      </div>
    </article>
  );
}
