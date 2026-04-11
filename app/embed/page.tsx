import type { Metadata } from "next";
import RentCalculator from "@/components/RentCalculator";

export const metadata: Metadata = {
  title: "Mietrechner – Orientierung MieWeG",
  description:
    "Orientierungsrechner zu Mieterhöhungen nach MieWeG (MRG). Keine Rechtsberatung.",
  robots: { index: false, follow: false },
};

export default function EmbedPage() {
  return (
    <div className="embed-shell-inner py-4 sm:py-6">
      <RentCalculator variant="embedLexis" />
    </div>
  );
}
