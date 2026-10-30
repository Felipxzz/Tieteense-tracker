# Ponto Certo

Aplicativo para consultar **horários e itinerários de ônibus em Tietê (SP)**, com login e linhas favoritas salvas em banco de dados. Projeto do TCC do curso técnico em Administração (URE-Itu, 2026).

## Dados

Só são usados dados oficiais de Tietê. No momento, o projeto traz **uma linha com itinerário completo**: a **6109** (Cesário Lange / Tietê via Cerquilho), extraída da página de horários e itinerários da EMTU (consulta de 29/10/2026). Ela está em `src/data/linhas.json`, com o link da fonte em cada linha.

O que ainda falta:

- **Linhas urbanas de Tietê.** A página de horários da Prefeitura de Tietê bloqueia acesso automatizado, então não foi possível consultá-la. Para adicionar essas linhas, envie a tabela de horários ou o PDF da prefeitura, ou cadastre-as manualmente em `linhas.json`, citando a fonte.
- **Coordenadas das paradas.** A fonte oficial não traz latitude e longitude. Enquanto isso, o mapa mostra o centro de Tietê, sem marcadores. Os campos `lat` e `lng` são opcionais em cada parada: quando preenchidos, os marcadores aparecem.
- **Localização em tempo real.** Não há fonte de GPS autorizada. O app mostra "Localização indisponível".

## Funcionalidades

- **Login** com e-mail e senha. Sessão em cookie `HttpOnly`, válida por 7 dias. Rotas internas exigem login.
- **Linhas e itinerários:** busca, sentido da viagem (ida/volta), paradas em ordem, tarifa, tempo de percurso, tabela de horários e próximas saídas do dia.
- **Favoritos salvos no banco**, vinculados à conta. Se a gravação falhar, a alteração é desfeita e aparece uma mensagem.
- **Início, Localização, Sobre o projeto** e tema claro/escuro.

## Tecnologias

- **Front-end:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Leaflet + OpenStreetMap, Lucide, Zod.
- **Back-end:** Funções serverless da Vercel (pasta `api/`), PostgreSQL com a biblioteca `pg`.
- **Segurança:** senhas com `scrypt` (módulo nativo do Node, sem dependência extra), salt aleatório, comparação em tempo constante, tokens de sessão aleatórios de 256 bits guardados só como hash SHA-256 no banco.

## Passo a passo: banco de dados (Neon)

1. Crie uma conta em [neon.tech](https://neon.tech) e um projeto novo.
2. Copie a **connection string** (ela começa com `postgresql://` e contém `sslmode=require`).
3. Crie o arquivo `.env.local` na raiz do projeto, a partir de `.env.example`:

   ```bash
   DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=require
   ```

4. Crie as tabelas:

   ```bash
   npm run db:migrar
   ```

5. Crie o primeiro usuário. A senha vai por variável de ambiente, para não ficar no histórico do terminal:

   ```bash
   SENHA='uma-senha-com-8-ou-mais-caracteres' npm run criar-usuario -- --email voce@exemplo.com --nome "Seu Nome"
   ```

Não há cadastro público. Novas contas são criadas pelo comando acima.

## Como rodar localmente

Requisitos: Node.js 18 ou superior.

```bash
npm install
npm run dev:vercel   # recomendado: site + API (login e favoritos)
```

`npm run dev:vercel` executa `npx vercel dev`, que serve o site e as rotas `/api` juntos. Na primeira execução, o Vercel CLI pede para vincular o projeto. Para só ver a interface, sem login, use `npm run dev`. Nesse modo, a tela de login mostrará "API indisponível".

Outros comandos:

```bash
npm run typecheck    # verificação TypeScript (inclui api/ e server/)
npm test             # testes de horários, dados, validação e segurança
npm run build        # checagem de tipos + build de produção
```

## Publicar no GitHub

```bash
git init
git add .
git commit -m "Ponto Certo: protótipo com login e banco"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/ponto-certo.git
git push -u origin main
```

O `.gitignore` exclui `node_modules`, `dist`, `.env` e `.env.local`. Nenhuma credencial deve ir para o repositório.

## Publicar na Vercel

1. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório do GitHub.
2. Confirme: Framework Preset **Vite**, Build Command `npm run build`, Output Directory `dist`.
3. Em **Settings → Environment Variables**, cadastre `DATABASE_URL` com a connection string do Neon (para Production e Preview).
4. Clique em **Deploy**.
5. Depois do primeiro deploy, rode `npm run db:migrar` e `npm run criar-usuario` apontando para o mesmo banco. Use um `.env.local` temporário com a `DATABASE_URL` de produção e apague o arquivo em seguida.

O `vercel.json` manda as rotas do site para `index.html`, mas deixa `/api/*` para as funções.

## Testes

Os testes em `tests/` cobrem:

- próximas saídas e tipo de dia (dia útil, sábado, domingo);
- validação dos dados de Tietê (formato dos horários e das linhas);
- hash de senha, tokens e leitura de cookie.

Rode com `npm test`. Estes testes ainda não foram executados no ambiente de desenvolvimento: rode-os antes de publicar.

### Verificação manual sugerida

- [ ] Sem login, `/linhas` redireciona para `/login`.
- [ ] Senha errada mostra "E-mail ou senha incorretos." e não entra.
- [ ] Após entrar, o nome aparece no menu. Recarregar a página mantém a sessão.
- [ ] Favoritar uma linha, recarregar e confirmar que ela continua favorita (dados no banco).
- [ ] Remover favorito em `/favoritos`; a lista atualiza.
- [ ] Sair leva ao login; voltar a `/` pede login de novo.
- [ ] Ida/volta trocam o itinerário; "Centralizar" recentraliza o mapa.
- [ ] Domingo mostra "Esta linha não opera aos domingos e feriados."
- [ ] Celular: menu abre e fecha; botão Sair funciona no menu.

## Segurança: o que está e o que falta

Está implementado: senhas com hash, sessão em cookie `HttpOnly` com `SameSite=Lax` (e `Secure` em produção), tokens guardados só como hash, mensagem de erro igual para e-mail inexistente e senha errada, validação de entrada com Zod, e rotas de favoritos que exigem sessão.

Falta para uso público amplo:

- **Limite de tentativas de login.** Hoje não há bloqueio por excesso de erros. Antes de divulgar o site, adicione um limite por IP ou por conta.
- **Recuperação de senha.** Não existe. Quem esquecer a senha precisa de outro comando administrativo.
- **Cadastro público.** Não existe, de propósito.
- **Testes de interface e de API** automatizados (navegação, botões, rotas). Por ora, use a verificação manual acima.

## Limitações conhecidas

- Os dados são de uma linha. O resto de Tietê precisa ser incluído a partir de fontes oficiais.
- Os horários podem mudar sem aviso; a tela mostra a data da consulta e o link da fonte.
- As paradas não têm coordenadas, então o mapa não mostra o trajeto da linha.
- O mapa usa tiles públicos do OpenStreetMap. Em uso intenso, troque por um provedor próprio.

## Licença

Projeto acadêmico. Defina a licença antes de publicar.
