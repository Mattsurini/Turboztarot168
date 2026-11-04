"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const main = <main className="flex flex-1 flex-col">{children}</main>;

  if (pathname.startsWith("/admin")) return main;

  return (
    <>
      <Navbar />
      {main}
      <Footer />
    </>
  );
}
