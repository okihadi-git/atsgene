import type { Resume } from "./types";
import { lines } from "./ats";

const TX = (s?: string) =>
  (s || "")
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[&%$#_{}]/g, (m) => "\\" + m)
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");

const items = (a: string[]) => (a.length ? `\\begin{itemize}\n${a.map((b) => "\\item " + TX(b)).join("\n")}\n\\end{itemize}\n` : "");
const sec = (h: string, b: string) => (b.trim() ? `\\section*{${h}}\n${b}\n` : "");
const list = (a: { v?: string }[]) => a.map((x) => x.v || "").filter(Boolean);

export function toLatex(r: Resume): string {
  const contact = [r.phone, r.email, r.loc, r.li, r.gh, r.web].filter((x) => x && x.trim()).map(TX).join(" $|$ ");
  return (
    `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage{enumitem,titlesec}
\\pagestyle{empty}
\\titleformat{\\section}{\\large\\bfseries\\scshape}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{10pt}{5pt}
\\setlist[itemize]{leftmargin=*,itemsep=0pt,topsep=2pt}
\\begin{document}
\\begin{center}
{\\LARGE\\bfseries ${TX(r.name || "Your Name")}}\\\\[2pt]
${r.title ? TX(r.title) + "\\\\[2pt]\n" : ""}${contact}
\\end{center}
` +
    sec("Summary", TX(r.summary)) +
    sec("Professional Experience", r.exp.filter((x) => x.role || x.org).map((x) => `\\textbf{${TX(x.role)}} \\hfill ${TX(x.dates)}\\\\\n\\textit{${TX(x.org)}} \\hfill \\textit{${TX(x.loc)}}\n${items(lines(x.bullets))}`).join("\n")) +
    sec("Education", r.edu.filter((x) => x.deg || x.school).map((x) => `\\textbf{${TX(x.deg)}} \\hfill ${TX(x.dates)}\\\\\n\\textit{${TX(x.school)}${x.gpa ? " | GPA: " + TX(x.gpa) : ""}} \\hfill \\textit{${TX(x.loc)}}\n${items(lines(x.detail))}`).join("\n")) +
    sec("Projects", r.proj.filter((x) => x.name).map((x) => `\\textbf{${TX(x.name)}}${x.tech ? " | \\textit{" + TX(x.tech) + "}" : ""} \\hfill ${TX(x.year)}\n${items(lines(x.desc))}`).join("\n")) +
    sec("Technical Skills", r.skills.filter((x) => x.list).map((x) => `${x.cat ? "\\textbf{" + TX(x.cat) + ":} " : ""}${TX(x.list)}\\\\`).join("\n")) +
    sec("Achievements", items(list(r.ach))) +
    sec("Certifications \\& Honors", items(list(r.cert))) +
    sec("Languages", items(list(r.lang))) +
    "\\end{document}\n"
  );
}
