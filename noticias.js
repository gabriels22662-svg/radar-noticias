import { escapar, formatarData, selecionarNoticias, urlSegura } from "./helpers.js";

const SECOES = {
  futebol: { titulo: "Futebol", numero: "01", cor: "var(--futebol)", tinta: "#f0f8f2", descricao: "Brasileirão e cinco ligas europeias. Prioridade para os brasileiros." },
  trending: { titulo: "Trending", numero: "02", cor: "var(--trending)", tinta: "#f0f3ff", descricao: "Seleção editorial de acontecimentos no Brasil e no mundo." },
  geek: { titulo: "Mundo geek", numero: "03", cor: "var(--geek)", tinta: "#f6f1fc", descricao: "Jogos, animes, filmes, séries e os próximos encontros." },
  musica: { titulo: "Música", numero: "05", cor: "#995500", tinta: "#fff8eb", descricao: "Shows, festivais e novidades dos artistas selecionados." },
};

function criarCard(noticia) {
  const link = escapar(urlSegura(noticia.url));
  const publicacao = noticia.publicadaEm
    ? `<time datetime="${escapar(noticia.publicadaEm)}">${formatarData(noticia.publicadaEm)}</time>`
    : "Agenda confirmada";
  return `<article class="noticia" id="${escapar(noticia.id)}">
    <div class="noticia-meta">
      <span class="categoria">${escapar(noticia.assunto)}</span>
      ${noticia.brasil ? '<span class="selo-br" title="Assunto ligado ao Brasil">BR</span>' : ""}
      <span aria-hidden="true">·</span> ${publicacao}
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
  let total = 0;
  for (const chave of config.secoes) {
    if (chave === "musica" && !config.musica.ativa) continue;
    const info = SECOES[chave];
    if (!info) continue;
    const noticias = selecionarNoticias(dados.noticias, chave, config.limitePorSecao, config.minimoBrasil);
    total += noticias.length;
    document.querySelector(`[data-count="${chave}"]`)?.replaceChildren(String(noticias.length));
    const secao = document.createElement("section");
    secao.id = chave;
    secao.className = "secao";
    secao.style.setProperty("--cor", info.cor);
    secao.style.setProperty("--tinta", info.tinta);
    secao.setAttribute("aria-labelledby", `titulo-${chave}`);
    const brasileiras = noticias.filter(n => n.brasil).length;
    secao.innerHTML = `<div class="secao-cabecalho">
        <div class="secao-titulo"><span class="numero-secao">${info.numero}</span><h2 id="titulo-${chave}">${info.titulo}</h2></div>
        <span class="meta-secao">${noticias.length} matérias · ${brasileiras} BR</span>
      </div>
      <p class="escopo">${info.descricao}</p>
      <div class="lista-noticias">${noticias.length ? noticias.map(criarCard).join("") : '<p class="vazio">Ainda não há matérias nesta seção.</p>'}</div>`;
    if (chave === "musica") document.querySelector("#musica").replaceWith(secao);
    else container.append(secao);
  }
  return total;
}
