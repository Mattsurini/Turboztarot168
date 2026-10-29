import type { Metadata } from "next";
import { Inter, Noto_Serif_Thai } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Cinzel has no Thai glyphs, so every gold heading silently fell back to a
// generic serif. Use a Thai-capable serif so headings render the intended face.
const display = Noto_Serif_Thai({
  variable: "--font-serif-thai",
  weight: ["400", "600", "700"],
  subsets: ["thai", "latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "th_TH",
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${inter.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
