# HelpDesk System

Este é um sistema de HelpDesk completo, construído para facilitar a gestão de chamados, técnicos e clientes.

## Estrutura do Projeto

Este repositório é um monorepo dividido em duas partes principais:

- **Frontend**: Aplicação React.js estilizada com Tailwind CSS. Responsável pela interface do usuário.
- **Backend**: API RESTful construída com Node.js, Express, TypeScript, e Prisma ORM para conexão com PostgreSQL.

## Tecnologias Utilizadas

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Lucide Icons, Zod (Validação), React Hook Form, Playwright (E2E).
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, Zod, Jest & Supertest (Testes Unitários/Integração).

## Como Executar Localmente

Você precisará de [Node.js](https://nodejs.org/en/) e [Docker](https://www.docker.com/) (ou um banco PostgreSQL já rodando).

1. Na raiz do projeto, instale as dependências de cada pasta (ou entre nas pastas individualmente):
```bash
cd backend
npm install
cd ../frontend
npm install
```

2. Configurar variáveis de ambiente do Backend:
Renomeie `.env.example` para `.env` na pasta `backend` e configure a URL do seu banco de dados.

3. Iniciar Banco de Dados:
No backend, você pode iniciar o banco via docker-compose:
```bash
cd backend
docker-compose up -d
```

4. Rodar as migrações e o Seed (Popula o banco com Admin e dados iniciais):
```bash
cd backend
npx prisma migrate dev
npm run prisma:seed
```
*As credenciais padrão do Seed são:* 
**Email:** admin@helpdesk.com
**Senha:** 123456

5. Rodar a aplicação:
- No backend: `npm run dev` (rodará na porta 3333)
- No frontend: `npm run dev` (rodará na porta 5173)

Acesse: http://localhost:5173
