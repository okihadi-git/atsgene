'use client';

import dynamic from 'next/dynamic';
import ResumeDocument from './pdf/ResumeDocument'; // File dokumen PDF kamu

// Dynamic import agar PDFViewer hanya dirender di client-side (mencegah error SSR)
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <div className="p-8 text-center text-gray-500">Memuat PDF Viewer...</div>,
  }
);

export default function Preview({ data }: { data: any }) {
  return (
    <div className="w-full h-[calc(100vh-100px)] sticky top-4">
      {/* Menggantikan <div id="paper"> dengan PDFViewer bawaan @react-pdf/renderer */}
      <PDFViewer className="w-full h-full rounded-lg border border-gray-200 shadow-md">
        <ResumeDocument data={data} />
      </PDFViewer>
    </div>
  );
}
