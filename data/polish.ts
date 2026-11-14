// Esmaltes disponíveis no seletor do hero.
// As cores reais ficam em app/globals.css (--sw-<id>), com variação para o modo escuro.

export type Esmalte = { id: "nude" | "vermelho" | "vinho" | "rosa" | "preto"; nome: string };

export const esmaltes: Esmalte[] = [
  { id: "nude", nome: "Nude" },
  { id: "vermelho", nome: "Vermelho clássico" },
  { id: "vinho", nome: "Vinho" },
  { id: "rosa", nome: "Rosa" },
  { id: "preto", nome: "Preto" },
];

export const CHAVE_POLISH = "glow-polish";
