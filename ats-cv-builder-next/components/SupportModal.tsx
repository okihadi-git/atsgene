"use client";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { useT } from "@/lib/store";

const WAIT = 5; // detik hitung mundur untuk jalur gratis
const GRACE = 10 * 60 * 1000; // setelah lolos sekali, tidak ditanya lagi selama 10 menit
export const TRAKTEER_URL = "https://trakteer.id/okihadi/tip?quantity=1";

type Act = () => void | Promise<void>;
interface S { pending: Act | null; until: number; ask: (a: Act) => void; close: () => void; done: () => void }

export const useSupport = create<S>((set, get) => ({
  pending: null,
  until: 0,
  ask: (a) => { if (Date.now() < get().until) { a(); return; } set({ pending: a }); },
  close: () => set({ pending: null }),
  done: () => { const a = get().pending; set({ pending: null, until: Date.now() + GRACE }); a?.(); },
}));

function openTrakteer() { window.open(TRAKTEER_URL, "_blank", "noopener,noreferrer"); }

export default function SupportModal() {
  const t = useT();
  const pending = useSupport((s) => s.pending);
  const [sec, setSec] = useState(WAIT);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (!pending) return;
    let n = WAIT;
    setSec(WAIT); setShared(false);
    const h = setInterval(() => {
      n -= 1; setSec(n);
      if (n <= 0) { clearInterval(h); useSupport.getState().done(); } // tutup otomatis + unduh
    }, 1000);
    const k = (e: KeyboardEvent) => e.key === "Escape" && useSupport.getState().close();
    window.addEventListener("keydown", k);
    return () => { clearInterval(h); window.removeEventListener("keydown", k); };
  }, [pending]);

  if (!pending) return null;
  const { done, close } = useSupport.getState();

  const tip = () => { openTrakteer(); done(); }; // tab traktir terbuka, file langsung terunduh
  const share = async () => {
    const data = { title: "ATS CV Builder", text: t("Bikin CV ramah ATS gratis di sini:", "Build a free ATS-friendly CV here:"), url: location.origin };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(location.origin);
      setShared(true);
      setTimeout(() => useSupport.getState().done(), 800);
    } catch { /* dibatalkan pengguna */ }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={close} role="dialog" aria-modal="true">
      <div className="card !mb-0 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-start justify-between gap-3">
          <h2 className="text-base font-bold">{t("CV kamu siap diunduh 🎉", "Your CV is ready 🎉")}</h2>
          <button className="ghost !p-0 leading-none" onClick={close} aria-label={t("Tutup", "Close")}>✕</button>
        </div>
        <p className="mb-4 text-sm" style={{ color: "var(--mut)" }}>
          {t("Tool ini gratis. Kalau terbantu, traktir kopi atau ajak temanmu. Atau lanjut unduh gratis setelah hitung mundur.",
             "This tool is free. If it helped, buy me a coffee or tell a friend. Or continue for free after the countdown.")}
        </p>
        <div className="flex flex-col gap-2">
          <button className="btn btn-pri w-full" onClick={tip}>☕ {t("Traktir & unduh", "Tip & download")}</button>
          <button className="btn w-full" onClick={share}>{shared ? t("Terima kasih! 🙏", "Thank you! 🙏") : "🔗 " + t("Bagikan ke teman", "Share with a friend")}</button>
          <button className="btn w-full disabled:cursor-not-allowed disabled:opacity-50" disabled={sec > 0} onClick={done}>
            {sec > 0 ? t(`Lanjut unduh gratis (${sec})`, `Continue for free (${sec})`) : t("Lanjut unduh", "Continue download")}
          </button>
        </div>
      </div>
    </div>
  );
}
