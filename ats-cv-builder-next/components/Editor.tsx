"use client";
import { useStore, useT } from "@/lib/store";
type F = [string, string, string, string?, boolean?];
const BASIC: F[] = [["name", "Nama lengkap", "Full name", "Budi Santoso"], ["title", "Posisi yang dilamar", "Target role", "Data Analyst"], ["email", "Email", "Email", "budi@email.com"], ["phone", "Telepon", "Phone", "+62 812-3456-7890"], ["loc", "Lokasi", "Location", "Jakarta, Indonesia"], ["li", "URL LinkedIn", "LinkedIn URL", "linkedin.com/in/budi"], ["gh", "URL GitHub", "GitHub URL", "github.com/budi"], ["web", "Portfolio / website", "Portfolio / website", "budi.dev"]];
const LISTS: Record<string, { h: [string, string]; f: F[] }> = {
  exp: { h: ["Pengalaman kerja", "Work experience"], f: [["role", "Jabatan", "Job title", "Junior Developer"], ["org", "Perusahaan", "Company", "Tokopedia"], ["loc", "Lokasi", "Location", "Jakarta"], ["dates", "Periode", "Period", "Jan 2023 - Present"], ["bullets", "Tanggung jawab & dampak (satu poin per baris)", "Responsibilities & impact (one per line)", "Built X that improved Y by Z%", true]] },
  edu: { h: ["Pendidikan", "Education"], f: [["deg", "Gelar / jurusan", "Degree / major"], ["school", "Institusi", "Institution"], ["loc", "Lokasi", "Location"], ["dates", "Periode", "Period"], ["gpa", "IPK (opsional)", "GPA (optional)"], ["detail", "Detail (satu per baris)", "Details (one per line)", "", true]] },
  proj: { h: ["Proyek", "Projects"], f: [["name", "Nama proyek", "Project name"], ["year", "Tahun", "Year"], ["tech", "Teknologi", "Technologies"], ["desc", "Deskripsi (satu poin per baris)", "Description (one per line)", "", true]] },
  skills: { h: ["Keahlian", "Skills"], f: [["cat", "Kategori (opsional)", "Category (optional)"], ["list", "Keahlian (pisahkan dengan koma)", "Skills (comma-separated)"]] },
  ach: { h: ["Prestasi", "Achievements"], f: [["v", "Prestasi", "Achievement"]] },
  cert: { h: ["Sertifikasi", "Certifications"], f: [["v", "Sertifikat atau penghargaan", "Certificate or award"]] },
  lang: { h: ["Bahasa", "Languages"], f: [["v", "Bahasa & tingkat", "Language & level"]] },
};
function Field({ f, v, on }: { f: F; v: string; on: (v: string) => void }) {
  const t = useT();
  return (<div className={f[4] ? "col-span-2" : ""}><label className="lab">{t(f[1], f[2])}</label>
    {f[4] ? <textarea className="inp min-h-[90px]" value={v} placeholder={f[3]} onChange={(e) => on(e.target.value)} /> : <input className="inp" value={v} placeholder={f[3]} onChange={(e) => on(e.target.value)} />}</div>);
}
export default function Editor() {
  const t = useT(); const r = useStore((s) => s.resume); const { setField, setItem, add, del, move } = useStore.getState();
  const R = r as unknown as Record<string, any>;
  return (<>
    <details open className="card"><summary className="cursor-pointer text-lg font-bold">{t("Informasi dasar", "Basic information")}</summary><div className="mt-3 grid grid-cols-2 gap-3">{BASIC.map((f) => <Field key={f[0]} f={f} v={R[f[0]]} on={(v) => setField(f[0], v)} />)}</div></details>
    <details open className="card"><summary className="cursor-pointer text-lg font-bold">{t("Ringkasan profesional", "Professional summary")}</summary><div className="mt-3 grid grid-cols-2 gap-3"><Field f={["summary", "Ringkasan", "Summary", "2-3 sentences highlighting your strengths...", true]} v={r.summary} on={(v) => setField("summary", v)} /></div></details>
    {Object.entries(LISTS).map(([k, c]) => { const h = t(...c.h); const a = R[k] as Record<string, string>[]; return (
      <details open key={k} className="card"><summary className="cursor-pointer text-lg font-bold">{h}</summary>
        {a.map((x, i) => (<div key={i} className="mt-3 rounded-md border p-3" style={{ borderColor: "var(--line)" }}>
          <div className="mb-2 flex items-center text-xs font-semibold uppercase" style={{ color: "var(--mut)" }}><span className="flex-1">{h} #{i + 1}</span>
            <button className="ghost" onClick={() => move(k, i, -1)} aria-label="Up">↑</button><button className="ghost" onClick={() => move(k, i, 1)} aria-label="Down">↓</button><button className="ghost" onClick={() => del(k, i)} aria-label="Delete">✕</button></div>
          <div className="grid grid-cols-2 gap-3">{c.f.map((f) => <Field key={f[0]} f={f} v={x[f[0]] || ""} on={(v) => setItem(k, i, f[0], v)} />)}</div></div>))}
        <button className="btn mt-3 w-full border-dashed" onClick={() => add(k)}>+ {t("Tambah", "Add")} {h}</button></details>); })}
  </>);
}
