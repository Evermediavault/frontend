/**
 * Site header and navigation.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "FAQ", href: "/faq" },
    { name: "Ecosystem", href: "/ecosystem" },
    { name: "Vault Records", href: "/vault-records" },
    { name: "News", href: "#" },
  ];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 lg:bg-transparent">
        <div className="mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-24">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity relative z-50"
              >
                <Image
                  src="/images/logo.png"
                  alt="EVERMEDIA VAULT"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-white text-sm font-semibold tracking-wider hidden sm:block">
                  EVERMEDIA VAULT
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                {navItems.map((item) => {
                  const active =
                    item.href !== "#" &&
                    (item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href || pathname.startsWith(`${item.href}/`));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-sm font-medium transition-colors ${
                        active ? "text-white" : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Contact Us Button */}
            <button className="btn-ripple hidden lg:block px-6 py-2 bg-gradient-to-r from-[#0A4DD3] to-[#06BAD9] hover:opacity-90 text-white text-sm font-medium rounded-md transition-all hover:scale-105">
              contact us
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 relative z-50"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#0B0711] shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1 px-4 flex-1">
            {navItems.map((item) => {
              const active =
                item.href !== "#" &&
                (item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`hover:bg-white/5 text-base font-medium transition-all py-3 px-4 rounded-lg ${
                    active ? "text-white bg-white/5" : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="p-4 border-t border-gray-800">
            <button
              className="btn-ripple w-full px-6 py-3 bg-gradient-to-r from-[#0A4DD3] to-[#06BAD9] hover:opacity-90 text-white text-sm font-medium rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              contact us
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
