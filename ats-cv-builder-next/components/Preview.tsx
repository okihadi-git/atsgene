"use client";
import React, { useEffect, useState } from "react";
import { usePDF } from "@react-pdf/renderer";
import { ResumeDocument } from "./pdf/ResumeDocument";
import { useStore, useT } from "@/lib/store";
import { toLatex } from "@/lib/latex";
import { useSupport } from "./SupportModal";

function useDeb<T>(v: T, ms: number) { const [x, setX] = useState(v); useEffect(() => { const h = setTimeout(() => setX(v), ms); return () => clearTimeout(h); }, [v, ms]); return x; }

export default function Preview() {
  const t = useT();
  const resume = useStore((x) => x.resume), settings = useStore((x) => x.settings);
  const [copied, setCopied] = useState(false);
  const dr = useDeb(resume, 500), ds = useDeb(settings, 200);
  const [inst, update] = usePDF({ document: <ResumeDocument r={dr} s={ds} /> });
  useEffect(() => { update(<ResumeDocument r={dr} s={ds} />); /* eslint-disable-next-line */ }, [dr, ds]);
  const ask = useSupport.getState().ask, base = (resume.name || "cv").trim().replace(/\s+/g, "_");
  const dl = (href: string, name: string) => { const a = document.createElement("a"); a.href = href; a.download = name; a.click(); };
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn btn-pri disabled:opacity-50" disabled={!inst.url} onClick={() => inst.url && ask(() => dl(inst.url!, `${base}.pdf`))}>{t("Unduh PDF", "Download PDF")}</button>
        <button className="btn" onClick={() => ask(() => { const u = URL.createObjectURL(new Blob([toLatex(resume)], { type: "text/plain" })); dl(u, `${base}.tex`); setTimeout(() => URL.revokeObjectURL(u), 1000); })}>{t("Unduh .tex", "Download .tex")}</button>
        <button className="btn" onClick={() => ask(async () => { const tx = toLatex(resume); try { await navigator.clipboard.writeText(tx); } catch { const el = document.createElement("textarea"); el.value = tx; document.body.appendChild(el); el.select(); document.execCommand("copy"); el.remove(); } setCopied(true); setTimeout(() => setCopied(false), 1500); })}>{copied ? t("Tersalin", "Copied") : t("Salin LaTeX", "Copy LaTeX")}</button>
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
