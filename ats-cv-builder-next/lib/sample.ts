import type { Resume } from "./types";
export const BLANK = (): Resume => ({ name: "", title: "", email: "", phone: "", loc: "", li: "", gh: "", web: "", summary: "", exp: [{}], edu: [{}], proj: [{}], skills: [{}], ach: [{}], cert: [{}], lang: [{}] });
export const SAMPLE: Resume = {
  name: "Budi Santoso", title: "Data Analyst", email: "budi.santoso@email.com", phone: "+62 812-3456-7890", loc: "Jakarta, Indonesia", li: "linkedin.com/in/budisantoso", gh: "github.com/budisantoso", web: "budisantoso.dev",
  summary: "Data Analyst with 3+ years turning messy data into clear decisions. Skilled in SQL, Python, and dashboarding, with a track record of cutting reporting time and surfacing revenue opportunities.",
  exp: [{ role: "Data Analyst", org: "Tokopedia", loc: "Jakarta", dates: "Jan 2022 - Present", bullets: "Built 12+ automated dashboards in Looker, reducing weekly reporting time by 70%.\nDesigned an SQL anomaly-detection pipeline that flagged Rp 2.1B in mispriced SKUs.\nPartnered with product to run 8 A/B tests, lifting checkout conversion by 4.3%." }],
  edu: [{ deg: "B.Sc. in Computer Science", school: "Universitas Indonesia", loc: "Depok, Indonesia", dates: "2017 - 2021", gpa: "3.78 / 4.00" }],
  proj: [{ name: "House Price Prediction", year: "2023", tech: "Python, Scikit-Learn, Streamlit", desc: "Trained a gradient-boosting model reaching 0.91 R^2 on 20k listings.\nShipped an interactive Streamlit demo used by 300+ visitors." }],
  skills: [{ cat: "Languages", list: "Python, SQL, R, JavaScript" }, { cat: "Data & BI", list: "Pandas, Looker, Tableau, dbt" }],
  ach: [{ v: "1st Place - National Data Hackathon 2023" }], cert: [{ v: "Google Data Analytics Professional Certificate" }], lang: [{ v: "Indonesian - Native" }, { v: "English - Professional (IELTS 7.5)" }],
};
