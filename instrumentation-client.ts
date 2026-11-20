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

html.setAttribute("data-intro", "skip");
html.classList.add("abertura-fim");
