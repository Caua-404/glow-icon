// Fotos de exemplo em /public/img/inspiracoes. Trocar pelas fotos reais do salão
// mantendo o nome do arquivo, ou ajustando w/h (proporção no masonry).

import type { CategoriaId } from "./servicos";
import type { ProfissionalId } from "./equipe";

export type Inspiracao = {
  id: string;
  src: string;
  w: number;
  h: number;
  alt: string;
  categoria: CategoriaId;
  profissionalId: ProfissionalId;
  /** serviço relacionado, usado no botão "Quero esse" */
  servicoId?: string;
};

export const inspiracoes: Inspiracao[] = [
  { id: "i1", src: "/img/inspiracoes/esmalte-gel.jpg", w: 900, h: 1200, alt: "Esmaltação em gel nude", categoria: "unhas", profissionalId: "ana-paula", servicoId: "esmaltacao-gel" },
  { id: "i2", src: "/img/inspiracoes/cilios-brasileiro.jpg", w: 800, h: 800, alt: "Volume brasileiro nos cílios", categoria: "cilios", profissionalId: "carla", servicoId: "cilios-volume-brasileiro" },
  { id: "i3", src: "/img/inspiracoes/tranca-boxeadora.jpg", w: 900, h: 1200, alt: "Trança boxeadora", categoria: "trancas", profissionalId: "bianca", servicoId: "tranca-boxeadora" },
  { id: "i4", src: "/img/inspiracoes/design-sobrancelhas.jpg", w: 900, h: 1200, alt: "Design de sobrancelhas", categoria: "sobrancelhas", profissionalId: "carla", servicoId: "design-sobrancelhas" },
  { id: "i5", src: "/img/inspiracoes/alongamento-fibra.jpg", w: 900, h: 1200, alt: "Alongamento em fibra de vidro", categoria: "unhas", profissionalId: "ana-paula", servicoId: "fibra-vidro" },
  { id: "i6", src: "/img/inspiracoes/henna-sobrancelhas.jpg", w: 800, h: 800, alt: "Henna nas sobrancelhas", categoria: "sobrancelhas", profissionalId: "carla", servicoId: "sobrancelhas-henna" },
  { id: "i7", src: "/img/inspiracoes/box-braids.jpg", w: 900, h: 1200, alt: "Box braids", categoria: "trancas", profissionalId: "bianca", servicoId: "tranca-box-braids" },
  { id: "i8", src: "/img/inspiracoes/manicure.jpg", w: 1200, h: 900, alt: "Manicure tradicional", categoria: "unhas", profissionalId: "ana-paula", servicoId: "manicure" },
  { id: "i9", src: "/img/inspiracoes/cilios-mega.jpg", w: 900, h: 1200, alt: "Mega volume nos cílios", categoria: "cilios", profissionalId: "carla", servicoId: "cilios-mega-volume" },
  { id: "i10", src: "/img/inspiracoes/cilios-tufinho.jpg", w: 900, h: 1200, alt: "Cílios tufinho", categoria: "cilios", profissionalId: "carla", servicoId: "cilios-tufinho" },
  { id: "i11", src: "/img/inspiracoes/nago.jpg", w: 900, h: 1200, alt: "Nagô cabeça toda", categoria: "trancas", profissionalId: "bianca", servicoId: "tranca-nago-cabeca" },
  { id: "i12", src: "/img/inspiracoes/banho-gel.jpg", w: 900, h: 1200, alt: "Banho em gel", categoria: "unhas", profissionalId: "ana-paula", servicoId: "banho-gel" },
];
