import type { Item, Resume } from "./types";
export const lines = (t?: string) => (t || "").split("\n").map((x) => x.trim()).filter(Boolean);
const VERB = /^(built|led|reduced|increased|created|designed|developed|launched|improved|managed|mentored|delivered|implemented|optimized|automated|migrated|shipped|analyzed|owned|drove|wrote|cut|grew|trained|streamlined|partnered|cleaned|collaborated|achieved|generated|established|coordinated|conducted|membangun|memimpin|mengurangi|meningkatkan|merancang|mengembangkan|mengelola)/i;
const STOP = new Set("the and for with that this from will have your you are our their who can able work working team about such into more also been being they them its not but all any new use using years year experience skills ability strong looking join role responsibilities required requirements preferred plus including etc has was were should must may per via one two dan yang untuk dengan atau dari pada dalam akan kami anda kamu memiliki minimal".split(" "));
export function keywords(x: string) {
  const m: Record<string, number> = {};
  (x.toLowerCase().match(/[a-z][a-z+#.]{1,}/g) || []).forEach((w) => { w = w.replace(/\.+$/, ""); if (w.length > 2 && !STOP.has(w)) m[w] = (m[w] || 0) + 1; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 25).map((e) => e[0]);
}
export function analyze(r: Resume, jd: string) {
  const bl = [...r.exp.flatMap((x) => lines(x.bullets)), ...r.proj.flatMap((x) => lines(x.desc))];
  const has = (a: Item[], k: string) => a.some((x) => (x[k] || "").trim());
  const checks: [string, string, boolean][] = [
    ["Mencantumkan nama lengkap", "Has full name", r.name.trim().split(/\s+/).filter(Boolean).length >= 2],
    ["Memiliki email valid", "Has valid email", /^\S+@\S+\.\S+$/.test(r.email.trim())],
    ["Memiliki nomor telepon", "Has phone number", r.phone.replace(/\D/g, "").length >= 8],
    ["Ada LinkedIn / portfolio / GitHub", "Has LinkedIn / portfolio / GitHub", (r.li + r.gh + r.web).trim().length > 0],
    ["Ada ringkasan (40+ karakter)", "Has summary (40+ chars)", r.summary.trim().length >= 40],
    ["Ada pengalaman atau proyek", "Has experience or projects", has(r.exp, "role") || has(r.proj, "name")],
    ["Ada pendidikan", "Has education", has(r.edu, "school") || has(r.edu, "deg")],
    ["Mencantumkan keahlian", "Lists skills", has(r.skills, "list")],
    ["Minimal 3 poin pencapaian", "At least 3 achievement bullets", bl.length >= 3],
    ["Poin diawali kata kerja aksi", "Bullets start with action verbs", bl.length > 0 && bl.filter((b) => VERB.test(b)).length / bl.length >= 0.6],
    ["Menunjukkan dampak dengan angka", "Shows impact with numbers", bl.some((b) => /\d/.test(b))],
    ["Poin ringkas (tidak bertele-tele)", "Concise bullets", bl.length > 0 && bl.every((b) => b.length <= 200)],
  ];
  const fmt = Math.round((checks.filter((c) => c[2]).length / checks.length) * 100);
  const hasJD = jd.trim().length > 40; const hit: string[] = [], miss: string[] = []; let km: number | null = null;
  if (hasJD) { const all = JSON.stringify(r).toLowerCase(); keywords(jd).forEach((k) => (all.includes(k) ? hit : miss).push(k)); km = Math.round((hit.length / Math.max(hit.length + miss.length, 1)) * 100); }
  const total = km == null ? fmt : Math.round(fmt * 0.4 + km * 0.6);
  return { checks, fmt, km, hit, miss, total, hasJD };
}
