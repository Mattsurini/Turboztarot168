import type { Metadata } from "next";
import { Cinzel, Montserrat, Prompt, Trirong } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { SITE } from "@/lib/site";

// Design faces (app/v2/design-tokens.css --font-*): Cinzel carries the Latin
// wordmark; Montserrat is the Latin body, Prompt the Thai body, Trirong the
// Thai display (Cinzel has no Thai glyphs).
const cinzel = Cinzel({
  variable: "--font-latin-display",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const prompt = Prompt({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

const trirong = Trirong({
  variable: "--font-thai-display",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${cinzel.variable} ${montserrat.variable} ${prompt.variable} ${trirong.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
