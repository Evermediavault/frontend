/**
 * Vault Records: GET /api/v1/media/list (word + optional storage_id); GET /api/v1/categories; GET /api/v1/media/storage-info for storage chips.
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
import { getCategoryList, getMediaList, getMediaStorageInfo, type CategoryListItem, type MediaListItem, type MediaStorageProviderItem } from '../../lib/request';
import { toUserFacingError } from '../../lib/userFacingError';

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
    categoryUid: item.category_uid,
    recordType,
    displayStatus: mapApiToDisplayStatus(apiStatus, recordType),
    status: apiStatus,
    title: item.name,
    contributor: item.uploader_username ?? 'Anonymous',
    createdAt: formatDisplayDate(item.uploaded_at, 'date'),
    cid: item.synapse_index_id,
  };
}

/** Stable pseudo-random accent from category uid (HSL, readable on dark UI). */
function categoryDotColor(uid: string): string {
  let h = 0;
  for (let i = 0; i < uid.length; i++) {
    h = (Math.imul(31, h) + uid.charCodeAt(i)) | 0;
  }
  const u = Math.abs(h);
  const hue = u % 360;
  const sat = 62 + (u % 18);
  const light = 58 + (u % 12);
  return `hsl(${hue} ${sat}% ${light}%)`;
}

/** Distinct dot color per numeric storage id (reuse category hash). */
function storageDotColor(id: number): string {
  return categoryDotColor(`storage:${id}`);
}

