import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "ATS CV Builder",
  description: "Privacy-first ATS-friendly CV builder with live PDF preview.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}

        {/* Script pendukung overlay Trakteer */}
        <Script
          src="https://edge-cdn.trakteer.id/js/trbtn-overlay.min.js?v=14-05-2025"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
