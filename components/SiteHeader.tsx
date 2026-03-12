"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/mieterhoeung-berechnen", label: "Rechner" },
  { href: "/mietpreisbremse", label: "Mietpreisbremse" },
  { href: "/wissen", label: "MieWeG erklärt" },
  { href: "/faq", label: "Häufige Fragen" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors md:text-base ${
        isActive
          ? "text-red-600"
          : "text-zinc-600 hover:text-red-600 hover:underline"
      }`}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Rot-Weiß-Rot Banner */}
      <div className="flex h-1.5 w-full shrink-0">
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/MietCheck-logo.png"
            alt="MietCheck-AT Logo"
            width={40}
            height={40}
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
          <span className="hidden font-semibold text-zinc-900 sm:inline">
            MietCheck-AT
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Hauptnavigation"
        >
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 md:hidden"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        id="mobile-nav"
        className={`border-t border-zinc-200 bg-white md:hidden ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <nav
          className="flex flex-col gap-1 px-4 py-4"
          aria-label="Mobile Navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-red-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
