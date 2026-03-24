import Image from "next/image";
import Link from "next/link";
import {
  SITE_DISCLAIMER_ADVICE,
  SITE_DISCLAIMER_MAIN,
  SITE_DISCLAIMER_NO_WARRANTY,
  SITE_LINK_RIS,
  SITE_LINK_RIS_LABEL,
  SITE_LINK_VPI,
  SITE_LINK_VPI_LABEL,
  SITE_SOURCES_DATA,
  SITE_SOURCES_LEGAL,
} from "@/lib/site-trust-copy";

const navLinks = [
  { href: "/", label: "Start" },
  { href: "/mieterhoeung-berechnen", label: "Rechner" },
  { href: "/mietpreisbremse", label: "Mietpreisbremse" },
  { href: "/wissen", label: "MieWeG erklärt" },
  { href: "/faq", label: "Häufige Fragen" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-100">
      {/* Oberer Bereich: Logo + Nav-Links */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/MietCheck-logo.png"
              alt="MietCheck-AT"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-semibold text-zinc-800">MietCheck-AT</span>
          </Link>
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2"
            aria-label="Seitennavigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-600 hover:text-red-600 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Unterer Bereich: Trust, Quellen, Haftung (einheitlich mit Rechner/PDF) */}
      <div className="border-t border-zinc-200 bg-zinc-50/80 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-3 text-xs leading-relaxed text-zinc-600">
          <p>
            <span className="font-medium text-zinc-700">Hinweis: </span>
            {SITE_DISCLAIMER_MAIN} {SITE_DISCLAIMER_NO_WARRANTY}
          </p>
          <p>{SITE_DISCLAIMER_ADVICE}</p>
          <p>
            <span className="font-medium text-zinc-700">Quellen: </span>
            {SITE_SOURCES_LEGAL} {SITE_SOURCES_DATA}
          </p>
          <p className="text-zinc-500">
            <a
              href={SITE_LINK_RIS}
              className="text-red-700 underline underline-offset-2 hover:text-red-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              {SITE_LINK_RIS_LABEL}
            </a>
            <span aria-hidden className="mx-1.5 text-zinc-400">
              ·
            </span>
            <a
              href={SITE_LINK_VPI}
              className="text-red-700 underline underline-offset-2 hover:text-red-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              {SITE_LINK_VPI_LABEL}
            </a>
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-zinc-200/80 pt-3 text-zinc-500">
            <Link
              href="/impressum"
              className="opacity-90 transition-colors hover:text-red-600 hover:underline"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="opacity-90 transition-colors hover:text-red-600 hover:underline"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