export default function VaultRecordsPage() {
  const [isVisible, setIsVisible] = useState({ hero: false, content: false });
  const [records, setRecords] = useState<ProofRecord[]>([]);
  const [categories, setCategories] = useState<CategoryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterUid, setFilterUid] = useState<'all' | string>('all');
  const [filterStorageId, setFilterStorageId] = useState<'all' | number>('all');
  const [storageProviders, setStorageProviders] = useState<MediaStorageProviderItem[]>([]);
  const [detail, setDetail] = useState<ProofRecord | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedWord, setDebouncedWord] = useState('');
  const [listTotal, setListTotal] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedWord(searchInput.trim()), 400);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const params: { page: number; page_size: number; word?: string; storage_id?: number } = {
      page: 1,
      page_size: 50,
    };
    if (debouncedWord.length > 0) params.word = debouncedWord;
    if (filterStorageId !== 'all') params.storage_id = filterStorageId;

    getMediaList(params)
      .then((res) => {
        if (cancelled || !res.data) return;
        setRecords(res.data.map((item) => mapMediaItemToProofRecord(item)));
        setListTotal(res.meta?.total ?? res.data.length);
      })
      .catch((e) => {
        if (!cancelled) setError(toUserFacingError(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedWord, filterStorageId]);

  useEffect(() => {
    let cancelled = false;
    getMediaStorageInfo()
      .then((res) => {
        if (cancelled) return;
        const list = [...(res.providers ?? [])].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
        );
        setStorageProviders(list);
      })
      .catch(() => {
        if (!cancelled) setStorageProviders([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getCategoryList({ page: 1, page_size: 100, sort_by: 'name', order: 'asc' })
      .then((res) => {
        if (cancelled || !res.data) return;
        setCategories(res.data);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
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
    if (filterUid === 'all') return records;
    return records.filter((r) => r.categoryUid === filterUid);
  }, [records, filterUid]);

  const totalRecords = listTotal ?? records.length;
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
              role="group"
              aria-label="Catalog statistics"
              className="mx-auto mt-6 flex justify-center md:mt-7"
            >
              <div className="inline-flex items-stretch rounded-full border border-white/[0.07] bg-[rgba(6,8,15,0.4)] px-1 py-1 backdrop-blur-sm">
                <div className="flex items-center gap-0 px-4 sm:px-6">
                  <div className="min-w-[5.5rem] py-1 text-center sm:min-w-[6.25rem]">
                    <p className="font-poppins text-[26px] font-bold leading-none text-[#8b7cf8] tabular-nums md:text-[28px]">
                      {loading ? '—' : totalRecords}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[rgba(240,240,255,0.28)]">
                      Total records
                    </p>
                  </div>
                  <div
                    className="mx-3 h-9 w-px shrink-0 bg-gradient-to-b from-transparent via-white/[0.12] to-transparent sm:mx-4"
                    aria-hidden
                  />
                  <div className="min-w-[5.5rem] py-1 text-center sm:min-w-[6.25rem]">
                    <p className="font-poppins text-[26px] font-bold leading-none text-[#8b7cf8] tabular-nums md:text-[28px]">
                      {loading ? '—' : featuredCount}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[rgba(240,240,255,0.28)]">
                      Featured
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="mx-auto mt-7 h-px w-12 rounded-full opacity-60 md:mt-8"
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
            <div className="border-b border-white/[0.07] pb-9 pt-10">
              <h2 className="font-poppins text-[28px] font-bold leading-tight tracking-tight text-white md:text-[34px]">
                Vault Records
              </h2>
              <label htmlFor="vault-records-search" className="sr-only">
                Search records by name, type, contributor, or CID keywords
              </label>
              <div className="relative mt-4 w-full md:mt-5">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(240,240,255,0.35)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.75}
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <input
                  id="vault-records-search"
                  type="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  maxLength={128}
                  placeholder="Search by title, type, contributor, CID…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0c101a]/90 py-2.5 pl-10 pr-3 text-[13px] text-white placeholder:text-[rgba(240,240,255,0.28)] shadow-inner outline-none ring-[#8b7cf8]/0 transition-[border-color,box-shadow] focus:border-[rgba(139,124,248,0.35)] focus:ring-2 focus:ring-[rgba(139,124,248,0.2)]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 py-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
                <span className="shrink-0 pt-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[rgba(240,240,255,0.32)]">
                  Category
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-3 sm:gap-y-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setFilterUid('all')}
                      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] tracking-wide transition-all ${
                        filterUid === 'all'
                          ? 'border-[rgba(139,124,248,0.22)] bg-[rgba(139,124,248,0.1)] text-[#a78bfa]'
                          : 'border-white/[0.07] bg-transparent text-[rgba(240,240,255,0.28)] hover:border-white/15 hover:text-[rgba(240,240,255,0.5)]'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                      All records
                    </button>
                    {categories.map((cat) => {
                      const active = filterUid === cat.uid;
                      return (
                        <button
                          key={cat.uid}
                          type="button"
                          onClick={() => setFilterUid(cat.uid)}
                          className={`flex max-w-[220px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] tracking-wide transition-all ${
                            active
                              ? 'border-[rgba(139,124,248,0.22)] bg-[rgba(139,124,248,0.1)] text-[#a78bfa]'
                              : 'border-white/[0.07] bg-transparent text-[rgba(240,240,255,0.28)] hover:border-white/15 hover:text-[rgba(240,240,255,0.5)]'
                          }`}
                        >
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: categoryDotColor(cat.uid) }}
                            aria-hidden
                          />
                          <span className="truncate">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="whitespace-nowrap text-[12px] text-[rgba(240,240,255,0.28)] sm:shrink-0">
                    <span className="text-[rgba(240,240,255,0.5)]">{filtered.length}</span> record
                    {filtered.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
                <span className="shrink-0 pt-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[rgba(240,240,255,0.32)]">
                  Storage
                </span>
                <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFilterStorageId('all')}
                    className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] tracking-wide transition-all ${
                      filterStorageId === 'all'
                        ? 'border-[rgba(139,124,248,0.22)] bg-[rgba(139,124,248,0.1)] text-[#a78bfa]'
                        : 'border-white/[0.07] bg-transparent text-[rgba(240,240,255,0.28)] hover:border-white/15 hover:text-[rgba(240,240,255,0.5)]'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                    All providers
                  </button>
                  {storageProviders.map((p) => {
                    const active = filterStorageId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        title={p.description || p.name}
                        onClick={() => setFilterStorageId(p.id)}
                        className={`flex max-w-[240px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-left text-[12px] tracking-wide transition-all ${
                          active
                            ? 'border-[rgba(139,124,248,0.22)] bg-[rgba(139,124,248,0.1)] text-[#a78bfa]'
                            : 'border-white/[0.07] bg-transparent text-[rgba(240,240,255,0.28)] hover:border-white/15 hover:text-[rgba(240,240,255,0.5)]'
                        } ${!p.isActive ? 'opacity-75' : ''}`}
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: storageDotColor(p.id) }}
                          aria-hidden
                        />
                        <span className="min-w-0 truncate">{p.name}</span>
                        {!p.isActive ? (
                          <span className="shrink-0 text-[10px] font-normal normal-case tracking-normal text-[rgba(240,240,255,0.22)]">
                            · off
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
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
                      ? debouncedWord.length > 0
                        ? 'No records match your search.'
                        : filterStorageId !== 'all'
                          ? 'No records for this storage provider.'
                          : 'No public records yet.'
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
