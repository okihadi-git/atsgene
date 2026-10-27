import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "ATS CV Builder", description: "Privacy-first ATS-friendly CV builder with live PDF preview." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="id"><body>{children}</body></html>);
}
