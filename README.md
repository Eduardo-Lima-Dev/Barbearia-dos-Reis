# Barbearia dos Reis - Backend API

Backend API para o sistema da "Barbearia dos Reis", construído em Node.js com Express, TypeScript e Prisma ORM.

## 🚀 Quick Start

Siga os passos abaixo para rodar a aplicação localmente.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+ recomendado)
- [Docker](https://www.docker.com/) & Docker Compose
- [npm](https://www.npmjs.com/) ou pnpm

### Instalação e Execução

1. **Instale as dependências do projeto:**

   ```bash
   npm install
   ```

2. **Configuração das Variáveis de Ambiente:**
   Certifique-se de que o arquivo `.env` na raiz do projeto está configurado. Um exemplo base:

   ```env
   PORT=3333
   DATABASE_URL="postgresql://root:rootpassword@localhost:5432/barbearia?schema=public"
   JWT_SECRET="sua_chave_secreta_jwt"
   
   # Chaves do Supabase (para upload de imagens)
   SUPABASE_URL="https://seu-projeto.supabase.co"
   SUPABASE_KEY="sua-anon-key"
   ```

3. **Inicie o Banco de Dados (PostgreSQL via Docker):**

   ```bash
   npm run db:up
   ```

4. **Execute as Migrations do Prisma:**
   Gera as tabelas no banco de dados sincronizando com o schema.

   ```bash
   npx prisma migrate dev
   ```

5. **Inicie o Servidor de Desenvolvimento:**

   ```bash
   npm run dev
   ```

   A API estará disponível em `http://localhost:3333/api`.

---

## ✨ Features

- **Autenticação Segura:** Autenticação baseada em JWT com senhas hasheadas via `bcrypt`.
- **Controle de Acesso (RBAC):** Proteção de rotas baseada em papéis (`Role`).
  - `BARBER`: Acesso total (Criar, Listar, Atualizar, Deletar).
  - `EMPLOYEE`: Acesso restrito (Criar, Listar).
- **Gestão de Cortes (Haircuts):** CRUD completo com suporte a múltiplas `tags` de filtros nativas do PostgreSQL e integração com links de upload do Supabase.
- **Validação de Dados:** Validação estrita de tipagens e schemas de entrada (Body, Query) utilizando a biblioteca `Zod`.

---

## ⚙️ Configuration

| Variável | Descrição | Padrão |
|----------|-------------|---------|
| `PORT` | Porta onde o servidor Express irá rodar | `3333` |
| `DATABASE_URL` | String de conexão com o PostgreSQL | `postgresql://root...` |
| `JWT_SECRET` | Chave secreta para assinar os tokens JWT | - |
| `SUPABASE_URL` | URL do projeto Supabase para o Storage | - |
| `SUPABASE_KEY` | Chave anônima/serviço da API do Supabase | - |

---

## 📖 API Reference (Swagger Style)

**Autenticação:** O cabeçalho `Authorization` com o prefixo `Bearer` é exigido na maioria das rotas (exceto `/register` e `/login`).
Exemplo: `Authorization: Bearer <seu_token_jwt>`

### 🔐 Auth Endpoints

#### `POST /api/register`

Registra um novo usuário no sistema.

**Body Parameters:**

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-------------|
| `name` | string | Sim | Nome completo do usuário |
| `email` | string | Sim | E-mail válido e único |
| `password` | string | Sim | Senha (mínimo 6 caracteres) |
| `role` | enum | Não | `"BARBER"` ou `"EMPLOYEE"`. (Padrão: `"EMPLOYEE"`) |

**Responses:**

- `201 Created`: Retorna o objeto do usuário (sem a senha).
- `400 Bad Request`: Erro de validação Zod ou E-mail já existente.

#### `POST /api/login`

Autentica o usuário e retorna o token JWT.

**Body Parameters:**

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-------------|
| `email` | string | Sim | E-mail cadastrado |
| `password`| string | Sim | Senha de acesso |

**Responses:**

- `200 OK`: Retorna payload com `{ user: { id, name, email, role }, token: "..." }`.
- `401 Unauthorized`: Credenciais inválidas.

---

### ✂️ Haircut Endpoints

#### `POST /api/haircuts`

Cria um novo registro de corte no catálogo.
**Permissões permitidas:** `BARBER`, `EMPLOYEE`

**Body Parameters:**

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-------------|
| `name` | string | Sim | Nome do corte (Ex: Degradê) |
| `tags` | string[] | Não | Array de palavras-chave (Ex: `["social", "fade"]`) |
| `duration` | number | Sim | Duração do corte em minutos |
| `description`| string | Não | Descrição de como é o corte |
| `modelUrl` | string | Não | Link público da imagem gerada pelo Supabase |

**Responses:**

- `201 Created`: Retorna o objeto do corte inserido.
- `401 Unauthorized`: Token ausente ou inválido.

#### `GET /api/haircuts`

Lista os cortes cadastrados, suportando filtros.
**Permissões permitidas:** `BARBER`, `EMPLOYEE`

**Query Parameters:**

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-------------|
| `tags` | string | Não | Filtra resultados por tags separadas por vírgula (Ex: `?tags=cabelo,barba`) |

**Responses:**

- `200 OK`: Retorna um Array `[]` listando os cortes filtrados.

#### `PUT /api/haircuts/:id`

Atualiza dados parciais de um corte específico.
**Permissões permitidas:** `BARBER` apenas. (Funcionários levam bloqueio).

**Path Parameters:**

- `id` (uuid) - ID do corte

**Body Parameters:**
Aceita qualquer propriedade do body da rota de `POST`, porém todos são opcionais.

**Responses:**

- `200 OK`: Retorna o corte atualizado.
- `403 Forbidden`: Acesso negado, permissões insuficientes.

#### `DELETE /api/haircuts/:id`

Deleta um corte do catálogo.
**Permissões permitidas:** `BARBER` apenas.

**Path Parameters:**

- `id` (uuid) - ID do corte

**Responses:**

- `204 No Content`: Deletado com sucesso.
- `403 Forbidden`: Acesso negado, permissões insuficientes.
