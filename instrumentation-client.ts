const html = document.documentElement;

try {
  let tema = localStorage.getItem("glow-tema");
  if (!tema) {
    tema = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "escuro"
      : "claro";
  }
  html.classList.toggle("dark", tema === "escuro");
  const polish = localStorage.getItem("glow-polish");
  if (polish && /^(nude|vermelho|vinho|rosa|preto)$/.test(polish)) {
    html.setAttribute("data-polish", polish);
  }
} catch {
  /* armazenamento bloqueado: segue o tema claro do HTML */
}

const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const forcarAbertura = /(?:\?|&)abertura=1(?:&|$)/.test(location.search);
const naHome = location.pathname === "/" || location.pathname === "";

let jaViuAbertura = false;
try {
  jaViuAbertura = !forcarAbertura && !!sessionStorage.getItem("glow-intro");
} catch {
  /* sessionStorage bloqueado: a abertura toca nesta visita */
}

if (!naHome || reduzMovimento || jaViuAbertura) {
  html.setAttribute("data-intro", "skip");
  html.classList.add("abertura-fim");
} else {
  html.setAttribute("data-intro", "wait");
  window.setTimeout(() => {
    if (html.getAttribute("data-intro") === "wait") {
      html.setAttribute("data-intro", "play");
    }
  }, 1200);
}
