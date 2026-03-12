import Link from "next/link";

const navLinks = [
  { href: "/", label: "Rechner" },
  { href: "/mieterhoeung-berechnen", label: "Mieterhöhung berechnen" },
  { href: "/mietpreisbremse", label: "Mietpreisbremse" },
  { href: "/wissen", label: "MieWeG erklärt" },
  { href: "/faq", label: "Häufige Fragen" },
];

export function SiteFooter() {
  return (
    <footer className="mt-10 space-y-4 border-t border-zinc-200 pt-6 sm:mt-12">
      <nav
        className="flex flex-wrap gap-x-4 gap-y-1"
        aria-label="Seitennavigation"
      >
        {navLinks.map((link, i) => (
          <span key={link.href} className="flex items-center gap-4">
            {i > 0 && <span className="text-zinc-300" aria-hidden="true">·</span>}
            <Link
              href={link.href}
              className="text-sm text-red-600 hover:text-red-700 hover:underline"
            >
              {link.label}
            </Link>
          </span>
        ))}
      </nav>

      <p className="text-xs leading-relaxed text-zinc-400">
        Diese Seite dient der allgemeinen Information und ersetzt keine
        Rechtsberatung. Im Einzelfall empfiehlt sich die Beratung durch die
        Mietervereinigung Österreich oder einen Fachanwalt für Mietrecht.
        Basis: MieWeG (BGBl.&nbsp;I 2025), 5.&nbsp;MILG, in Kraft ab
        1.1.2026.
      </p>
    </footer>
  );
}
