import { CONFIG } from "./config.js";
import { renderizarNoticias } from "./noticias.js";
import { iniciarCalendario } from "./calendario.js";
import { dataHoje, formatarData } from "./helpers.js";

// O único arquivo trocado na revisão das notícias é dados.json.
async function iniciar() {
  const estado = document.querySelector("#estado-carregamento");
  try {
    const resposta = await fetch("./dados.json", { cache: "no-cache" });
    if (!resposta.ok) throw new Error("Edição indisponível");
    const dados = await resposta.json();
    if (!Array.isArray(dados.noticias) || !Array.isArray(dados.eventos)) throw new Error("Edição inválida");
    const total = renderizarNoticias(dados, CONFIG);
    const agenda = iniciarCalendario(dados.eventos);
    document.querySelector("#data-edicao").textContent = `Edição ${formatarData(dados.edicao, { day: "2-digit", month: "long", year: "numeric" })}`;
    document.querySelector("#resumo-edicao").textContent = `${total} matérias selecionadas. ${agenda.quantidade} datas para acompanhar.`;
    if (dados.edicao < dataHoje()) {
      const aviso = document.querySelector("#aviso-edicao");
      aviso.hidden = false;
      aviso.textContent = `Você está lendo a edição de ${formatarData(dados.edicao, { day: "numeric", month: "long" })}. A data da edição muda quando uma nova seleção é publicada.`;
    }
    estado.hidden = true;
    ativarNavegacao();
    registrarFerramentaAgenda(agenda);
  } catch (erro) {
    estado.textContent = "Não foi possível carregar as notícias. Atualize a página para tentar novamente.";
    console.error("Falha ao carregar a edição:", erro);
  }
}

function ativarNavegacao() {
  if (!("IntersectionObserver" in window)) return;
  const links = [...document.querySelectorAll(".navegacao a")];
  const observador = new IntersectionObserver(entradas => {
    const visivel = entradas.find(e => e.isIntersecting);
    if (!visivel) return;
    for (const link of links) {
      if (link.hash === `#${visivel.target.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }, { rootMargin: "-10% 0px -65% 0px", threshold: 0 });
  document.querySelectorAll(".secao, #agenda, #musica").forEach(e => observador.observe(e));
}

// Integração opcional: navegadores sem WebMCP seguem funcionando normalmente.
function registrarFerramentaAgenda(agenda) {
  const contexto = document.modelContext;
  if (!contexto?.registerTool) return;
  const ciclo = new AbortController();
  window.addEventListener("pagehide", () => ciclo.abort(), { once: true });
  try {
    Promise.resolve(contexto.registerTool({
      name: "consultar_data_agenda",
      title: "Consultar data na agenda",
      description: "Seleciona uma data no calendário visível e retorna os eventos confirmados, sem criar ou alterar eventos.",
      inputSchema: { type: "object", properties: { data: { type: "string", description: "Data AAAA-MM-DD" } }, required: ["data"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      execute(entrada) {
        if (!entrada || typeof entrada.data !== "string" || Object.keys(entrada).some(k => k !== "data")) throw new Error("Informe somente a data.");
        const eventos = agenda.selecionarData(entrada.data);
        document.querySelector("#agenda").scrollIntoView({ block: "start" });
        return { data: entrada.data, eventos };
      },
    }, { signal: ciclo.signal })).catch(() => {});
  } catch { /* A integração opcional não interfere na leitura do site. */ }
}

document.querySelector("#compartilhar").addEventListener("click", async () => {
  const url = new URL(location.href);
  url.hash = ""; url.search = "";
  const retorno = document.querySelector("#retorno-compartilhar");
  try {
    if (navigator.share) {
      await navigator.share({ title: "Radar — Notícias e agenda", url: url.href });
      return;
    }
    await navigator.clipboard.writeText(url.href);
    retorno.textContent = "Link copiado. É só enviar para seus amigos.";
  } catch (erro) {
    if (erro.name === "AbortError") return;
    retorno.textContent = "Copie o endereço na barra do navegador para compartilhar.";
  }
  retorno.hidden = false;
  setTimeout(() => { retorno.hidden = true; }, 6000);
});

iniciar();
