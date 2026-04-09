/**
 * Home page.
 */
'use client';

import Header from './components/Header';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    mission: false,
    about: false,
    vision: false,
    join: false,
    partners: false,
  });

  const sectionRefs = {
    hero: useRef(null),
    mission: useRef(null),
    about: useRef(null),
    vision: useRef(null),
    join: useRef(null),
    partners: useRef(null),
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    Object.entries(sectionRefs).forEach(([key, ref]) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible((prev) => ({ ...prev, [key]: true }));
            }
          });
        },
        { threshold: 0.1 },
      );

      if (ref.current) {
        observer.observe(ref.current);
      }
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#09050C] text-white overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section
        ref={sectionRefs.hero}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.png"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          {/* <div className="absolute inset-0 bg-black bg-opacity-80" /> */}
          <div className="absolute inset-0" />
        </div>

        {/* Hero copy */}
        <div
          className={`relative z-10 text-center px-4 max-w-6xl transition-all duration-1500 ${
            isVisible.hero
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="font-poppins font-medium text-[40px] md:text-[48px] lg:text-[56px] leading-[45px] md:leading-[55px] lg:leading-[65px] tracking-[0.15px] text-center text-transparent bg-clip-text bg-gradient-to-r from-[#fff] via-[#7CC9FF] to-[#fff] animate-gradient mb-6 drop-shadow-2xl">
            Turn Real Web3 Data into
            <br />
            <span className="">Trusted Knowledge</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg mb-8 max-w-2xl mx-auto mt-[8px] md:mt-[16px] leading-relaxed font-light ">
            EverMedia Vault helps projects anchor authentic data into verifiable
            records, building a shared knowledge layer for communities, users, and
            intelligent systems.
          </p>
          <button className="btn-ripple px-8 py-3 bg-gradient-to-r from-[#0A4DD3] to-[#06BAD9] hover:from-[#0A4DD3] hover:to-[#08D0F0] text-white font-medium rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/60 animate-pulse-glow">
            Join the Alliance
          </button>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09050C] to-transparent" />
      </section>

      {/* Our Mission Section */}
      <section
        ref={sectionRefs.mission}
        className={`relative pb-12 md:pb-20 px-4 transition-all duration-1000 ${
          isVisible.mission
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-10">
            Our Mission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Mobile: image on top */}
            <div className="col-span-12 md:col-span-5 flex justify-center order-1 md:order-2">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 animate-float">
                <Image
                  src="/images/Mission-part.png"
                  alt="Mission"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Copy */}
            <div className="col-span-12 md:col-span-7 space-y-2 md:space-y-2 text-white/70 font-poppins font-light text-sm sm:text-base md:text-lg leading-relaxed md:leading-loose tracking-normal md:tracking-wide order-2 md:order-1">
              <p>
                EverMedia Vault helps Web3 projects turn scattered content,
                research, archives, and records into verifiable, structured
                knowledge.
              </p>
              <p>
                Rather than leaving important data fragmented across platforms,
                the Vault anchors it into trusted records that can be preserved,
                understood, and discovered over time.
              </p>
              <p>
                Through a shared alliance of contributors, members do not simply
                store information — they build a verified presence within a
                growing Web3 knowledge network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section
        ref={sectionRefs.about}
        className={`relative pt-[117px] pb-20 px-4 transition-all duration-1000 ${
          isVisible.about
            ? 'opacity-100 translate-y-0'
            : 'opacity-100 translate-y-20'
        }`}
      >
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/aboutUs-bg.png"
            alt="About Us Background"
            fill
            className="object-cover "
          />
        </div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-16">About us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Verification',
                desc: 'Real records are anchored into verifiable storage, turning content into trusted digital proof.',
                image: '/images/aboutUs-part1.png',
                delay: '0s',
              },
              {
                title: 'Structure',
                desc: 'Data is not only preserved, but organized into meaningful records that can be indexed, connected, and understood.',
                image: '/images/aboutUs-part2.png',
                delay: '0.2s',
              },
              {
                title: 'Visibility',
                desc: 'Members gain lasting presence across the alliance, with future pathways toward intelligent discovery and structured exposure.',
                image: '/images/aboutUs-part3.png',
                delay: '0.4s',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-card pt-[50px] pb-[68px] px-16 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-xl"
                // style={{ animationDelay: item.delay }}
              >
                <div className="w-[136px] h-[136px] mb-9 mx-auto relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="mb-6 font-poppins font-medium text-[24px] md:text-[26px] leading-[26px] tracking-[0.14px] text-center">
                  {item.title}
                </h3>
                <p className="text-gray-400 font-poppins font-normal text-[14px] md:text-[16px] leading-[22px] md:leading-[25px] tracking-normal text-center">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section
        ref={sectionRefs.vision}
        className={`relative py-32 px-4 transition-all duration-1000 ${
          isVisible.vision
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="">
              <h2 className="text-3xl md:text-5xl font-bold mb-12">Vision</h2>
              <div className="space-y-12 text-white/70 font-poppins font-light text-[16px] md:text-[18px] leading-[28px] md:leading-[36px] tracking-normal md:tracking-[0.14px]">
                <p>
                  We envision a Web3 ecosystem where trustworthy data does not
                  remain fragmented, but becomes the foundation for discovery,
                  collaboration, and intelligence.
                </p>
                <p>
                  EverMedia Vault is building that foundation by turning verifiable
                  records into a shared layer of structured knowledge across the
                  alliance.
                </p>
                <p>
                  With indexing and search built into the system, data moves beyond
                  storage — becoming easier to discover, interpret, and use over
                  time.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-80 h-80 md:w-[500px] md:h-[427px] scale-150">
                <Image
                  src="/images/vision-part.png"
                  alt="Vision"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Alliance Section */}
      <section
        id="join-the-alliance"
        ref={sectionRefs.join}
        className={`relative pt-20 pb-96 px-4 transition-all duration-1000 ${
          isVisible.join
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/join-the-alliance-bg.png"
            alt="Join the Alliance Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">
            Join the Alliance
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-3xl mx-auto font-poppins font-normal text-[18px] md:text-[20px] leading-[26px] md:leading-[28px] tracking-normal">
            Joining EverMedia Vault means more than preserving data — it means
            contributing to a network where records become verifiable, searchable,
            and meaningfully connected.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                image: '/images/join-part1.png',
                title: 'Verifiable record anchoring',
              },
              {
                image: '/images/join-part2.png',
                title: 'Structured project presence',
              },
              {
                image: '/images/join-part3.png',
                title: 'Searchable discovery across the network',
              },
              {
                image: '/images/join-part4.png',
                title: 'Access to a growing Web3 knowledge ecosystem',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-card p-2 rounded-xl flex items-center gap-4 hover:scale-105 transition-all duration-300"
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-gray-300 font-poppins font-normal text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] tracking-normal md:tracking-[0.14px]">
                  {item.title}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="btn-ripple px-8 py-3 bg-gradient-to-r from-[#0A4DD3] to-[#06BAD9] hover:from-[#0A4DD3] hover:to-[#08D0F0] text-white font-medium rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/60 animate-pulse-glow">
              Explore More
            </button>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section
        ref={sectionRefs.partners}
        className={`relative -top-48  px-4 transition-all duration-1000 ${
          isVisible.partners
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">Partners</h2>

          {/* Tabs */}
          <div className="flex gap-8 mb-12 border-b border-gray-800">
            <button className="text-blue-400 border-b-2 border-blue-400 pb-3 font-medium">
              Strategic Partners
            </button>
            <button className="text-gray-400 hover:text-white pb-3 font-medium transition-colors">
              Tech Partners
            </button>
            <button className="text-gray-400 hover:text-white pb-3 font-medium transition-colors">
              Data Partners
            </button>
          </div>

          {/* Partner logos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              'Monday Protocol',
              'Sociogram',
              'Redstone',
              'GreenField',
              'Fil-Journal',
              'Icon',
              'L2',
              'C',
              'Github',
              'Bsens',
              'Airfare',
              'Bifrost',
            ].map((partner, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-xl flex items-center justify-center h-24 hover:scale-105 transition-all duration-300 hover:border-blue-500/50"
              >
                <span className="text-gray-400 text-sm font-medium">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
