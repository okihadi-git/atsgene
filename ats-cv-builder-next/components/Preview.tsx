"use client";
import React, { useEffect, useState } from "react";
import { usePDF } from "@react-pdf/renderer";
import { ResumeDocument } from "./pdf/ResumeDocument";
import { useStore, useT } from "@/lib/store";
import { toLatex } from "@/lib/latex";

function useDeb<T>(v: T, ms: number) { const [x, setX] = useState(v); useEffect(() => { const h = setTimeout(() => setX(v), ms); return () => clearTimeout(h); }, [v, ms]); return x; }

export default function Preview() {
  const t = useT();
  const resume = useStore((x) => x.resume), settings = useStore((x) => x.settings);
  const [copied, setCopied] = useState(false);
  const dr = useDeb(resume, 500), ds = useDeb(settings, 200);
  const [inst, update] = usePDF({ document: <ResumeDocument r={dr} s={ds} /> });
  useEffect(() => { update(<ResumeDocument r={dr} s={ds} />); /* eslint-disable-next-line */ }, [dr, ds]);
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <a className={"btn btn-pri " + (inst.url ? "" : "pointer-events-none opacity-50")} href={inst.url || "#"} download={`${(resume.name || "cv").trim().replace(/\s+/g, "_")}.pdf`}>{t("Unduh PDF", "Download PDF")}</a>
        <button className="btn" onClick={() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([toLatex(resume)], { type: "text/plain" })); a.download = `${(resume.name || "cv").trim().replace(/\s+/g, "_")}.tex`; a.click(); }}>{t("Unduh .tex", "Download .tex")}</button>
        <button className="btn" onClick={async () => { await navigator.clipboard.writeText(toLatex(resume)); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? t("Tersalin", "Copied") : t("Salin LaTeX", "Copy LaTeX")}</button>
        <span className="text-xs" style={{ color: "var(--mut)" }}>{inst.loading ? t("Merender...", "Rendering...") : t("Pratinjau PDF asli, teks bisa diseleksi", "Real PDF preview, selectable text")}</span>
      </div>
      <div className="min-h-[560px] flex-1 overflow-hidden rounded-md" style={{ background: "#9fb3ba" }}>
        {inst.error ? <p className="p-6 text-center text-sm">Preview error. Data kamu aman, coba ubah satu kolom.</p>
          : inst.url ? <iframe title="CV preview" src={`${inst.url}#toolbar=0&navpanes=0&view=FitH`} className="h-full w-full border-0" />
          : <p className="p-6 text-center text-sm">{t("Merender...", "Rendering...")}</p>}
      </div>
    </div>
  );
}
