'use client';

import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getAllianceMembers, type AllianceMemberItem } from '../../lib/request';

const W = 560;
const H = 560;
const cx = W / 2;
const cy = H / 2;
const R = 175;

/** Allow only http(s) URLs to avoid javascript: and similar injection. */
function safeExternalHref(raw: string): string | undefined {
  const t = raw?.trim();
  if (!t) return undefined;
  try {
    const u = new URL(t.startsWith('http') ? t : `https://${t}`);
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
  } catch {
    /* ignore */
  }
  return undefined;
}

function abbrFromMember(m: AllianceMemberItem, index: number): string {
  const name = (m.project_name || m.username || '').trim();
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0] ?? '';
    const b = parts[1][0] ?? '';
    return (a + b).toUpperCase() || `M${index + 1}`;
  }
  if (name.length >= 2) return name.slice(0, 2).toUpperCase();
  if (name.length === 1) return (name[0] + name[0]).toUpperCase();
  return `M${index + 1}`;
}

function MemberListThumb({ logo, abbr }: { logo: string; abbr: string }) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(logo?.trim()) && !failed;
  return (
    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[rgba(124,201,255,0.2)] bg-[linear-gradient(145deg,rgba(124,201,255,0.1),rgba(10,77,211,0.06))] shadow-[0_0_20px_rgba(124,201,255,0.06)]">
      {showImg ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={logo}
          alt=""
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-poppins text-[10px] font-bold uppercase tracking-wider text-[#7CC9FF]">
          {abbr}
        </span>
      )}
    </div>
  );
}

