'use client';

import { useEffect } from 'react';
import type { PartnerItem } from '../../lib/request';

type PartnerDetailModalProps = {
  partner: PartnerItem | null;
  onClose: () => void;
};

export default function PartnerDetailModal({ partner, onClose }: PartnerDetailModalProps) {
  useEffect(() => {
    if (!partner) return;
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
  }, [partner, onClose]);

  if (!partner) return null;

  const desc = partner.description?.trim();

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[6px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-detail-title"
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

        <div className="mb-4 flex flex-wrap items-start gap-4 pr-10">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-black/30">
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-full w-full object-contain p-1"
            />
          </div>
          <div className="min-w-0 flex-1">
            {partner.tag ? (
              <span className="mb-2 inline-block rounded-xl border border-[rgba(124,201,255,0.22)] bg-[rgba(124,201,255,0.08)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#7CC9FF]">
                {partner.tag}
              </span>
            ) : null}
            <h2
              id="partner-detail-title"
              className="font-poppins text-xl font-bold leading-snug text-white"
            >
              {partner.name}
            </h2>
          </div>
        </div>

        <p className="border-b border-white/[0.07] pb-6 text-[13px] leading-relaxed text-[rgba(240,240,255,0.5)]">
          {desc ? desc : '—'}
        </p>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <a
            href={partner.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(139,124,248,0.22)] bg-[rgba(139,124,248,0.1)] px-[18px] py-2.5 text-xs text-[#a78bfa] transition-colors hover:bg-[rgba(139,124,248,0.18)]"
          >
            Visit website ↗
          </a>
        </div>
      </div>
    </div>
  );
}
