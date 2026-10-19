import type { Metadata } from "next";
import { League_Spartan, Playfair_Display } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Riva Beauty Platform",
  description: "Find your perfect beauty master",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${leagueSpartan.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base text-main font-sans">{children}</body>
    </html>
  );
}
