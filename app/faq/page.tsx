/**
 * FAQ — accordion groups aligned with marketing reference, styled for site chrome.
 */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { FAQ_GROUPS } from './faq-data';

export default function FaqPage() {
  const [isVisible, setIsVisible] = useState({ hero: false, body: false });
  const heroRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const refs: { key: 'hero' | 'body'; el: HTMLElement | null }[] = [
      { key: 'hero', el: heroRef.current },
      { key: 'body', el: bodyRef.current },
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const key = refs.find((r) => r.el === entry.target)?.key;
          if (key) setIsVisible((prev) => ({ ...prev, [key]: true }));
        });
      },
      { threshold: 0.08 },
    );
    refs.forEach(({ el }) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#09050C] text-white">
      {/* Ambient glow — same language as reference, tuned to brand blues */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#0A4DD3]/10 blur-3xl" />
        <div className="absolute top-32 left-10 h-56 w-56 rounded-full bg-[#7CC9FF]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#06BAD9]/10 blur-3xl" />
      </div>

      <div className="relative z-[1]">
        <Header />

        <section
          ref={heroRef}
          className="relative flex min-h-[46vh] flex-col items-center justify-center overflow-hidden pb-6 pt-24 md:min-h-[50vh] md:pb-10 md:pt-28"
        >
          <div className="absolute inset-0">
            <Image src="/images/hero-bg.png" alt="" fill className="object-cover" priority />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 45%, transparent 28%, rgba(9,5,12,0.55) 100%)',
              }}
            />
          </div>

          <div
            className={`relative z-10 mx-auto max-w-4xl px-4 text-center transition-all duration-[1500ms] ${
              isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <p className="mb-3 inline-flex rounded-full border border-[#7CC9FF]/25 bg-[#7CC9FF]/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.22em] text-[#7CC9FF]/90 md:mb-4">
              FAQ
            </p>
            <h1 className="animate-gradient bg-gradient-to-r from-[#fff] via-[#7CC9FF] to-[#fff] bg-clip-text font-poppins text-[36px] font-medium leading-tight tracking-[0.15px] text-transparent drop-shadow-2xl md:text-[48px] lg:text-[56px]">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto mt-5 max-w-3xl font-light leading-relaxed text-gray-400 text-sm md:mt-6 md:text-base">
              Understand how EverMedia Vault works, what the alliance offers, and how verifiable data
              becomes long-term value.
            </p>
            <div
              className="mx-auto mt-6 h-px w-12 rounded-full opacity-60"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(124,201,255,0.6), transparent)',
              }}
            />
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#09050C] to-transparent" />
        </section>

        <section
          ref={bodyRef}
          className={`relative px-4 pb-16 transition-all duration-1000 md:px-8 md:pb-24 ${
            isVisible.body ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
            {FAQ_GROUPS.map((group) => (
              <div
                key={group.title}
                className="glass-card rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              >
                <div className="mb-6 border-b border-white/10 pb-5">
                  <h2 className="font-poppins text-xl font-semibold text-white md:text-2xl">
                    {group.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{group.description}</p>
                </div>

                <div className="space-y-4">
                  {group.items.map((item, idx) => (
                    <details
                      key={item.q}
                      className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 open:border-[#7CC9FF]/30 open:bg-[#7CC9FF]/[0.04]"
                      open={idx === 0}
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
                        <span className="text-base font-medium leading-7 text-white/90">{item.q}</span>
                        <span className="mt-1 shrink-0 text-[#7CC9FF] transition-transform duration-200 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-4 pr-2 text-sm leading-7 text-gray-400 md:pr-6">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-5xl px-0 md:mt-20">
            <div className="rounded-[32px] border border-[#7CC9FF]/20 bg-gradient-to-br from-[#0A4DD3]/15 via-[#06BAD9]/10 to-[#7CC9FF]/10 p-8 text-center shadow-[0_20px_80px_rgba(10,77,211,0.12)] backdrop-blur-md md:p-12">
              <h3 className="font-poppins text-2xl font-semibold md:text-3xl lg:text-4xl">
                Still have questions?
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-400">
                If you are exploring collaboration, data onboarding, or alliance participation, contact
                the EverMedia Vault team to learn more.
              </p>
              <Link
                href="#footer-contact"
                className="btn-ripple mt-8 inline-flex rounded-full bg-gradient-to-r from-[#0A4DD3] to-[#06BAD9] px-8 py-3 text-sm font-medium text-white shadow-[0_0_30px_rgba(6,186,217,0.25)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(124,201,255,0.35)]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
