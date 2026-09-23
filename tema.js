// Preferência local: este arquivo roda antes do CSS para evitar flashes de tema.
(() => {
  const chave = "radar-tema";
  const opcoes = ["sistema", "claro", "escuro"];
  const sistema = window.matchMedia("(prefers-color-scheme: dark)");
  let escolha = "sistema";
  try {
    const salva = localStorage.getItem(chave);
    if (opcoes.includes(salva)) escolha = salva;
  } catch { /* A página também funciona com armazenamento bloqueado. */ }

  function aplicar() {
    const tema = escolha === "sistema" ? (sistema.matches ? "escuro" : "claro") : escolha;
    document.documentElement.dataset.tema = tema;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", tema === "escuro" ? "#14171c" : "#fafafa");
  }
  aplicar();
  sistema.addEventListener("change", aplicar);
  document.addEventListener("DOMContentLoaded", () => {
    const seletor = document.querySelector("#tema");
    seletor.value = escolha;
    seletor.addEventListener("change", () => {
      escolha = opcoes.includes(seletor.value) ? seletor.value : "sistema";
      aplicar();
      try { localStorage.setItem(chave, escolha); } catch { /* Sem persistência. */ }
    });
  });
})();
