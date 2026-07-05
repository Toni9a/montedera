import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dera's Montenegro Girls Trip",
  description: "A luxury girls trip itinerary — Kotor Bay, Montenegro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col text-[var(--ink)]">
        <div className="page-gradient relative flex flex-1 flex-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/flowers-top.webp"
            alt=""
            aria-hidden="true"
            className="page-flowers-top pointer-events-none absolute top-0 left-0 z-0 h-40 w-full select-none object-cover object-top opacity-90 sm:h-52 md:h-64"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/flowers-bottom.webp"
            alt=""
            aria-hidden="true"
            className="page-flowers-bottom pointer-events-none absolute bottom-0 left-0 z-0 h-48 w-full select-none object-cover object-bottom opacity-90 sm:h-60 md:h-72"
          />
          <div className="relative z-10 flex flex-1 flex-col">{children}</div>
        </div>
      </body>
    </html>
  );
}
