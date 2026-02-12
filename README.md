# Barbearia dos Reis

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TurboRepo](https://img.shields.io/badge/TurboRepo-EF5155?style=for-the-badge&logo=TurboRepo&logoColor=white)

Bem-vindo ao repositório do projeto **Barbearia dos Reis**. Este é um sistema completo para gerenciamento de barbearia, desenvolvido utilizando uma arquitetura **Monorepo** para facilitar o compartilhamento de código e gerenciamento de dependências.

## 📁 Estrutura do Monorepo

O projeto utiliza **Turbo Repo** e **pnpm** workspaces para gerenciar os pacotes. A estrutura principal é:

- **apps/backend**: API RESTful desenvolvida com **NestJS**, **Prisma** (PostgreSQL) e autenticação JWT.
- **apps/frontend**: Aplicação web desenvolvida com **React**, **Vite** e **TypeScript**.
- **packages/**: Bibliotecas compartilhadas (se houver no futuro).

## 🚀 Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)
- [Docker](https://www.docker.com/) & Docker Compose (para o banco de dados)

## 🛠️ Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/Eduardo-Lima-Dev/Barbearia-dos-Reis.git
    cd "Barbearia dos Reis"
    ```

2. Instale as dependências do projeto:

    ```bash
    pnpm install
    ```

## 💻 Como Rodar o Projeto

### 1. Configurar o Banco de Dados

O projeto utiliza PostgreSQL. Você pode subir uma instância rapidamente usando o Docker:

```bash
docker-compose up -d postgres
```

Isso iniciará o banco de dados na porta `5434` (mapeada para a 5432 do container) com as credenciais padrão definidas no `docker-compose.yml`.

Crie o arquivo `.env` na pasta `apps/backend` com a URL do banco:

```env
DATABASE_URL="postgresql://admin:adminpassword@localhost:5434/barbearia?schema=public"
JWT_SECRET="sua-chave-secreta-aqui"
```

Execute as migrações do Prisma para criar as tabelas:

```bash
pnpm --filter backend exec prisma migrate dev
```

### 2. Rodar em Modo de Desenvolvimento

Para rodar **todos** os aplicativos (frontend e backend) simultaneamente:

```bash
pnpm dev
```

Isso utilizará o Turbo Repo para iniciar os scripts de desenvolvimento de cada pacote.

- **Frontend**: <http://localhost:5173>
- **Backend**: <http://localhost:3000>
- **Swagger API Docs**: <http://localhost:3000/api>

### 3. Rodar Apenas um Aplicativo

Se preferir rodar isoladamente:

- **Backend**:

  ```bash
  pnpm --filter backend run start:dev
  ```

- **Frontend**:

  ```bash
  pnpm --filter frontend run dev
  ```

## 🐳 Docker (Aplicação Completa)

Para subir a aplicação completa (Backend + Banco de Dados) via Docker:

```bash
docker-compose up --build
```

> **Nota**: O frontend atualmente é configurado para rodar localmente com `vite`, mas pode ser dockerizado seguindo o padrão do backend se necessário.

## 🧪 Testes

Para rodar os testes do backend:

```bash
pnpm --filter backend run test
pnpm --filter backend run test:e2e
```

## 📦 Build

Para gerar o build de produção de todos os pacotes:

```bash
pnpm build
```

## 📝 Licença

Este projeto é privado e proprietário.

Olarrr
