import React from "react";
import { Font, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume, Settings } from "@/lib/types";
import { lines } from "@/lib/ats";

// Registrasi Font eksternal agar tidak fallback/error
Font.register({
  family: "Open Sans",
  src: "https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf",
});

export function ResumeDocument({ r, s }: { r: Resume; s: Settings }) {
  const serif = s.tpl === "classic";
  const cmp = s.tpl === "compact";
  const mod = s.tpl === "modern";

  const F = serif ? "Times-Roman" : "Helvetica";
  const B = serif ? "Times-Bold" : "Helvetica-Bold";
  const I = serif ? "Times-Italic" : "Helvetica-Oblique";

  const z = ((cmp ? 9 : 10) * s.fs) / 100;
  const a = s.acc;
  const al = mod ? "left" : "center";

  const st = StyleSheet.create({
    page: {
      paddingVertical: cmp ? 28 : 38,
      paddingHorizontal: cmp ? 36 : 46,
      fontFamily: F,
      fontSize: z,
      lineHeight: 1.3,
      color: "#111",
    },
    name: {
      fontFamily: B,
      fontSize: z * 2.1,
      textAlign: al,
      color: mod ? a : "#111",
    },
    sub: {
      textAlign: al,
      color: mod ? a : "#111",
      marginTop: 2,
    },
    contact: {
      textAlign: al,
      marginTop: 4,
      fontSize: z * 0.92,
    },
    h: {
      fontFamily: B,
      marginTop: cmp ? 8 : 12,
      marginBottom: 4,
      paddingBottom: 2,
      textTransform: cmp ? "none" : "uppercase",
      color: serif ? "#111" : a,
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      borderBottomColor: serif ? "#111" : cmp ? "#d4d4d8" : a,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    b: { fontFamily: B },
    i: { fontFamily: I },
    d: { color: a },
    li: {
      flexDirection: "row",
      marginLeft: 8,
    },
    dot: { width: 10 },
  } as any);

  const Bul = ({ t }: { t: string[] }) => (
    <>
      {t.map((x, k) => (
        <View key={k} style={st.li}>
          <Text style={st.dot}>•</Text>
          <Text style={{ flex: 1 }}>{x}</Text>
        </View>
      ))}
    </>
  );

  const Sec = ({ h, children }: { h: string; children: React.ReactNode }) => (
    <View>
      <Text style={st.h}>{h}</Text>
      {children}
    </View>
  );

  const contact = [r.phone, r.email, r.loc, r.li, r.gh, r.web]
    .filter((x) => x && x.trim())
    .join("  |  ");

  const exp = r.exp.filter((x) => x.role || x.org);
  const edu = r.edu.filter((x) => x.deg || x.school);
  const proj = r.proj.filter((x) => x.name);
  const sk = r.skills.filter((x) => x.list);

  const lst = (a: { v?: string }[]) => a.map((x) => x.v || "").filter(Boolean);
  const ach = lst(r.ach);
  const cert = lst(r.cert);
  const lang = lst(r.lang);

  return (
    <Document title={`${r.name || "CV"} - Resume`}>
      <Page size="A4" style={st.page}>
        <Text style={st.name}>{r.name || "Your Name"}</Text>
        {r.title ? <Text style={st.sub}>{r.title}</Text> : null}
        <Text style={st.contact}>{contact}</Text>

        {r.summary.trim() ? (
          <Sec h="Summary">
            <Text>{r.summary}</Text>
          </Sec>
        ) : null}

        {exp.length ? (
          <Sec h="Professional Experience">
            {exp.map((x, k) => (
              <View key={k} style={{ marginBottom: 4 }}>
                <View style={st.row}>
                  <Text style={st.b}>{x.role}</Text>
                  <Text style={st.d}>{x.dates}</Text>
                </View>
                <View style={st.row}>
                  <Text style={st.i}>{x.org}</Text>
                  <Text style={st.i}>{x.loc}</Text>
                </View>
                <Bul t={lines(x.bullets)} />
              </View>
            ))}
          </Sec>
        ) : null}

        {edu.length ? (
          <Sec h="Education">
            {edu.map((x, k) => (
              <View key={k} style={{ marginBottom: 4 }}>
                <View style={st.row}>
                  <Text style={st.b}>{x.deg}</Text>
                  <Text style={st.d}>{x.dates}</Text>
                </View>
                <View style={st.row}>
                  <Text style={st.i}>
                    {x.school}
                    {x.gpa ? ` | GPA: ${x.gpa}` : ""}
                  </Text>
                  <Text style={st.i}>{x.loc}</Text>
                </View>
                <Bul t={lines(x.detail)} />
              </View>
            ))}
          </Sec>
        ) : null}

        {proj.length ? (
          <Sec h="Projects">
            {proj.map((x, k) => (
              <View key={k} style={{ marginBottom: 4 }}>
                <View style={st.row}>
                  <Text>
                    <Text style={st.b}>{x.name}</Text>
                    {x.tech ? <Text style={st.i}>{`  |  ${x.tech}`}</Text> : null}
                  </Text>
                  <Text style={st.d}>{x.year}</Text>
                </View>
                <Bul t={lines(x.desc)} />
              </View>
            ))}
          </Sec>
        ) : null}

        {sk.length ? (
          <Sec h="Technical Skills">
            {sk.map((x, k) => (
              <Text key={k}>
                {x.cat ? <Text style={st.b}>{x.cat}: </Text> : null}
                {x.list}
              </Text>
            ))}
          </Sec>
        ) : null}

        {ach.length ? (
          <Sec h="Achievements">
            <Bul t={ach} />
          </Sec>
        ) : null}

        {cert.length ? (
          <Sec h="Certifications & Honors">
            <Bul t={cert} />
          </Sec>
        ) : null}

        {lang.length ? (
          <Sec h="Languages">
            <Bul t={lang} />
          </Sec>
        ) : null}
      </Page>
    </Document>
  );
}

export default ResumeDocument;
