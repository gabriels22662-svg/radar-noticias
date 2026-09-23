import { escapar, formatarData, noticiaRecente, selecionarNoticias, urlSegura } from "./helpers.js";

const SECOES = {
  futebol: { titulo: "Futebol", cor: "var(--futebol)" },
  trending: { titulo: "Trending", cor: "var(--trending)" },
  geek: { titulo: "Mundo geek", cor: "var(--geek)" },
  musica: { titulo: "Música", cor: "var(--musica)" },
};

function criarCard(noticia) {
  const link = escapar(urlSegura(noticia.url));
  const publicacao = noticia.publicadaEm
    ? `<time datetime="${escapar(noticia.publicadaEm)}">${formatarData(noticia.publicadaEm)}</time>`
    : "Agenda confirmada";
  const atualizacao = noticia.atualizadaEm && noticia.atualizadaEm.slice(0, 10) !== noticia.publicadaEm
    ? ` · Atualizada em <time datetime="${escapar(noticia.atualizadaEm)}">${formatarData(noticia.atualizadaEm)}</time>`
    : "";
  return `<article class="noticia" id="${escapar(noticia.id)}">
    <div class="noticia-meta">
      <span class="categoria">${escapar(noticia.assunto)}</span>
      <span aria-hidden="true">·</span> ${publicacao}${atualizacao}
    </div>
    <h3><a href="${link}" target="_blank" rel="noopener noreferrer">${escapar(noticia.titulo)}</a></h3>
    <p>${escapar(noticia.resumo)}</p>
    <div class="noticia-rodape">
      <span>${escapar(noticia.fonte)} · ${escapar(noticia.idioma || "PT")}</span>
      <a class="ler-materia" href="${link}" target="_blank" rel="noopener noreferrer" aria-label="Ler matéria: ${escapar(noticia.titulo)} (abre em outra aba)">Ler matéria <span aria-hidden="true">&nbsp;↗</span></a>
    </div>
  </article>`;
}

export function renderizarNoticias(dados, config) {
  const container = document.querySelector("#secoes-noticias");
  container.replaceChildren();
  const recentes = dados.noticias.filter(n => noticiaRecente(n, undefined, config.maxIdadeNoticiaDias));
  const linkMusica = document.querySelector('.navegacao a[href="#musica"]');
  if (linkMusica) linkMusica.hidden = !config.musica.ativa;
  let total = 0;
  for (const chave of config.secoes) {
    if (chave === "musica" && !config.musica.ativa) continue;
    const info = SECOES[chave];
    if (!info) continue;
    const noticias = selecionarNoticias(recentes, chave, config.limitePorSecao, config.minimoBrasil);
    total += noticias.length;
    const secao = document.createElement("section");
    secao.id = chave;
    secao.className = "secao";
    secao.style.setProperty("--cor", info.cor);
    secao.setAttribute("aria-labelledby", `titulo-${chave}`);
    secao.innerHTML = `<div class="secao-cabecalho">
        <h2 id="titulo-${chave}">${info.titulo}</h2>
      </div>
      <div class="lista-noticias">${noticias.length ? noticias.map(criarCard).join("") : '<p class="vazio">Nenhuma notícia recente por aqui. Volte em breve.</p>'}</div>`;
    container.append(secao);
  }
  return total;
}
