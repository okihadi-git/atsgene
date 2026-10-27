import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Resume, Settings } from "./types";
import { BLANK, SAMPLE } from "./sample";

type Tab = "edit" | "design" | "ats";
interface S {
  resume: Resume; settings: Settings; jd: string; lang: "id" | "en"; tab: Tab; dark: boolean;
  setField: (k: string, v: string) => void;
  setItem: (l: string, i: number, f: string, v: string) => void;
  add: (l: string) => void; del: (l: string, i: number) => void; move: (l: string, i: number, d: number) => void;
  patch: (p: Partial<Pick<S, "jd" | "lang" | "tab" | "dark">>) => void;
  setSettings: (p: Partial<Settings>) => void;
  sample: () => void; clear: () => void; load: (r: Partial<Resume>) => void;
}
const L = (s: S, l: string) => (s.resume as any)[l] as Record<string, string>[];

export const useStore = create<S>()(persist((set) => ({
  resume: BLANK(), settings: { tpl: "classic", acc: "#0b7a75", fs: 100 }, jd: "", lang: "id", tab: "edit", dark: false,
  setField: (k, v) => set((s) => ({ resume: { ...s.resume, [k]: v } })),
  setItem: (l, i, f, v) => set((s) => { const a = [...L(s, l)]; a[i] = { ...a[i], [f]: v }; return { resume: { ...s.resume, [l]: a } }; }),
  add: (l) => set((s) => ({ resume: { ...s.resume, [l]: [...L(s, l), {}] } })),
  del: (l, i) => set((s) => { const a = L(s, l).filter((_, k) => k !== i); return { resume: { ...s.resume, [l]: a.length ? a : [{}] } }; }),
  move: (l, i, d) => set((s) => { const a = [...L(s, l)]; const j = i + d; if (!a[j]) return s; [a[i], a[j]] = [a[j], a[i]]; return { resume: { ...s.resume, [l]: a } }; }),
  patch: (p) => set(p),
  setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
  sample: () => set({ resume: structuredClone(SAMPLE) }),
  clear: () => set({ resume: BLANK() }),
  load: (r) => set({ resume: { ...BLANK(), ...r } }),
}), { name: "atscv-next" }));

export const useT = () => { const l = useStore((s) => s.lang); return (id: string, en: string) => (l === "id" ? id : en); };
