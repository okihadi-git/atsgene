"use client";
import { useStore, useT } from "@/lib/store";
import { analyze } from "@/lib/ats";
const ACC = ["#0b7a75", "#334155", "#047857", "#7c3aed", "#be123c", "#b45309", "#111111"];
const TPL: [string, string, string, string][] = [["classic", "Classic", "Serif, satu kolom. Pilihan paling aman untuk ATS.", "Serif, single-column. The safest ATS choice."], ["modern", "Modern", "Sans-serif dengan judul section berwarna aksen.", "Sans-serif with accent-colored headings."], ["compact", "Compact", "Spasi rapat agar muat di satu halaman.", "Tighter spacing to fit one page."]];

export function DesignPanel() {
  const t = useT(); const s = useStore((x) => x.settings); const set = useStore((x) => x.setSettings);
  return (<>
    <div className="card"><b>Template</b><div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">{TPL.map(([k, n, id, en]) => (
      <button key={k} onClick={() => set({ tpl: k as any })} className="rounded-md border p-3 text-left" style={{ borderColor: s.tpl === k ? "var(--pri)" : "var(--line)", boxShadow: s.tpl === k ? "0 0 0 1px var(--pri)" : "none" }}>
        <b>{n}</b><div className="text-xs" style={{ color: "var(--mut)" }}>{t(id, en)}</div><span className="mt-2 inline-block rounded-full px-2 text-xs" style={{ background: "var(--okb)", color: "var(--ok)" }}>{t("Aman ATS", "ATS-safe")}</span></button>))}</div></div>
    <div className="card"><b>{t("Warna aksen", "Accent color")}</b><div className="mt-3 flex flex-wrap items-center gap-3">{ACC.map((c) => (<button key={c} aria-label={c} onClick={() => set({ acc: c })} className="h-7 w-7 rounded-full" style={{ background: c, boxShadow: s.acc === c ? "0 0 0 2px var(--ink)" : "none" }} />))}<input type="color" value={s.acc} onChange={(e) => set({ acc: e.target.value })} aria-label="Custom color" /></div></div>
    <div className="card"><b>{t("Ukuran font", "Font size")}</b><div className="mt-3 flex items-center gap-3"><button className="btn" onClick={() => set({ fs: Math.max(80, s.fs - 5) })}>−</button><input className="flex-1" type="range" min={80} max={120} step={5} value={s.fs} onChange={(e) => set({ fs: +e.target.value })} /><button className="btn" onClick={() => set({ fs: Math.min(120, s.fs + 5) })}>+</button></div><div className="text-center" style={{ color: "var(--mut)" }}>{s.fs}%</div></div>
  </>);
}

export function AtsPanel() {
  const t = useT(); const r = useStore((x) => x.resume), jd = useStore((x) => x.jd), patch = useStore((x) => x.patch);
  const a = analyze(r, jd); const R = 46, C = 2 * Math.PI * R; const col = a.total >= 80 ? "var(--ok)" : a.total >= 55 ? "#d97706" : "var(--bad)";
  const sug = a.checks.filter((c) => !c[2]).map((c) => t("Perbaiki: ", "Fix: ") + t(c[0], c[1]));
  if (a.miss.length) sug.push(t("Tambahkan kata kunci: ", "Add keywords: ") + a.miss.slice(0, 8).join(", "));
  if (!sug.length) sug.push(t("Sudah kuat. Tiru frasa persis dari lowongan.", "Looking strong. Mirror exact phrases from the posting."));
  const Bar = ({ l, v }: { l: string; v: number }) => (<div className="mb-2"><div className="flex justify-between text-xs"><span>{l}</span><span>{v}%</span></div><div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--line)" }}><div className="h-full" style={{ width: v + "%", background: "var(--ok)" }} /></div></div>);
  return (<>
    <div className="card"><b>{t("Pemeriksa Skor ATS", "ATS Score Checker")}</b><label className="lab mt-3">{t("Deskripsi pekerjaan", "Job description")}</label><textarea className="inp min-h-[110px]" value={jd} onChange={(e) => patch({ jd: e.target.value })} placeholder={t("Tempel lowongan kerja lengkap di sini...", "Paste the full job posting here...")} /></div>
    <div className="card flex items-center gap-5"><div className="relative h-[110px] w-[110px] shrink-0"><svg viewBox="0 0 110 110"><circle cx="55" cy="55" r={R} fill="none" stroke="var(--line)" strokeWidth="9" /><circle cx="55" cy="55" r={R} fill="none" stroke={col} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(C * a.total) / 100} ${C}`} transform="rotate(-90 55 55)" /></svg><b className="absolute inset-0 grid place-items-center text-3xl" style={{ color: col }}>{a.total}</b></div>
      <div className="flex-1">{a.km != null ? <Bar l={t("Kecocokan kata kunci", "Keyword match")} v={a.km} /> : <p className="mb-2 text-xs" style={{ color: "var(--mut)" }}>{t("Tambahkan deskripsi pekerjaan untuk menilai kecocokan.", "Add a job description to score the match.")}</p>}<Bar l={t("Format & konten", "Format & content")} v={a.fmt} /></div></div>
    {a.hasJD ? <div className="card"><b>{t("Kata kunci", "Keywords")}</b><div className="mt-2 flex flex-wrap gap-1.5">{a.hit.map((k) => <span key={k} className="rounded px-2 text-xs" style={{ background: "var(--okb)", color: "var(--ok)" }}>{k}</span>)}{a.miss.map((k) => <span key={k} className="rounded bg-red-100 px-2 text-xs text-red-700">{k}</span>)}</div></div> : null}
    <div className="card"><b>{t("Daftar periksa konten", "Content checklist")}</b><ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{a.checks.map((c, i) => <li key={i} style={{ color: c[2] ? "var(--ink)" : "var(--bad)" }}>{c[2] ? "✓" : "✕"} {t(c[0], c[1])}</li>)}</ul></div>
    <div className="card"><b>{t("Saran", "Suggestions")}</b><ul className="mt-2 text-sm" style={{ color: "var(--mut)" }}>{sug.map((x, i) => <li key={i}>• {x}</li>)}</ul></div>
  </>);
}
