export const CONFIG = {
  nome: "Radar",
  // Hoje e os dois dias anteriores, no horário de Brasília.
  maxIdadeNoticiaDias: 2,
  limitePorSecao: 5,
  minimoBrasil: 2,
  secoes: ["futebol", "trending", "geek", "musica"],
  ligas: [
    "Brasileirão", "Premier League", "La Liga",
    "Serie A", "Bundesliga", "Ligue 1",
  ],
  musica: {
    ativa: true,
    generos: ["pop", "indie", "rock", "rap"],
    incluirDerivacoes: true,
    artistas: [], // Sem lista fechada por enquanto; refine aqui quando quiser.
    prioridadeRegional: ["Bahia", "Brasil"],
    minimoBrasil: 2,
    priorizarBahiaQuandoHouverFontes: true,
    criterios: ["atualidade", "relevância editorial", "repercussão verificável"],
  },
};
