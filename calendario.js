import { dataHoje, escapar, eventosFuturos, eventosNaData, formatarData, urlSegura } from "./helpers.js";

export function iniciarCalendario(eventos) {
  let hoje = dataHoje();
  let lista = eventosFuturos(eventos, hoje);
  let [ano, mes] = hoje.split("-").map(Number);
  mes -= 1;
  let selecionada = null;
  const calendario = document.querySelector("#calendario");
  const listaDOM = document.querySelector("#proximos-eventos");
  const limpar = document.querySelector("#limpar-data");
  const titulo = document.querySelector("#titulo-eventos");

  function renderizarEventos() {
    const visiveis = selecionada ? eventosNaData(lista, selecionada) : lista;
    titulo.textContent = selecionada ? `Em ${formatarData(selecionada)}` : "Próximos acontecimentos";
    limpar.hidden = !selecionada;
    listaDOM.innerHTML = visiveis.length ? visiveis.map(e => {
      const inicio = e.inicio < hoje ? hoje : e.inicio;
      const periodo = e.fim && e.fim !== e.inicio ? `Até ${formatarData(e.fim)} · ` : "";
      return `<article class="evento">
        <div class="evento-data" aria-hidden="true"><strong>${inicio.slice(8)}</strong>${formatarData(inicio, { month: "short" }).replace(".", "")}</div>
        <div class="evento-info">
          <span class="evento-tag">${escapar(e.secao)}${e.brasil ? " · Brasil" : " · Internacional"}</span>
          <h3><a href="${escapar(urlSegura(e.url))}" target="_blank" rel="noopener noreferrer">${escapar(e.titulo)} <span aria-hidden="true">↗</span></a></h3>
          <p><time datetime="${escapar(e.inicio)}">${formatarData(e.inicio)}</time> · ${periodo}${escapar(e.horario || "Horário não divulgado")}</p>
          <p>${escapar(e.local)}</p>
          ${e.observacao ? `<p>${escapar(e.observacao)}</p>` : ""}
        </div>
      </article>`;
    }).join("") : '<p class="vazio">Nenhum acontecimento confirmado para esta data.</p>';
  }

  function renderizarMes() {
    const nomeMes = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(ano, mes, 1)));
    const primeiro = (new Date(Date.UTC(ano, mes, 1)).getUTCDay() + 6) % 7;
    const dias = new Date(Date.UTC(ano, mes + 1, 0)).getUTCDate();
    let celulas = Array.from({ length: primeiro }, () => "<td></td>");
    for (let dia = 1; dia <= dias; dia++) {
      const data = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      const quantidade = eventosNaData(lista, data).length;
      const classe = `dia${quantidade ? " dia-evento" : ""}${data === hoje ? " dia-hoje" : ""}`;
      const descricao = `${formatarData(data, { day: "numeric", month: "long", year: "numeric" })}${data === hoje ? ", hoje" : ""}, ${quantidade} eventos`;
      celulas.push(`<td><button type="button" class="${classe}" data-dia="${data}" aria-label="${escapar(descricao)}" aria-pressed="${selecionada === data}">${dia}</button></td>`);
    }
    while (celulas.length % 7) celulas.push("<td></td>");
    const linhas = [];
    for (let i = 0; i < celulas.length; i += 7) linhas.push(`<tr>${celulas.slice(i, i + 7).join("")}</tr>`);
    calendario.innerHTML = `<div class="mes-nav"><button type="button" data-mes="-1" aria-label="Mês anterior">‹</button><h3 aria-live="polite">${nomeMes}</h3><button type="button" data-mes="1" aria-label="Próximo mês">›</button></div>
      <table class="mes-grade" aria-label="Calendário de ${nomeMes}"><thead><tr>${["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(d => `<th scope="col">${d}</th>`).join("")}</tr></thead><tbody>${linhas.join("")}</tbody></table>
      <p class="legenda-calendario">Dias em azul têm eventos. Toque para consultar.</p>`;
  }

  function selecionarData(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || !Number.isFinite(Date.parse(`${data}T12:00:00Z`))) throw new Error("Use uma data válida no formato AAAA-MM-DD.");
    const d = new Date(`${data}T12:00:00Z`);
    if (d.toISOString().slice(0, 10) !== data) throw new Error("Essa data não existe.");
    selecionada = data;
    ano = d.getUTCFullYear(); mes = d.getUTCMonth();
    renderizarMes(); renderizarEventos();
    return eventosNaData(lista, data).map(({ id, titulo, inicio, url }) => ({ id, titulo, inicio, url }));
  }

  calendario.addEventListener("click", e => {
    const botao = e.target.closest("button");
    if (!botao) return;
    if (botao.dataset.mes) {
      const direcao = botao.dataset.mes;
      const nova = new Date(Date.UTC(ano, mes + Number(direcao), 1));
      ano = nova.getUTCFullYear(); mes = nova.getUTCMonth();
      renderizarMes();
      calendario.querySelector(`[data-mes="${direcao}"]`).focus();
    } else if (botao.dataset.dia) {
      const data = botao.dataset.dia;
      selecionarData(data);
      calendario.querySelector(`[data-dia="${data}"]`).focus();
    }
  });
  limpar.addEventListener("click", () => {
    selecionada = null;
    renderizarMes(); renderizarEventos();
    calendario.querySelector("button").focus();
  });
  // Se a página atravessar a meia-noite aberta, a agenda retira datas encerradas.
  setInterval(() => {
    const novaData = dataHoje();
    if (novaData !== hoje) {
      hoje = novaData; lista = eventosFuturos(eventos, hoje);
      renderizarMes(); renderizarEventos();
    }
  }, 60_000);
  renderizarMes(); renderizarEventos();
  return { selecionarData, quantidade: lista.length };
}
