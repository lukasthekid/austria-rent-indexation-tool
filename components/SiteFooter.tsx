import Image from "next/image";
import Link from "next/link";

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

      {/* Unterer Bereich: Haftungsausschluss + rechtliche Hinweise */}
      <div className="border-t border-zinc-200 bg-zinc-50/80 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs leading-relaxed text-zinc-600">
            Diese Seite dient der allgemeinen Information und ersetzt keine
            Rechtsberatung. Im Einzelfall empfiehlt sich die Beratung durch die
            Mietervereinigung Österreich oder einen Fachanwalt für Mietrecht.
            Basis: MieWeG (BGBl.&nbsp;I 2025), 5.&nbsp;MILG, in Kraft ab
            1.1.2026.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-500">
            <span className="opacity-75">Impressum (in Arbeit)</span>
            <span className="opacity-75">Datenschutz (in Arbeit)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
