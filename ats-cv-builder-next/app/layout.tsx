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
        <Script
          id="trakteer-overlay-js"
          src="https://edge-cdn.trakteer.id/js/trbtn-overlay.min.js?v=14-05-2025"
          strategy="lazyOnload"
        />
        <Script id="trakteer-overlay-init" strategy="lazyOnload">
          {`
            window.addEventListener('load', function() {
              if (window.trbtnOverlay) {
                var trbtnId = trbtnOverlay.init('Traktir untuk beli Laptop','#00BCD4','https://trakteer.id/v1/okihadi/tip/embed/modal','https://trakteer.id/images/mix/coffee.png','40','inline');
                trbtnOverlay.draw(trbtnId);
              }
            });
          `}
        </Script>
      </body>
    </html>
  );
}
