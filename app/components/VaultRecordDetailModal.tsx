'use client';

import { useEffect } from 'react';
import type { ProofRecord } from './ProofCard';

type VaultRecordDetailModalProps = {
  record: ProofRecord | null;
  onClose: () => void;
};

export default function VaultRecordDetailModal({ record, onClose }: VaultRecordDetailModalProps) {
  useEffect(() => {
    if (!record) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [record, onClose]);

  if (!record) return null;

  const verifyHref = `https://filfox.info/en/search?q=${encodeURIComponent(record.cid)}`;

  const copyCid = () => {
    navigator.clipboard.writeText(record.cid).catch(() => {});
  };

  const typeLabel = record.recordType.charAt(0).toUpperCase() + record.recordType.slice(1);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vault-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[6px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="relative z-10 max-h-[85vh] w-full max-w-[500px] overflow-y-auto rounded-[18px] border border-[rgba(139,124,248,0.22)] bg-[#0e1420] p-8 shadow-2xl animate-vault-panel-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-white/[0.07] text-[15px] text-[rgba(240,240,255,0.28)] transition-colors hover:border-[rgba(139,124,248,0.3)] hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="mb-4 flex flex-wrap gap-2">
          <span
            className={`rounded-xl border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
              record.recordType === 'snapshot'
                ? 'border-[rgba(139,124,248,0.2)] bg-[rgba(139,124,248,0.08)] text-[#a78bfa]'
                : record.recordType === 'milestone'
                  ? 'border-[rgba(96,165,250,0.2)] bg-[rgba(96,165,250,0.08)] text-[#60a5fa]'
                  : record.recordType === 'archive'
                    ? 'border-[rgba(52,211,153,0.2)] bg-[rgba(52,211,153,0.08)] text-[#34d399]'
                    : record.recordType === 'research'
                      ? 'border-[rgba(163,230,53,0.2)] bg-[rgba(163,230,53,0.08)] text-[#a3e635]'
                      : record.recordType === 'event'
                        ? 'border-[rgba(251,146,60,0.2)] bg-[rgba(251,146,60,0.08)] text-[#fb923c]'
                        : record.recordType === 'release'
                          ? 'border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.08)] text-[#fbbf24]'
                          : 'border-white/10 bg-white/[0.04] text-gray-400'
            }`}
          >
            {typeLabel}
          </span>
          <span className="rounded-[10px] border border-white/10 px-2 py-1 text-[10px] tracking-wide text-[rgba(240,240,255,0.5)]">
            {record.displayStatus}
          </span>
        </div>

        <h2 id="vault-detail-title" className="font-poppins text-xl font-bold leading-snug text-white">
          {record.title}
        </h2>

        <p className="mt-3 border-b border-white/[0.07] pb-6 text-[13px] leading-relaxed text-[rgba(240,240,255,0.5)]">
          On-chain proof anchor from the EverMedia Vault alliance. Category: {record.category || '—'}.
        </p>

        <dl className="mt-6 flex flex-col gap-3.5">
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 pt-0.5 text-[11px] uppercase tracking-[0.06em] text-[rgba(240,240,255,0.28)]">
              Contributor
            </dt>
            <dd className="text-right text-[12px] text-[rgba(240,240,255,0.5)]">{record.contributor}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 pt-0.5 text-[11px] uppercase tracking-[0.06em] text-[rgba(240,240,255,0.28)]">
              Timestamp
            </dt>
            <dd className="text-right text-[12px] text-[rgba(240,240,255,0.5)]">{record.createdAt}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 pt-0.5 text-[11px] uppercase tracking-[0.06em] text-[rgba(240,240,255,0.28)]">
              Record type
            </dt>
            <dd className="text-right text-[12px] text-[rgba(240,240,255,0.5)]">{record.recordType}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 pt-0.5 text-[11px] uppercase tracking-[0.06em] text-[rgba(240,240,255,0.28)]">
              CID
            </dt>
            <dd className="max-w-[68%] break-all text-right font-mono text-[11px] leading-relaxed text-[rgba(139,124,248,0.65)]">
              {record.cid}
            </dd>
          </div>
        </dl>

        <hr className="my-5 border-0 border-t border-white/[0.07]" />

        <div className="flex flex-wrap gap-2.5">
          <a
            href={verifyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(139,124,248,0.22)] bg-[rgba(139,124,248,0.1)] px-[18px] py-2.5 text-xs text-[#a78bfa] transition-colors hover:bg-[rgba(139,124,248,0.18)]"
          >
            Verify on Filecoin ↗
          </a>
          <button
            type="button"
            onClick={copyCid}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] px-[18px] py-2.5 text-xs text-[rgba(240,240,255,0.5)] transition-colors hover:border-white/15 hover:bg-white/[0.04]"
          >
            Copy CID
          </button>
        </div>
      </div>
    </div>
  );
}
