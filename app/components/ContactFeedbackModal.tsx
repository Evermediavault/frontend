'use client';

import { useEffect } from 'react';

export type ContactFeedbackVariant = 'success' | 'error';

export interface ContactFeedbackModalProps {
  open: boolean;
  variant: ContactFeedbackVariant;
  title?: string;
  message: string;
  onClose: () => void;
  /** Success: auto-close after ms (default 5000). Error: no auto-close unless set. */
  autoCloseMs?: number;
  /** Label for primary button */
  confirmLabel?: string;
}

export default function ContactFeedbackModal({
  open,
  variant,
  title,
  message,
  onClose,
  autoCloseMs,
  confirmLabel = 'OK',
}: ContactFeedbackModalProps) {
  const resolvedAutoClose =
    autoCloseMs ?? (variant === 'success' ? 5000 : undefined);

  useEffect(() => {
    if (!open || resolvedAutoClose == null) return;
    const t = window.setTimeout(() => onClose(), resolvedAutoClose);
    return () => window.clearTimeout(t);
  }, [open, resolvedAutoClose, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const statusBadgeClass =
    variant === 'success'
      ? 'border-[rgba(124,201,255,0.22)] bg-[rgba(124,201,255,0.08)] text-[#7CC9FF]'
      : 'border-[rgba(248,113,113,0.28)] bg-[rgba(248,113,113,0.08)] text-[#fca5a5]';

  const statusBadgeLabel = variant === 'success' ? 'Success' : 'Error';

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
        aria-labelledby="contact-feedback-title"
        aria-describedby="contact-feedback-desc"
        className="relative z-10 w-full max-w-[440px] rounded-[18px] border border-[rgba(139,124,248,0.22)] bg-[#0e1420] p-8 shadow-2xl animate-vault-panel-in"
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

        <div className="mb-4 flex flex-wrap gap-2 pr-10">
          <span
            className={`rounded-xl border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${statusBadgeClass}`}
          >
            {statusBadgeLabel}
          </span>
        </div>

        <h2
          id="contact-feedback-title"
          className="font-poppins pr-8 text-xl font-bold leading-snug text-white"
        >
          {title ?? (variant === 'success' ? 'Thank you' : 'Something went wrong')}
        </h2>

        <p
          id="contact-feedback-desc"
          className="mt-3 border-b border-white/[0.07] pb-6 text-[13px] leading-relaxed text-[rgba(240,240,255,0.5)]"
        >
          {message}
        </p>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#0A4DD3] to-[#06BAD9] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0A4DD3]/20 transition hover:from-[#0A4DD3] hover:to-[#08D0F0] hover:shadow-[#06BAD9]/25"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
