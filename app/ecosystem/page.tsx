/**
 * Ecosystem: alliance members (hero + globe / list).
 */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import AllianceOrbit from "../components/AllianceOrbit";

/** Star positions [x%, y%] as constants to avoid per-frame allocation */
const STAR_POSITIONS: [number, number][] = [
  [10, 12],
  [22, 8],
  [35, 18],
  [48, 5],
  [62, 22],
  [78, 10],
  [88, 20],
  [15, 35],
  [28, 42],
  [55, 38],
  [72, 45],
  [85, 32],
  [8, 58],
  [42, 62],
  [65, 55],
  [92, 68],
  [18, 78],
  [38, 85],
  [58, 82],
  [80, 75],
];

const RADIAL_GLOW_STYLE = {
  background:
    "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(10, 77, 211, 0.12) 0%, transparent 55%), radial-gradient(ellipse 90% 90% at 50% 50%, rgba(124, 201, 255, 0.06) 0%, transparent 45%)",
} as const;

export default function EcosystemPage() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    orbit: false,
  });
  const heroRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const refs: { key: "hero" | "orbit"; el: HTMLElement | null }[] = [
      { key: "hero", el: heroRef.current },
      { key: "orbit", el: orbitRef.current },
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

  return (
    <div className="min-h-screen bg-[#09050C] text-white overflow-x-hidden">
      <Header />

      {/* Hero: globe overlaps from section below */}
      <section
        ref={heroRef}
        className="relative min-h-[58vh] flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
          {/* Radial vignette for title contrast */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 45%, transparent 30%, rgba(9,5,12,0.4) 100%)",
            }}
          />
        </div>

        <div
          className={`relative z-10 text-center px-4 max-w-3xl transition-all duration-[1500ms] ${
            isVisible.hero
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-[#7CC9FF]/80 text-xs md:text-sm font-medium tracking-[0.2em] uppercase mb-3 md:mb-4">
            Alliance
          </p>
          <h1 className="font-poppins font-medium text-[38px] md:text-[48px] lg:text-[56px] leading-tight tracking-[0.15px] text-transparent bg-clip-text bg-gradient-to-r from-[#fff] via-[#7CC9FF] to-[#fff] animate-gradient drop-shadow-2xl">
            Ecosystem
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-5 leading-relaxed font-light max-w-xl mx-auto">
            Where alliance members orbit a shared vision for data.
          </p>
          {/* Accent line */}
          <div
            className="mx-auto mt-6 w-12 h-px rounded-full opacity-60"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(124,201,255,0.6), transparent)",
            }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#09050C] to-transparent pointer-events-none" />
      </section>

      {/* Main block: globe + members; bottom padding before footer */}
      <section
        ref={orbitRef}
        className={`relative -mt-[160px] md:-mt-[200px] pb-16 md:pb-24 transition-all duration-1000 ${
          isVisible.orbit
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        {/* Star field (some twinkle) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {STAR_POSITIONS.map(([x, y], i) => (
            <span
              key={i}
              className={`absolute w-1 h-1 rounded-full bg-white ${
                i % 3 === 0 ? "star-twinkle" : ""
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                opacity: i % 2 === 0 ? 0.5 : 0.3,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={RADIAL_GLOW_STYLE}
        />
        {/* Ground arc under globe */}
        <div
          className="absolute left-1/2 bottom-8 md:bottom-12 w-[80%] max-w-[420px] h-0 -translate-x-1/2 pointer-events-none border-b border-[rgba(124,201,255,0.2)] rounded-b-[50%]"
          style={{ paddingBottom: "12%" }}
        />
        <div className="relative">
          <AllianceOrbit />
        </div>
      </section>
    </div>
  );
}
