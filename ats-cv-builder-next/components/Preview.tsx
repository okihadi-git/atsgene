'use client';

import dynamic from 'next/dynamic';
import { ResumeDocument } from './pdf/ResumeDocument';
import type { Resume, Settings } from '@/lib/types';

// Dynamic import PDFViewer agar hanya berjalan di Client Side
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] w-full items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        Memuat PDF Viewer...
      </div>
    ),
  }
);

export default function Preview({ resume, settings }: { resume: Resume; settings: Settings }) {
  return (
    <div className="sticky top-4 h-[calc(100vh-100px)] w-full overflow-hidden rounded-lg border border-slate-200 shadow-md">
      <PDFViewer className="h-full w-full border-0">
        <ResumeDocument r={resume} s={settings} />
      </PDFViewer>
    </div>
  );
}
