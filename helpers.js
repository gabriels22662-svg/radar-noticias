// Datas sem horário são tratadas como datas de calendário, sem deslocamento de fuso.
export function dataHoje(agora = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(agora);
}

export function formatarData(data, opcoes = { day: "2-digit", month: "short" }) {
  return new Intl.DateTimeFormat("pt-BR", { ...opcoes, timeZone: "UTC" })
    .format(new Date(`${data.slice(0, 10)}T12:00:00Z`));
}

export function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

export function urlSegura(valor) {
  try {
    const url = new URL(valor);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : "#";
  } catch { return "#"; }
}

// A idade usa a publicação real; consultar ou editar uma matéria não renova sua idade.
export function noticiaRecente(noticia, hoje = dataHoje(), maxDias = 2) {
  const publicada = noticia.publicadaEm;
  if (typeof publicada !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(publicada)) return false;
  const instante = Date.parse(`${publicada}T12:00:00Z`);
  if (!Number.isFinite(instante) || new Date(instante).toISOString().slice(0, 10) !== publicada) return false;
  const idade = (Date.parse(`${hoje}T12:00:00Z`) - instante) / 86_400_000;
  return idade >= 0 && idade <= maxDias;
}

// Primeiro garantimos o recorte brasileiro, depois mantemos a ordem editorial.
export function selecionarNoticias(noticias, secao, limite = 5, minimoBrasil = 2) {
  const candidatas = noticias.filter(n => n.secao === secao);
  const brasileiras = candidatas.filter(n => n.brasil).slice(0, minimoBrasil);
  const selecionadas = new Set(brasileiras);
  for (const noticia of candidatas) {
    if (selecionadas.size >= limite) break;
    selecionadas.add(noticia);
  }
  return candidatas.filter(n => selecionadas.has(n)).slice(0, limite);
}

export function eventosFuturos(eventos, hoje = dataHoje()) {
  return eventos.filter(e => (e.fim || e.inicio) >= hoje)
    .sort((a, b) => a.inicio.localeCompare(b.inicio) || (a.horario || "").localeCompare(b.horario || ""));
}

export function eventosNaData(eventos, data) {
  return eventos.filter(e => e.inicio <= data && (e.fim || e.inicio) >= data);
}
