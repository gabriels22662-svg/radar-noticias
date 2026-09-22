# Manutenção editorial do Radar

Este arquivo documenta a seleção de conteúdo da cópia de estudo no GitHub. Aqui os arquivos públicos estão na raiz: `config.js` e `dados.json`. No projeto hospedado em Sites, esses arquivos ficam em `dist/`. As duas cópias não são sincronizadas automaticamente.

## Rotina da edição

1. Leia a versão atual de `config.js`, deste documento e de `dados.json`. Preserve preferências e alterações de interface existentes.
2. Pesquise fontes primárias, veículos identificados e publicações especializadas confiáveis. Leia a página original para confirmar o fato, sua data e o contexto antes de escrever um resumo.
3. Mantenha até cinco notícias por seção ativa, com pelo menos duas relacionadas diretamente ao Brasil. `brasil: true` significa evento no Brasil, pessoa ou obra brasileira ou impacto direto comprovado no país. Uma tradução para português não basta.
4. Futebol: priorize clubes brasileiros e faça rodízio entre Brasileirão, Premier League, La Liga, Serie A italiana, Bundesliga e Ligue 1. Não inclua previsões de apostas, odds, promoções ou links para apostar.
5. Trending: selecione acontecimentos de interesse público de assuntos variados, no Brasil e no mundo. Não declare que algo é o mais buscado sem dados que sustentem isso. Notícias políticas devem ser informativas e equilibradas.
6. Geek: cubra jogos, animes, filmes, séries, lançamentos, episódios, temporadas e eventos. Evite spoilers e não presuma disponibilidade no Brasil a partir de um catálogo estrangeiro. Não inclua material gráfico ou conteúdo adulto explícito.
7. Música permanece pendente enquanto `CONFIG.musica.ativa` for `false`. Quando ativada, siga exclusivamente os artistas, bandas e demais preferências configurados. Não reproduza letras.
8. Escreva títulos e resumos próprios e breves, com até 65 palavras por resumo. Inclua fonte, idioma, link HTTPS direto e data real de publicação. Para uma agenda oficial sem data de publicação, use `publicadaEm: null`. Não confunda publicação, atualização da fonte e data da consulta.
9. Mantenha no calendário eventos futuros ou em andamento, com datas confirmadas por fontes identificadas. `fim` é inclusivo; horários devem ser confirmados e informados em Brasília. Quando desconhecidos, use `horario: null`. Remova eventos cancelados e encerrados ao preparar uma nova edição.
10. Atualize `edicao`, `atualizadaEm` e as datas de verificação somente após concluir a pesquisa correspondente. Não invente notícias para completar a quantidade. Preserve matérias ainda relevantes com suas datas originais quando não houver novidades suficientes.
11. Execute `npm run check`. Se faltarem fontes para cumprir o mínimo brasileiro, preserve a última edição válida e registre a limitação.
12. Revise o diff e envie os arquivos alterados ao GitHub. Para atualizar também o site hospedado em Sites, use o projeto existente, preserve seu acesso público e confirme o sucesso da publicação. O commit neste repositório não executa essa publicação.

## Estrutura dos dados

- Edição: `edicao` em `AAAA-MM-DD`, `atualizadaEm` com data, hora e fuso, além das listas `noticias` e `eventos`.
- Notícia: `id`, `secao` (`futebol`, `trending`, `geek` ou `musica`), `assunto`, `brasil` booleano, `publicadaEm` em `AAAA-MM-DD` ou `null`, `atualizadaEm` opcional, `titulo`, `resumo`, `fonte`, `idioma`, `url` e `verificadaEm` com data, hora e fuso.
- Evento: `id`, `titulo`, `secao` (`Futebol`, `Trending`, `Geek` ou `Música`), `brasil`, `inicio`, `fim` inclusivo, `horario` ou `null`, `local`, `observacao` opcional, `url`, `fonte` e `confirmadoEm`.

O verificador testa a estrutura dos dados e algumas regras do programa. Ele não confirma os fatos nem a disponibilidade dos links externos. A interface não precisa de credenciais; nunca inclua tokens ou informações pessoais nos arquivos públicos.
