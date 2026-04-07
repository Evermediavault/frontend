/**
 * Vault Records: proof list from GET /api/v1/media/list — card layout per design reference.
 */
'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import ProofCard, {
  type ProofRecord,
  type ProofRecordStatus,
  type VaultRecordType,
} from '../components/ProofCard';
import VaultRecordDetailModal from '../components/VaultRecordDetailModal';
import { getMediaList, type MediaListItem } from '../../lib/request';

function formatDisplayDate(iso: string, mode: 'date' | 'datetime' = 'date'): string {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    if (mode === 'date') return `${y}-${m}-${day}`;
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}`;
  } catch {
    return iso;
  }
}

function inferRecordType(categoryName: string | undefined): VaultRecordType {
  const c = (categoryName ?? '').toLowerCase();
  if (c.includes('snapshot')) return 'snapshot';
  if (c.includes('milestone')) return 'milestone';
  if (c.includes('archive')) return 'archive';
  if (c.includes('research')) return 'research';
  if (c.includes('event')) return 'event';
  if (c.includes('release')) return 'release';
  return 'other';
}

function mapApiToDisplayStatus(
  api: ProofRecordStatus,
  recordType: VaultRecordType,
): ProofRecord['displayStatus'] {
  if (api === 'pending') return 'pending';
  if (api === 'failed') return 'failed';
  if (recordType === 'research' || recordType === 'snapshot') return 'featured';
  if (recordType === 'archive' || recordType === 'event') return 'anchored';
  return 'verified';
}

/** API does not expose verification state yet; treat all as verified for badge heuristics. */
function mapMediaItemToProofRecord(item: MediaListItem): ProofRecord {
  const apiStatus: ProofRecordStatus = 'verified';
  const recordType = inferRecordType(item.category_name);
  return {
    category: item.category_name ?? 'Uncategorized',
    recordType,
    displayStatus: mapApiToDisplayStatus(apiStatus, recordType),
    status: apiStatus,
    title: item.name,
    contributor: item.uploader_username ?? 'Anonymous',
    createdAt: formatDisplayDate(item.uploaded_at, 'date'),
    cid: item.synapse_index_id,
  };
}

const FILTER_CHIPS: { id: 'all' | VaultRecordType; label: string; dotClass: string }[] = [
  { id: 'all', label: 'All records', dotClass: 'bg-current opacity-70' },
  { id: 'snapshot', label: 'Snapshot', dotClass: 'bg-[#8b7cf8]' },
  { id: 'milestone', label: 'Milestone', dotClass: 'bg-[#60a5fa]' },
  { id: 'archive', label: 'Archive', dotClass: 'bg-[#34d399]' },
  { id: 'research', label: 'Research', dotClass: 'bg-[#a3e635]' },
  { id: 'event', label: 'Event', dotClass: 'bg-[#fb923c]' },
  { id: 'release', label: 'Release', dotClass: 'bg-[#fbbf24]' },
  { id: 'other', label: 'Other', dotClass: 'bg-gray-500' },
];

export default function VaultRecordsPage() {
  const [isVisible, setIsVisible] = useState({ hero: false, content: false });
  const [records, setRecords] = useState<ProofRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | VaultRecordType>('all');
  const [detail, setDetail] = useState<ProofRecord | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getMediaList({ page: 1, page_size: 50 })
      .then((res) => {
        if (cancelled || !res.data) return;
        setRecords(res.data.map((item) => mapMediaItemToProofRecord(item)));
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const refs: { key: 'hero' | 'content'; el: HTMLElement | null }[] = [
      { key: 'hero', el: heroRef.current },
      { key: 'content', el: contentRef.current },
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const key = refs.find((r) => r.el === entry.target)?.key;
          if (key) setIsVisible((prev) => ({ ...prev, [key]: true }));
        });
      },
      { threshold: 0.1 },
    );
    refs.forEach(({ el }) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return records;
    return records.filter((r) => r.recordType === filter);
  }, [records, filter]);

  const totalRecords = records.length;
  const featuredCount = records.filter((r) => r.displayStatus === 'featured').length;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#06080f] text-white">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.12) 0%, transparent 100%),
            radial-gradient(1px 1px at 75% 12%, rgba(255,255,255,0.1) 0%, transparent 100%),
            radial-gradient(1px 1px at 40% 68%, rgba(255,255,255,0.09) 0%, transparent 100%),
            radial-gradient(1px 1px at 88% 55%, rgba(255,255,255,0.1) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 88%, rgba(255,255,255,0.08) 0%, transparent 100%),
            radial-gradient(1px 1px at 28% 45%, rgba(255,255,255,0.07) 0%, transparent 100%)
          `,
        }}
      />
      <div className="relative z-[1]">
        <Header />

        <section
          ref={heroRef}
          className="relative flex min-h-[42vh] flex-col items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0">
            <Image src="/images/hero-bg.png" alt="" fill className="object-cover" priority />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 45%, transparent 30%, rgba(6,8,15,0.5) 100%)',
              }}
            />
          </div>

          <div
            className={`relative z-10 max-w-3xl px-4 text-center transition-all duration-[1500ms] ${
              isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#7CC9FF]/80 md:mb-4 md:text-sm">
              Data & Records
            </p>
            <h1 className="animate-gradient bg-gradient-to-r from-[#fff] via-[#7CC9FF] to-[#fff] bg-clip-text font-poppins text-[38px] font-medium leading-tight tracking-[0.15px] text-transparent drop-shadow-2xl md:text-[48px] lg:text-[56px]">
              Vault Records
            </h1>
            <p className="mx-auto mt-5 max-w-xl font-light leading-relaxed text-gray-400 text-sm md:text-base">
              On-chain proof anchors submitted by alliance members. Each record represents a verified
              data event — not a content feed.
            </p>
            <div
              className="mx-auto mt-6 h-px w-12 rounded-full opacity-60"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(124,201,255,0.6), transparent)',
              }}
            />
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#06080f] to-transparent" />
        </section>

        <section
          ref={contentRef}
          className={`relative px-4 pb-16 transition-all duration-1000 md:px-8 md:pb-20 ${
            isVisible.content ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-[1280px] px-0 md:px-4">
            <div className="flex flex-col justify-between gap-6 border-b border-white/[0.07] pb-9 pt-10 md:flex-row md:items-end">
              <div>
                <h2 className="font-poppins text-[28px] font-bold leading-tight tracking-tight text-white md:text-[34px]">
                  Vault Records
                </h2>
                <p className="mt-2 max-w-[400px] text-[13px] leading-relaxed text-[rgba(240,240,255,0.28)]">
                  Browse and verify indexed anchors. Filters use category names from your API when
                  available.
                </p>
              </div>
              <div className="flex gap-8 md:gap-10">
                <div className="text-right">
                  <div className="font-poppins text-[28px] font-bold leading-none text-[#8b7cf8]">
                    {loading ? '—' : totalRecords}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[rgba(240,240,255,0.28)]">
                    Total records
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-poppins text-[28px] font-bold leading-none text-[#8b7cf8]">
                    {loading ? '—' : featuredCount}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[rgba(240,240,255,0.28)]">
                    Featured
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-wrap items-stretch justify-between gap-3 py-5 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-2">
                {FILTER_CHIPS.map((chip) => {
                  const active = filter === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setFilter(chip.id)}
                      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] tracking-wide transition-all ${
                        active
                          ? 'border-[rgba(139,124,248,0.22)] bg-[rgba(139,124,248,0.1)] text-[#a78bfa]'
                          : 'border-white/[0.07] bg-transparent text-[rgba(240,240,255,0.28)] hover:border-white/15 hover:text-[rgba(240,240,255,0.5)]'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${chip.dotClass}`} />
                      {chip.label}
                    </button>
                  );
                })}
              </div>
              <p className="whitespace-nowrap text-[12px] text-[rgba(240,240,255,0.28)]">
                <span className="text-[rgba(240,240,255,0.5)]">{filtered.length}</span> record
                {filtered.length !== 1 ? 's' : ''}
              </p>
            </div>

            {error && (
              <p className="mb-6 text-center text-red-400" role="alert">
                {error}
              </p>
            )}

            {loading ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[14px]">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-[220px] animate-pulse rounded-[14px] border border-white/[0.06] bg-[#0e1420]/80"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[14px]">
                {filtered.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-[13px] text-[rgba(240,240,255,0.28)]">
                    {records.length === 0
                      ? 'No public records yet.'
                      : 'No records found for this category.'}
                  </div>
                ) : (
                  filtered.map((record, i) => (
                    <ProofCard
                      key={`${record.cid}-${record.title}-${i}`}
                      record={record}
                      style={{ animationDelay: `${i * 0.04}s` }}
                      onOpen={() => setDetail(record)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      <VaultRecordDetailModal record={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
