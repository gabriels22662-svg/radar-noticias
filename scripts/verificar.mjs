import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { readFile, access } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { CONFIG } from "../config.js";
import { dataHoje, selecionarNoticias, eventosNaData, eventosFuturos, urlSegura, escapar } from "../helpers.js";

const dados = JSON.parse(await readFile(new URL("../dados.json", import.meta.url), "utf8"));
const ids = new Set();
const dataValida = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
assert(dataValida(dados.edicao), "Data da edição inválida");
assert(dados.edicao <= dataHoje(), "A edição não pode estar no futuro");
for (const n of dados.noticias) {
  assert(!ids.has(n.id), `ID repetido: ${n.id}`); ids.add(n.id);
  for (const chave of ["titulo", "resumo", "fonte", "url", "verificadaEm", "secao", "assunto"]) assert(n[chave], `${n.id}: ${chave} ausente`);
  assert(CONFIG.secoes.includes(n.secao), `Seção inválida: ${n.secao}`);
  assert.equal(typeof n.brasil, "boolean");
  assert(urlSegura(n.url) !== "#", `URL inválida: ${n.id}`);
  if (n.publicadaEm) assert(dataValida(n.publicadaEm) && n.publicadaEm <= dados.edicao, `Data de publicação inválida: ${n.id}`);
  assert(Number.isFinite(Date.parse(n.verificadaEm)), `Data da checagem inválida: ${n.id}`);
  assert(n.resumo.split(/\s+/).length <= 65, `Resumo longo demais: ${n.id}`);
}
for (const secao of CONFIG.secoes) {
  if (secao === "musica" && !CONFIG.musica.ativa) continue;
  const lista = dados.noticias.filter(n => n.secao === secao);
  assert(lista.length <= CONFIG.limitePorSecao, `Mais de 5 notícias em ${secao}`);
  assert(lista.filter(n => n.brasil).length >= CONFIG.minimoBrasil, `Faltam matérias brasileiras em ${secao}`);
  assert.equal(selecionarNoticias(dados.noticias, secao).length, lista.length);
}
const idsEventos = new Set();
for (const e of dados.eventos) {
  assert(!idsEventos.has(e.id), `Evento duplicado: ${e.id}`); idsEventos.add(e.id);
  assert(dataValida(e.inicio) && dataValida(e.fim || e.inicio), `Data inválida no evento ${e.id}`);
  assert((e.fim || e.inicio) >= e.inicio, `Intervalo invertido em ${e.id}`);
  assert((e.fim || e.inicio) >= dados.edicao, `Evento encerrado: ${e.id}`);
  assert(urlSegura(e.url) !== "#", `Fonte inválida: ${e.id}`);
  assert(e.fonte && e.confirmadoEm && e.local, `Metadados ausentes: ${e.id}`);
}
// Fronteiras relevantes: fuso brasileiro, feiras de vários dias e links não confiáveis.
assert.equal(dataHoje(new Date("2026-09-22T01:00:00Z")), "2026-09-21");
assert.equal(urlSegura("javascript:alert(1)"), "#");
assert(!escapar('<script>"').includes("<script>"));
const feira = [{ id: "feira", inicio: "2026-10-09", fim: "2026-10-12" }];
assert.equal(eventosNaData(feira, "2026-10-11").length, 1);
assert.equal(eventosFuturos(feira, "2026-10-13").length, 0);

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
for (const nome of ["config.js", "app.js", "calendario.js", "noticias.js", "helpers.js"]) {
  const arquivo = new URL(`../${nome}`, import.meta.url);
  execFileSync(process.execPath, ["--check", fileURLToPath(arquivo)]);
}
for (const [, caminho] of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) await access(new URL(`../${caminho}`, import.meta.url));
console.log(`Validação concluída: ${dados.noticias.length} notícias; mínimo de 2 BR por seção ativa; ${dados.eventos.length} eventos; datas, módulos e referências locais válidos.`);
