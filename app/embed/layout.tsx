import { Lato } from "next/font/google";
import "./embed.css";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-0 bg-white text-black ${lato.className}`}>
      {children}
    </div>
  );
}
