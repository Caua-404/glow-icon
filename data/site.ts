/** Posicionamento da marca: aparece no hero e no rodapé. */
export const posicionamento = "Unhas com assinatura.";

/** Conta de cliente fica pronta no código, mas desligada no site. */
export const CONTA_HABILITADA = false;

export const profissional = {
  nome: "Eduarda Vieira",
  anosExperiencia: 9,
};

export const confianca = {
  nota: "4,9",
  cidade: "Canaã dos Carajás - PA",
};

export const contato = {
  whatsapp: "5594984421049",
  whatsappExibido: "(94) 98442-1049",
  instagram: "@dudanail2023",
  instagramUrl: "https://www.instagram.com/dudanail2023/",
};

export const horarios = [
  { dia: "Segunda a sábado", horas: "08:00 às 18:00" },
  { dia: "Domingo", horas: "Fechado" },
];

export function linkWhatsapp(mensagem: string): string {
  const texto = encodeURIComponent(mensagem);
  return `https://api.whatsapp.com/send/?phone=${contato.whatsapp}&text=${texto}&type=phone_number&app_absent=0`;
}

export const links = [
  { href: "#servicos", rotulo: "Serviços" },
  { href: "#equipe", rotulo: "Equipe" },
  { href: "#estudio", rotulo: "Estúdio" },
  { href: "#inspiracoes", rotulo: "Inspirações" },
  { href: "#como-funciona", rotulo: "Como funciona" },
  { href: "#contato", rotulo: "Contato" },
];
