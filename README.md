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

### Questão 5 — API Web (Conta Corrente)

```bash
cd Questao5
dotnet run
```

API REST para conta corrente (consulta de saldo, movimentações, etc.), com persistência em **SQLite** e documentação **Swagger**.

- **Swagger UI:** após subir a API, acesse `https://localhost:<porta>/swagger` (ou a URL exibida no terminal).
- Banco: arquivo `database.sqlite` criado na pasta do projeto (configurável em `appsettings.json`).

**Bibliotecas:**

- **Swashbuckle.AspNetCore** — Swagger/OpenAPI
- **Dapper** — acesso a dados (SQLite)
- **Microsoft.Data.Sqlite** e **SQLitePCLRaw.bundle_e_sqlite3** — driver SQLite
- **FluentAssertions** — assertions em testes (se houver)

Estrutura do projeto Questao5: `Domain/Entities`, `Infrastructure/Sqlite`, `Infrastructure/Services/Controllers`, `Models`.

## Observações

- As bibliotecas auxiliares estão referenciadas nos respectivos `.csproj` de cada projeto e descritas acima; detalhes adicionais estão em comentários no código e neste README.
- O desenvolvimento seguiu boas práticas de clareza e organização, dentro do escopo e do tempo do desafio.

## Entrega

Link do repositório: enviado conforme instruções do teste (prazo de até 72h após o recebimento).
