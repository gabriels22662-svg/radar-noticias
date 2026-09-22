# Radar · Notícias e agenda

Projeto de estudo com HTML, CSS e JavaScript: notícias por seção e um calendário de acontecimentos. O conteúdo fica em um arquivo JSON, separado da interface.

[Abrir o Radar publicado](https://radar-noticias-gs.silvagabriel17santos.chatgpt.site)

## O que o projeto faz

- Exibe até cinco matérias por seção ativa, com pelo menos duas relacionadas diretamente ao Brasil.
- Organiza futebol, trending e geek; música permanece pendente até a configuração dos artistas.
- Mostra resumos próprios, datas e links para as fontes.
- Permite navegar pelo calendário e consultar acontecimentos de um dia.
- Adapta o layout ao celular e oferece compartilhamento do endereço da página.

O navegador lê `dados.json` ao abrir a página. O código não pesquisa notícias nem atualiza esse arquivo sozinho. A tarefa recorrente do Radar no ChatGPT foi configurada para, após publicar uma edição com sucesso, copiar suas notícias e agenda para `dados.json` neste GitHub. Essa sincronização segue do site para o GitHub; enviar um commit ao GitHub não atualiza automaticamente o site hospedado no endereço acima.

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


## Como funciona a sincronização automática

Configurada em 22/09/2026 na tarefa existente **Atualizar o Radar**, programada diariamente às 8h no horário da Bahia/Brasília. A execução pode começar depois desse horário e levar alguns minutos.

1. A tarefa consulta fontes, prepara a edição e valida os dados.
2. Publica a edição no projeto existente em Sites.
3. Confirma que a publicação terminou com sucesso.
4. Copia o conteúdo exato de `dist/dados.json` dessa versão para `dados.json` na raiz deste repositório.
5. Valida a compatibilidade com o código atual do GitHub.
6. Se houver mudança, registra um commit na branch `main` e confirma o conteúdo enviado. Se os arquivos forem iguais, não cria um commit vazio.

A tarefa usa as conexões autorizadas do ChatGPT com Sites e GitHub. Não é um workflow do GitHub Actions e não depende de o VS Code ou seu computador estarem abertos.

**Escopo:** apenas notícias e agenda, armazenadas em `dados.json`. A rotina não substitui seu HTML, CSS, JavaScript, README nem configurações. Alterar cores no GitHub não altera o site publicado; alterar `config.js` no GitHub também não configura automaticamente a versão em Sites. Para publicar essas mudanças, é necessário solicitar uma atualização do site.

O arquivo `dados.json` da `main` recebe as edições automáticas. Faça experiências com notícias em uma branch de estudo para mantê-las separadas. Se alguém editar esse arquivo enquanto a rotina estiver trabalhando, ela deve preservar a alteração concorrente e informar o conflito. Falhas de acesso ou validação devem ser relatadas, sem envio forçado nem exclusão de histórico.

## Entendendo Git, GitHub e sua cópia

| Termo | Significado neste projeto |
| --- | --- |
| Git | Programa que registra o histórico dos arquivos |
| GitHub | Serviço que guarda a cópia online do repositório |
| Repositório | Pasta do projeto acompanhada pelo Git, com seu histórico |
| Commit | Registro de uma alteração, com uma mensagem e um identificador |
| Branch | Linha de trabalho; `main` é a principal |
| Clone | Cópia do repositório que inclui o histórico e a ligação com o GitHub |
| Pull | Receber e integrar alterações do GitHub na sua cópia |
| Push | Enviar commits da sua cópia para o GitHub |
| Origin | Nome que o Git dá, por padrão, ao endereço de onde você clonou |

A sincronização automática chega ao GitHub. Para atualizar a pasta no seu computador, você executa `git pull`. Uma pasta extraída de ZIP não é um clone e não permite esse fluxo diretamente.

## Receber atualizações no VS Code: passo a passo

### Se você ainda não clonou

1. Abra o VS Code.
2. Use **Terminal → Novo Terminal**.
3. Execute `git --version`. Se aparecer uma versão, o Git está disponível. Se o comando não for reconhecido, instale o Git e reinicie o VS Code antes de continuar.
4. Use **Arquivo → Abrir Pasta** para abrir a pasta em que quer guardar seus projetos. Evite clonar dentro de outra cópia de `radar-noticias`.
5. No terminal, execute:

```sh
git clone https://github.com/gabriels22662-svg/radar-noticias.git
```

6. Abra a nova pasta `radar-noticias` pelo menu **Arquivo → Abrir Pasta**.

Faça isso uma vez. Se você já tem uma cópia clonada, use essa cópia. Se usava um ZIP e fez alterações, guarde a pasta antiga; clone em outro local e depois transfira apenas suas alterações, revisando-as.

### Antes de começar uma sessão de estudo

No terminal aberto dentro de `radar-noticias`, execute:

```sh
git status
```

O resultado informa a branch atual e se existem arquivos alterados. Quando aparecer `nothing to commit, working tree clean`, seus arquivos estão iguais ao último commit local.

Com a cópia limpa, vá para a branch principal e receba as atualizações:

```sh
git switch main
git pull --ff-only origin main
```

- `git switch main` seleciona a linha principal do projeto.
- `origin` é o endereço do seu repositório no GitHub.
- `main` é a branch que recebe as notícias.
- `--ff-only` permite uma atualização direta e interrompe se for necessário conciliar históricos diferentes. Não apaga seu trabalho.
- `Already up to date.` significa que não há novidades para baixar.

Se `git status` mostrar alterações, salve e revise seu trabalho antes de atualizar. Se o pull informar conflito ou histórico divergente, não use comandos de descarte nem envio forçado para contornar o aviso; examine a mensagem antes de continuar.

Depois, para validar e abrir o site localmente:

```sh
npm run check
python -m http.server 8000 --bind 127.0.0.1
```

O primeiro comando requer Node.js/npm; o segundo requer Python 3. No Windows, `py` pode substituir `python`. Abra **http://localhost:8000** e recarregue a página depois de salvar alterações.

### Criar uma branch para experimentar

Depois de atualizar a `main`, você pode separar uma experiência:

```sh
git switch -c estudo/cores
```

Esse comando cria e seleciona a branch `estudo/cores`. Edite, por exemplo, `styles.css`; teste no navegador e então registre a mudança:

```sh
git diff
git add styles.css
git diff --cached
git commit -m "style: experimentar novas cores"
git push -u origin estudo/cores
```

O commit salva a mudança no histórico local; o push envia essa branch ao GitHub. O nome do arquivo deve corresponder ao que você realmente alterou. O GitHub pode pedir autenticação no primeiro envio; faça isso pelo fluxo de login e nunca cole tokens no código.

Essa branch é sua experiência: ela não é incorporada automaticamente à `main` nem ao site publicado. Cada nova experiência pode usar um nome de branch diferente.

## Como conferir que a sincronização ocorreu

Abra este repositório no GitHub e veja o histórico de commits da `main`. Quando houver conteúdo novo sincronizado, a mensagem será semelhante a:

```text
chore: sincronizar notícias e agenda de AAAA-MM-DD
```

Abra o commit para ver as linhas alteradas em `dados.json`. O relatório da tarefa também deve distinguir a publicação no site do envio ao GitHub. A configuração já está ativa; a etapa automática completa será exercitada nas próximas execuções da tarefa.
