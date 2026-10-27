"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useStore, useT } from "@/lib/store";
import Editor from "./Editor";
import { DesignPanel, AtsPanel } from "./Panels";

// Dynamic import Preview agar hanya jalan di Client-Side
const Preview = dynamic(() => import("./Preview"), { ssr: false });

export default function App() {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);

  const t = useT();
  const { tab, lang, dark, resume } = useStore();
  const { patch, sample, clear, load } = useStore.getState();
  const file = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  if (!ok) return null;

  const exportJson = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(resume, null, 1)], { type: "application/json" })
    );
    a.download = "cv-data.json";
    a.click();
  };

  const importJson = async (f?: File) => {
    if (!f) return;
    try {
      load(JSON.parse(await f.text()));
    } catch {
      alert(t("JSON tidak valid", "Invalid JSON"));
    }
  };

  const tabs: [typeof tab, string][] = [
    ["edit", "Editor"],
    ["design", t("Desain", "Design")],
    ["ats", t("Cek ATS", "ATS check")],
  ];

  return (
    <>
      <header
        className="flex items-center gap-3 px-6 py-3.5 text-white"
        style={{ background: "var(--hd)" }}
      >
        <div
          className="grid h-9 w-9 place-items-center text-xs font-bold"
          style={{ background: "#fff", color: "var(--hd)", borderRadius: "50% 50% 50% 4px" }}
        >
          CV
        </div>
        <div>
          <h1 className="text-xl font-bold">ATS CV Builder</h1>
          <p className="text-xs opacity-70">
            {t(
              "Buat CV rapi yang ramah ATS dalam hitungan menit.",
              "Build a clean, ATS-friendly CV in minutes."
            )}
          </p>
        </div>
        <span className="flex-1" />
        <button
          className="rounded-full border border-white/40 px-3 py-1 text-sm"
          onClick={() => patch({ dark: !dark })}
        >
          {dark ? "☀" : "☾"}
        </button>
        {(["id", "en"] as const).map((l) => (
          <button
            key={l}
            onClick={() => patch({ lang: l })}
            className="rounded-full border border-white/40 px-3 py-1 text-sm"
            style={lang === l ? { background: "#fff", color: "var(--hd)" } : {}}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-5 p-5 lg:grid-cols-[minmax(340px,560px)_1fr]">
        <section>
          <div
            className="mb-3 flex gap-6 border-b-2"
            style={{ borderColor: "var(--line)" }}
          >
            {tabs.map(([k, l]) => (
              <button
                key={k}
                onClick={() => patch({ tab: k })}
                className="-mb-0.5 border-b-4 px-0.5 py-2 font-semibold"
                style={{
                  borderColor: tab === k ? "var(--pri)" : "transparent",
                  color: tab === k ? "var(--ink)" : "var(--mut)",
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap gap-1">
            <button className="btn" onClick={sample}>
              {t("Muat contoh", "Load sample")}
            </button>
            <button
              className="ghost"
              onClick={() =>
                confirm(t("Hapus semua data CV?", "Clear all CV data?")) && clear()
              }
            >
              {t("Hapus semua", "Clear all")}
            </button>
            <button className="ghost" onClick={() => file.current?.click()}>
              {t("Impor", "Import")}
            </button>
            <button className="ghost" onClick={exportJson}>
              {t("Ekspor data", "Export data")}
            </button>
            <input
              ref={file}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => importJson(e.target.files?.[0])}
            />
          </div>

          {tab === "edit" ? <Editor /> : tab === "design" ? <DesignPanel /> : <AtsPanel />}
        </section>

        {/* Section Preview PDF */}
        <section className="lg:sticky lg:top-3 lg:h-[calc(100vh-24px)]">
          <Preview resume={resume} settings={resume} />
        </section>
      </main>
    </>
  );
}
