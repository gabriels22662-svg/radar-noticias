# Radar · Notícias e agenda

Projeto de estudo com HTML, CSS e JavaScript: notícias por seção e um calendário de acontecimentos. O conteúdo fica em um arquivo JSON, separado da interface.

[Abrir o Radar publicado](https://radar-noticias-gs.silvagabriel17santos.chatgpt.site)

## O que o projeto faz

- Exibe até cinco matérias por seção ativa, com pelo menos duas relacionadas diretamente ao Brasil.
- Organiza futebol, trending e geek; música permanece pendente até a configuração dos artistas.
- Mostra resumos próprios, datas e links para as fontes.
- Permite navegar pelo calendário e consultar acontecimentos de um dia.
- Adapta o layout ao celular e oferece compartilhamento do endereço da página.

O navegador lê `dados.json` ao abrir a página. O código não pesquisa notícias nem atualiza esse arquivo sozinho. Este repositório e o site publicado têm atualizações independentes; enviar um commit ao GitHub não atualiza automaticamente o site hospedado no endereço acima.

## Baixar e abrir no VS Code

Com Git instalado, execute no terminal, na pasta em que deseja guardar o projeto:

```sh
git clone https://github.com/gabriels22662-svg/radar-noticias.git
cd radar-noticias
```

No VS Code, use **Arquivo → Abrir Pasta** e selecione `radar-noticias`. Se já tiver clonado este repositório, use a pasta existente e execute `git pull --ff-only` antes de editar. Se houver alterações locais, revise e salve essas alterações em um commit antes de atualizar; não descarte seu trabalho para resolver um conflito.

Também é possível baixar pelo botão **Code → Download ZIP** no GitHub. Extraia o ZIP antes de abrir a pasta. Essa opção não inclui o histórico Git.

## Executar no computador

É necessário Python 3 para o servidor local. No terminal do VS Code, dentro da pasta que contém `index.html`, execute:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

No Windows, se o comando `python` não for reconhecido e o Python estiver instalado, tente:

```sh
py -m http.server 8000 --bind 127.0.0.1
```

Abra **http://localhost:8000** no navegador. Salve uma alteração no VS Code e recarregue a página para vê-la. Mantenha o terminal aberto; use **Ctrl+C** para parar o servidor.

Não abra `index.html` por duplo clique: os módulos JavaScript e o carregamento do JSON precisam de um servidor HTTP. Não é necessário instalar pacotes com `npm install`.

## Mapa dos arquivos

Os arquivos do site ficam na raiz deste repositório. Não é necessário criar outra pasta `dist`.

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura da página, seções e navegação |
| `styles.css` | Cores, tamanhos, espaçamento e adaptação ao celular |
| `config.js` | Limites por seção, ligas e configuração de música |
| `dados.json` | Notícias, fontes, datas e acontecimentos do calendário |
| `app.js` | Carregamento dos dados, início da página e compartilhamento |
| `noticias.js` | Montagem dos cartões e seleção de matérias |
| `calendario.js` | Navegação entre meses e seleção de dias |
| `helpers.js` | Funções reutilizáveis para datas, seleção e segurança de links |
| `scripts/verificar.mjs` | Validação dos dados, sintaxe e referências locais |
| `package.json` | Configuração dos módulos e comando `npm run check` |
| `EDITORIAL.md` | Regras de seleção e atualização do conteúdo |
| `.gitignore` | Arquivos locais que não devem entrar nos commits |
| `.nojekyll` | Compatibilidade com publicação estática pelo GitHub Pages |

## Validar antes de enviar

Com Node.js instalado, execute na raiz do projeto:

```sh
npm run check
```

Ou execute o mesmo verificador diretamente:

```sh
node scripts/verificar.mjs
```

O verificador confere os limites por seção, o recorte brasileiro, IDs repetidos, datas, formato dos links, alguns casos de segurança e calendário, sintaxe JavaScript e referências locais do HTML. Ele não acessa as fontes nem comprova a veracidade das notícias; essa conferência faz parte da pesquisa editorial.

O campo `private: true` do `package.json` evita publicação acidental como pacote npm. Ele não muda a visibilidade pública deste repositório.

## Enviar suas próximas alterações

Depois de editar, testar no navegador e executar a validação:

```sh
git status
git diff
git add README.md
git diff --cached
git commit -m "docs: melhorar instruções do projeto"
git push origin main
```

O exemplo envia uma alteração no README. Troque `README.md` pelos arquivos que você realmente editou e escreva uma mensagem que explique a mudança. `git diff --cached` mostra exatamente o conteúdo preparado para o commit. Não envie senhas, tokens nem arquivos `.env`.

Se o envio for recusado porque existem commits novos no GitHub, atualize sua cópia e resolva eventuais conflitos antes de tentar novamente. Não use `git push --force` para contornar esse aviso.

## Atualizar notícias e estudar o código

Leia `EDITORIAL.md` antes de mudar `dados.json`. Preserve as datas reais das fontes; a data da edição não deve ser alterada apenas para parecer recente. A edição copiada do Radar para este repositório em 22/09/2026 contém 15 notícias e 10 eventos.

Uma sequência de estudo possível:

1. Altere um título em `index.html` e observe a estrutura HTML.
2. Ajuste uma cor em `styles.css` e teste em uma janela estreita.
3. Leia como `app.js` carrega o JSON com `fetch`.
4. Acompanhe como `noticias.js` transforma os dados em cartões.
5. Estude as funções de datas em `helpers.js` e seu uso no calendário.
6. Execute o verificador antes de cada commit.

As matérias e os links têm suas próprias fontes. O projeto utiliza resumos breves e não inclui a reprodução integral de artigos ou letras de músicas.
