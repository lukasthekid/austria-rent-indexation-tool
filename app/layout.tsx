import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MietCheck-AT – Mietzins-Prüfung nach MieWeG",
  description:
    "Prüfen Sie Ihre Mietzinserhöhung: maximal zulässige Miete nach dem Mieten-Wertsicherungsgesetz (MieWeG) für österreichische Wohnungsmietverträge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
