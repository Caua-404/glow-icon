// Interiores de exemplo em /public/img/estudio.
// Trocar pelos arquivos reais do salão, mantendo o nome, ou ajustando w/h.

export type FotoEstudio = {
  id: string;
  src: string;
  w: number;
  h: number;
  titulo: string;
  alt: string;
};

export const fotosEstudio: FotoEstudio[] = [
  {
    id: "recepcao",
    src: "/img/estudio/estudio-recepcao.jpg",
    w: 1280,
    h: 720,
    titulo: "Recepção",
    alt: "Recepção do estúdio com mesa de carvalho, parede ripada e luz de janela",
  },
  {
    id: "estacao",
    src: "/img/estudio/estudio-estacao.jpg",
    w: 864,
    h: 1152,
    titulo: "Mesa de unhas",
    alt: "Estação de manicure com mesa de carvalho, toalhas de linho e esmaltes",
  },
  {
    id: "sala",
    src: "/img/estudio/estudio-sala.jpg",
    w: 1280,
    h: 720,
    titulo: "Sala de atendimento",
    alt: "Sala com duas mesas de atendimento, pendentes de latão e parede de madeira",
  },
  {
    id: "espera",
    src: "/img/estudio/estudio-espera.jpg",
    w: 1152,
    h: 864,
    titulo: "Espera",
    alt: "Sala de espera com sofá creme, mesa de carvalho e planta",
  },
  {
    id: "esmaltes",
    src: "/img/estudio/estudio-esmaltes.jpg",
    w: 1152,
    h: 864,
    titulo: "Esmaltes",
    alt: "Prateleiras de carvalho com esmaltes em nude, vinho e preto",
  },
  {
    id: "pes",
    src: "/img/estudio/estudio-pes.jpg",
    w: 864,
    h: 1152,
    titulo: "Cantinho dos pés",
    alt: "Poltrona de pedicure, banqueta de carvalho e espelho dourado",
  },
  {
    id: "espelho",
    src: "/img/estudio/estudio-espelho.jpg",
    w: 1024,
    h: 1024,
    titulo: "Espelho",
    alt: "Espelho oval com moldura dourada sobre penteadeira de carvalho",
  },
];
