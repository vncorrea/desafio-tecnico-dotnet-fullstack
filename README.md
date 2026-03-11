# Desafio Técnico — Desenvolvedor Full Stack Pleno

Repositório com as respostas ao desafio técnico composto por **5 questões**. Cada questão está organizada em sua respectiva pasta, com o enunciado em arquivo Word e a solução em código quando aplicável.

## Estrutura do repositório

| Pasta      | Conteúdo |
|-----------|----------|
| **Questao1** | Enunciado (`Questão 1.docx`) + projeto .NET (console) |
| **Questao2** | Enunciado (`Questão 2.docx`) + projeto .NET (console) |
| **Questao3** | Enunciado (`Questões 3.docx`) |
| **Questao4** | Enunciado (`Questão 4.docx`) |
| **Questao5** | Enunciado (`Questão 5.docx`) + projeto .NET (API Web) |

A solução completa está no arquivo **`Exercicio.sln`** na raiz do repositório.

## Pré-requisitos

- **.NET 6** ou superior (o projeto foi desenvolvido com .NET 9)
- Para as questões com código: terminal ou IDE com suporte a .NET (Visual Studio, VS Code, Rider, etc.)

## Como executar

### Questão 1 — Aplicação de console (Conta Bancária)

```bash
cd Questao1
dotnet run
```

Programa interativo no console para cadastro de conta bancária (número, titular, depósito inicial), depósito e saque.

### Questão 2 — Aplicação de console (API de futebol)

```bash
cd Questao2
dotnet run
```

Consome a API [HackerRank Football Matches](https://jsonmock.hackerrank.com/api/football_matches), calcula o total de gols de um time em um ano (como mandante e visitante) e exibe no console.

**Bibliotecas:** Newtonsoft.Json (JSON).

### Questão 3 e Questão 4

Respostas descritivas e/ou artefatos conforme o enunciado em cada pasta (arquivos Word).

### Questão 5 — API Web (Conta Corrente) + Frontend React

#### Backend (.NET API)

```bash
cd Questao5
dotnet run
```

API REST para conta corrente (consulta de saldo, movimentações, etc.), com persistência em **SQLite** e documentação **Swagger**.

- **Swagger UI:** após subir a API, acesse `https://localhost:<porta>/swagger` (ou a URL exibida no terminal). No `launchSettings.json` o perfil `Questao5` está configurado para `http://localhost:5189`.
- Banco: arquivo `database.sqlite` criado na pasta do projeto (configurável em `appsettings.json`).

**Bibliotecas (principalmente Questao5):**

- **Swashbuckle.AspNetCore** — Swagger/OpenAPI
- **Dapper** — acesso a dados (SQLite)
- **Microsoft.Data.Sqlite** e **SQLitePCLRaw.bundle_e_sqlite3** — driver SQLite
- **FluentAssertions** — assertions em testes (se houver)

Estrutura do projeto Questao5: `Domain/Entities`, `Infrastructure/Sqlite`, `Infrastructure/Services/Controllers`, `Models`.

#### Frontend (React + Vite) para testar a API

O frontend da Questão 5 está na pasta `questao5-frontend`. Ele permite:

- Enviar movimentações (`POST /api/ContaCorrente/movimentacao`) e ver o `idMovimento` ou o erro detalhado (`tipo`, `mensagem`).
- Consultar o saldo (`GET /api/ContaCorrente/{idContaCorrente}/saldo`) e exibir número da conta, titular, data/hora e saldo formatado, além do JSON bruto da resposta.

**Passos para rodar o frontend:**

```bash
cd questao5-frontend
npm install
npm run dev
```

Depois acesse `http://localhost:5173` no navegador.

No topo da página há um campo **“Base URL da API”**, que por padrão vem como `http://localhost:5189`.

Para facilitar os testes, o frontend já sugere um dos GUIDs de conta cadastrados pelo script de bootstrap:

- Ativas (podem movimentar e consultar saldo): `B6BAFC09-6967-ED11-A567-055DFA4A16C9`, `FA99D033-7067-ED11-96C6-7C5DFA4A16C9`, `382D323D-7067-ED11-8866-7D5DFA4A16C9`.
- Inativas (úteis para testar erros `INACTIVE_ACCOUNT`): `F475F943-7067-ED11-A06B-7E5DFA4A16C9`, `BCDACA4A-7067-ED11-AF81-825DFA4A16C9`, `D2E02051-7067-ED11-94C0-835DFA4A16C9`.

## Observações

- As bibliotecas auxiliares estão referenciadas nos respectivos `.csproj` de cada projeto e descritas acima; detalhes adicionais estão em comentários no código e neste README.
- O desenvolvimento seguiu boas práticas de clareza e organização, dentro do escopo e do tempo do desafio.

## Entrega

Link do repositório: enviado conforme instruções do teste (prazo de até 72h após o recebimento).