function ListChevron({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

type GlobeNode = AllianceMemberItem & {
  id: number;
  abbr: string;
  phi: number;
  theta: number;
  sx: number;
  sy: number;
  vis: number;
};

export default function AllianceOrbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [members, setMembers] = useState<AllianceMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [detailMember, setDetailMember] = useState<AllianceMemberItem | null>(null);
  const [detailLogoFailed, setDetailLogoFailed] = useState(false);
  const [modalHost, setModalHost] = useState<HTMLElement | null>(null);
  const rotYRef = useRef(0);
  const hoveredIdRef = useRef<number | null>(null);
  const nodesRef = useRef<GlobeNode[]>([]);

  hoveredIdRef.current = hoveredId;

  useLayoutEffect(() => {
    setModalHost(document.getElementById('emv-modal-root') ?? document.body);
  }, []);

  useEffect(() => {
    if (!detailMember) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDetailMember(null);
    };
    document.addEventListener('keydown', onKey);
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [detailMember]);

  useEffect(() => {
    getAllianceMembers({ page_size: 50 })
      .then((res) => {
        if (res.success && Array.isArray(res.data)) setMembers(res.data);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Request failed');
        setMembers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const nodes = useMemo(() => {
    const n = members.length;
    if (n === 0) return [];
    return members.map((m, i) => {
      const phi = Math.acos(-1 + (2 * i + 1) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return {
        ...m,
        id: i + 1,
        abbr: abbrFromMember(m, i),
        phi,
        theta,
        sx: 0,
        sy: 0,
        vis: 0,
      };
    });
  }, [members]);

  nodesRef.current = nodes;

  const project = useCallback((phi: number, theta: number, rotX: number, rotY: number) => {
    const x = Math.sin(phi) * Math.cos(theta + rotY);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta + rotY);
    const y2 = y * Math.cos(rotX) - z * Math.sin(rotX);
    const z2 = y * Math.sin(rotX) + z * Math.cos(rotX);
    return { x, y: y2, z: z2 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rotX = 0.28;
    let raf = 0;

    const draw = () => {
      const list = nodesRef.current;
      const rotY = rotYRef.current;
      ctx.clearRect(0, 0, W, H);

      for (let lat = -60; lat <= 60; lat += 30) {
        const phi = ((90 - lat) * Math.PI) / 180;
        const p = project(phi, 0, rotX, rotY);
        const r2 = Math.abs(Math.sin(phi)) * R;
        const yy = cy + p.y * R;
        ctx.beginPath();
        ctx.ellipse(cx, yy, r2, r2 * Math.abs(Math.cos(rotX)) * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(124,201,255,0.06)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (let i = 0; i < 6; i++) {
        const startTheta = (i / 6) * Math.PI * 2 + rotY;
        ctx.beginPath();
        let first = true;
        for (let t = 0; t <= Math.PI; t += 0.05) {
          const x = Math.sin(t) * Math.cos(startTheta);
          const y2 =
            Math.cos(t) * Math.cos(rotX) - Math.sin(t) * Math.sin(startTheta) * Math.sin(rotX);
          const z2 =
            Math.cos(t) * Math.sin(rotX) + Math.sin(t) * Math.sin(startTheta) * Math.cos(rotX);
          if (z2 > 0) {
            const px = cx + x * R;
            const py = cy + y2 * R;
            if (first) {
              ctx.moveTo(px, py);
              first = false;
            } else ctx.lineTo(px, py);
          } else first = true;
        }
        ctx.strokeStyle = 'rgba(124,201,255,0.04)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(124,201,255,0.12)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      const hi = hoveredIdRef.current;
      const sorted = list
        .map((n) => {
          const p = project(n.phi, n.theta, rotX, rotY);
          n.sx = cx + p.x * R;
          n.sy = cy + p.y * R;
          n.vis = p.z;
          return n;
        })
        .sort((a, b) => a.vis - b.vis);

      for (const n of sorted) {
        const depthAlpha = 0.18 + 0.82 * ((n.vis + 1) / 2);
        const isHov = hi === n.id;
        const nodeSize = 32 + n.vis * 8; // Increased from 20 + n.vis * 5
        ctx.save();
        ctx.globalAlpha = depthAlpha;

        if (isHov) {
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, nodeSize + 16, 0, Math.PI * 2); // Increased from 12
          ctx.strokeStyle = 'rgba(124,201,255,0.22)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, nodeSize + 9, 0, Math.PI * 2); // Increased from 7
          ctx.strokeStyle = 'rgba(124,201,255,0.4)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        const hs = nodeSize / 2;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(n.sx - hs, n.sy - hs, nodeSize, nodeSize, 6); // Increased radius from 5
        } else {
          ctx.rect(n.sx - hs, n.sy - hs, nodeSize, nodeSize);
        }
        ctx.fillStyle = isHov ? 'rgba(124,201,255,0.28)' : 'rgba(124,201,255,0.1)';
        ctx.strokeStyle = isHov ? 'rgba(124,201,255,0.65)' : 'rgba(124,201,255,0.22)';
        ctx.lineWidth = 0.5;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = `rgba(200,230,255,${0.55 + 0.45 * depthAlpha})`;
        ctx.font = "700 11px 'Poppins', system-ui, sans-serif"; // Increased from 9px
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.abbr, n.sx, n.sy);
        ctx.restore();
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(10,77,211,0.18)';
      ctx.strokeStyle = 'rgba(124,201,255,0.45)';
      ctx.lineWidth = 0.5;
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(124,201,255,0.22)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();

      rotYRef.current += 0.0038;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [project, members.length]);

  const onCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    let found: number | null = null;
    for (const n of nodesRef.current) {
      const dx = n.sx - mx;
      const dy = n.sy - my;
      if (Math.sqrt(dx * dx + dy * dy) < 32) { // Increased hit area from 26 to match larger nodes
        found = n.id;
        break;
      }
    }
    setHoveredId(found);
  };

  const onCanvasLeave = () => setHoveredId(null);

  const onCanvasClick = () => {
    const id = hoveredIdRef.current;
    if (id == null) return;
    const m = members[id - 1];
    if (m) {
      setDetailLogoFailed(false);
      setDetailMember(m);
    }
  };

  const websiteHref = detailMember ? safeExternalHref(detailMember.website) : undefined;
  const twitterHref = detailMember ? safeExternalHref(detailMember.twitter) : undefined;

  return (
    <>
      <section className="relative pt-4 pb-12 md:pt-8 md:pb-20 w-full max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Unified Glass Window */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0a0810]/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]">
          
          {/* Inner ambient glow bridging the two sides */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 30% 50%, rgba(10,77,211,0.15) 0%, rgba(124,201,255,0.05) 45%, transparent 80%)',
            }}
            aria-hidden
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-stretch lg:h-[min(600px,70vh)]">
            {/* Left: Globe area */}
            <div className="relative flex flex-1 items-center justify-center p-6 lg:p-10">
              {/* Soft halo specifically for the globe */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: 'min(100vw, 600px)',
                  height: 'min(100vw, 600px)',
                  background: 'radial-gradient(circle at 50% 50%, rgba(124,201,255,0.08) 0%, transparent 60%)',
                }}
                aria-hidden
              />
              <div className="relative z-[1] mx-auto aspect-square w-full max-w-[min(100%,560px)] shrink-0 lg:max-h-full">
                <div
                  className="pointer-events-none absolute -inset-1 rounded-full border border-[rgba(124,201,255,0.15)] opacity-80 md:-inset-0.5"
                  aria-hidden
                />
                <canvas
                  ref={canvasRef}
                  width={W}
                  height={H}
                  className="relative z-0 block h-full w-full cursor-default"
                  onMouseMove={onCanvasMove}
                  onMouseLeave={onCanvasLeave}
                  onClick={onCanvasClick}
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(124,201,255,0.05) 0%, transparent 60%)',
                  }}
                />
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 z-[1] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#09050C]/80 backdrop-blur-md shadow-[0_0_30px_rgba(124,201,255,0.15)] orbit-center-glow"
                >
                  <Image
                    src="/images/logo.png"
                    alt=""
                    width={48}
                    height={48}
                    className="h-10 w-10 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Right: Directory panel (Native column in the window) */}
            <div className="flex flex-col w-full lg:w-[380px] xl:w-[420px] border-t lg:border-t-0 lg:border-l border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent">
              <div className="shrink-0 border-b border-white/[0.05] px-6 py-5 md:px-8 md:py-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-poppins text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7CC9FF]">
                      Member directory
                    </h2>
                    <p className="mt-1.5 text-[13px] leading-snug text-gray-400">
                      Select a project to view profile and links. Hover syncs with the globe.
                    </p>
                  </div>
                  {!loading && !error && members.length > 0 && (
                    <span
                      className="shrink-0 rounded-lg border border-[rgba(124,201,255,0.2)] bg-[rgba(124,201,255,0.05)] px-2.5 py-1 text-center font-poppins text-xs font-medium tabular-nums text-[#7CC9FF]"
                      title="Active members"
                    >
                      {members.length}
                    </span>
                  )}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar px-3 py-4 md:px-5 md:py-5">
                  {loading ? (
                    <div className="space-y-2 px-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex animate-pulse gap-3 rounded-xl px-2 py-2.5"
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          <div className="h-11 w-11 shrink-0 rounded-xl bg-white/[0.06]" />
                          <div className="flex flex-1 flex-col justify-center gap-2 pt-0.5">
                            <div
                              className="h-2.5 rounded-md bg-white/[0.07]"
                              style={{ width: `${58 + (i % 3) * 12}%` }}
                            />
                            <div className="h-2 w-[40%] rounded-md bg-white/[0.04]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <p className="px-3 py-8 text-center text-sm text-gray-500">{error}</p>
                  ) : members.length === 0 ? (
                    <p className="px-3 py-10 text-center text-sm text-gray-500">
                      No alliance members yet.
                    </p>
                  ) : (
                    <ul className="flex list-none flex-col gap-1" role="list">
                      {members.map((m, i) => {
                        const id = i + 1;
                        const abbr = abbrFromMember(m, i);
                        const hi = hoveredId === id;
                        return (
                          <li key={`${m.username}-${i}`}>
                            <button
                              type="button"
                              onMouseEnter={() => setHoveredId(id)}
                              onMouseLeave={() => setHoveredId(null)}
                              onClick={() => {
                                setDetailLogoFailed(false);
                                setDetailMember(m);
                              }}
                              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-[background,box-shadow,transform] duration-200 md:px-3.5 md:py-3 ${
                                hi
                                  ? 'bg-[rgba(124,201,255,0.1)] shadow-[inset_3px_0_0_0_#7CC9FF,0_0_24px_rgba(124,201,255,0.08)]'
                                  : 'hover:bg-white/[0.04] hover:shadow-[inset_3px_0_0_0_rgba(124,201,255,0.25)]'
                              } `}
                            >
                              <MemberListThumb logo={m.logo} abbr={abbr} />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-poppins text-[14px] font-medium leading-tight text-white">
                                  {m.project_name || m.username}
                                </span>
                                <span className="mt-1 block truncate text-[11px] text-gray-500">
                                  @{m.username}
                                </span>
                              </span>
                              <ListChevron
                                className={`shrink-0 text-[#7CC9FF] transition-all duration-200 ${
                                  hi
                                    ? 'translate-x-0 opacity-100'
                                    : 'translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-70'
                                }`}
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Member modal: portal to #emv-modal-root; fixed to viewport; transform-only enter animation */}
      {modalHost &&
        detailMember &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6"
            style={{ top: 0, left: 0, right: 0, bottom: 0, width: '100%', minHeight: '100dvh' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="alliance-member-detail-title"
          >
            <div
              role="presentation"
              className="absolute inset-0 backdrop-blur-md"
              style={{
                background:
                  'radial-gradient(ellipse 85% 75% at 50% 40%, rgba(10,77,211,0.22) 0%, transparent 52%), rgba(2,0,8,0.88)',
              }}
              onClick={() => setDetailMember(null)}
            />
            <div
              className="relative z-10 w-full max-w-[440px] max-h-[min(90dvh,640px)] flex flex-col overflow-hidden rounded-2xl border border-[rgba(124,201,255,0.4)] bg-[#16131f] shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_25px_90px_rgba(0,0,0,0.75),0_0_80px_rgba(124,201,255,0.15)] animate-modal-in will-change-transform"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="h-1 shrink-0 bg-gradient-to-r from-[#0A4DD3] via-[#7CC9FF] to-[#06BAD9]"
                aria-hidden
              />
              <div className="relative max-h-[min(90vh,640px)] overflow-y-auto custom-scrollbar px-6 pt-8 pb-6 md:px-8 md:pb-8">
                <button
                  type="button"
                  onClick={() => setDetailMember(null)}
                  className="absolute top-4 right-4 md:top-5 md:right-5 z-[2] flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#1c1a26] text-gray-300 transition-colors hover:border-[rgba(124,201,255,0.5)] hover:bg-[rgba(124,201,255,0.12)] hover:text-white"
                  aria-label="Close"
                >
                  <span className="text-xl leading-none font-light">×</span>
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="mb-5 flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[rgba(124,201,255,0.35)] to-[rgba(10,77,211,0.25)] p-[3px] shadow-[0_0_40px_rgba(124,201,255,0.2)]">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[13px] bg-[#0d0b12] text-lg font-bold text-[#7CC9FF] font-poppins">
                      {detailLogoFailed || !detailMember.logo ? (
                        abbrFromMember(detailMember, 0)
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={detailMember.logo}
                          alt=""
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={() => setDetailLogoFailed(true)}
                        />
                      )}
                    </div>
                  </div>

                  <h2
                    id="alliance-member-detail-title"
                    className="font-poppins text-xl font-semibold tracking-tight text-white md:text-2xl"
                  >
                    {detailMember.project_name || detailMember.username}
                  </h2>
                  <p className="mt-1.5 inline-flex items-center rounded-full border border-[rgba(124,201,255,0.2)] bg-[rgba(124,201,255,0.08)] px-3 py-1 text-[11px] font-medium tracking-wide text-[#9fd4ff]">
                    @{detailMember.username}
                  </p>
                </div>

                <div className="mt-8">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7CC9FF]">
                    About
                  </p>
                  <div className="rounded-xl border border-[rgba(124,201,255,0.12)] bg-[rgba(255,255,255,0.04)] px-4 py-3.5">
                    <p className="text-[13px] leading-[1.7] text-gray-200">
                      {detailMember.intro?.trim() ? detailMember.intro : 'No description provided.'}
                    </p>
                  </div>
                </div>

                {(websiteHref || twitterHref) && (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-6">
                    {websiteHref && (
                      <a
                        href={websiteHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[40px] min-w-[120px] flex-1 items-center justify-center gap-2 rounded-xl border border-[rgba(124,201,255,0.4)] bg-gradient-to-r from-[#0A4DD3]/90 to-[#06BAD9]/80 px-4 py-2.5 text-sm font-medium text-white transition-all hover:border-[#7CC9FF] hover:shadow-[0_0_28px_rgba(124,201,255,0.35)] sm:flex-initial"
                      >
                        Website
                        <span className="text-xs opacity-90">↗</span>
                      </a>
                    )}
                    {twitterHref && (
                      <a
                        href={twitterHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[40px] min-w-[120px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#1c1a26] px-4 py-2.5 text-sm font-medium text-gray-200 transition-all hover:border-[rgba(124,201,255,0.35)] hover:bg-[rgba(124,201,255,0.08)] hover:text-[#7CC9FF] sm:flex-initial"
                      >
                        Twitter
                        <span className="text-xs opacity-90">↗</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>,
          modalHost,
        )}
    </>
  );
}
