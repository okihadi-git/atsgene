'use client';

import dynamic from 'next/dynamic';

// Muat PDFViewer hanya di browser (SSR = false)
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p className="p-4 text-gray-500">Memuat pratinjau PDF...</p>,
  }
);

// Import dokumen PDF kamu
import ResumeDocument from './pdf/ResumeDocument';

export default function Preview({ data }: { data: any }) {
  return (
    <div className="w-full h-[600px] bg-slate-500 p-4 rounded-lg">
      <PDFViewer className="w-full h-full border-0 rounded">
        <ResumeDocument data={data} />
      </PDFViewer>
    </div>
  );
}
