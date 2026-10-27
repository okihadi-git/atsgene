export type Item = Record<string, string>;
export interface Resume { name: string; title: string; email: string; phone: string; loc: string; li: string; gh: string; web: string; summary: string; exp: Item[]; edu: Item[]; proj: Item[]; skills: Item[]; ach: Item[]; cert: Item[]; lang: Item[]; }
export interface Settings { tpl: "classic" | "modern" | "compact"; acc: string; fs: number; }
