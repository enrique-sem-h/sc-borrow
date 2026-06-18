# Borrow

Plataforma de aluguel de itens entre pessoas. Proprietários anunciam objetos para alugar; locatários buscam, reservam e pagam diretamente pelo app.

---

## Funcionalidades

- Cadastro e autenticação de usuários (JWT)
- Criação e gestão de anúncios com fotos (upload via Cloudinary)
- Busca e filtragem de anúncios por categoria
- Fluxo completo de aluguel com checklist de entrega e devolução
- Pagamento via cartão de crédito (Stripe)
- Chat em tempo real entre locador e locatário (Firebase Firestore)
- Dashboard do usuário: meus anúncios, meus aluguéis, carteira, chat
- Webhook Stripe para criação automática de aluguel e conversa de chat após pagamento
- Validação de conflito de datas antes e durante o pagamento
- Sistema de avaliações

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router + Pages Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS + shadcn/ui |
| Banco de dados principal | MySQL via Drizzle ORM |
| Banco de dados realtime | Firebase Firestore |
| Autenticação | JWT + bcrypt |
| Pagamentos | Stripe (PaymentIntents + Webhooks) |
| Upload de imagens | Cloudinary |
| Formulários | React Hook Form + Zod |
| Estado assíncrono | TanStack Query |
| Testes | Vitest |

---

## Pré-requisitos

- Node.js 18+
- MySQL rodando localmente ou em nuvem
- Conta no [Stripe](https://stripe.com) (modo teste)
- Projeto no [Firebase](https://console.firebase.google.com) com Firestore habilitado
- Conta no [Cloudinary](https://cloudinary.com)

---

## Instalação

```bash
git clone https://github.com/enrique-sem-h/sc-borrow.git
cd sc-borrow
npm install
```

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz com as seguintes variáveis:

```env
# Banco de dados MySQL
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
CA_CERTIFICATE=        # certificado SSL se necessário (ex: PlanetScale)

# JWT
SECRET=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Cloudinary
CLODINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Banco de dados

Gere e rode as migrations com Drizzle:

```bash
npm run db:generate   # gera os arquivos de migration
npm run db:migrate    # aplica as migrations no banco
```

---

## Rodando localmente

```bash
npm run dev
```

O app estará disponível em `http://localhost:3000`.

### Webhook do Stripe (obrigatório para pagamentos locais)

Em outro terminal, instale o [Stripe CLI](https://stripe.com/docs/stripe-cli) e rode:

```bash
stripe listen --forward-to localhost:3000/api/checkout/stripe-webhook
```

Copie o webhook secret gerado e coloque em `STRIPE_WEBHOOK_SECRET` no `.env.local`.

---

## Estrutura do projeto

```
sc-borrow/
├── app/                        # App Router (páginas e layouts)
│   ├── dashboard/              # Área logada (sidebar, meus aluguéis, chat...)
│   ├── aluguel/                # Telas de andamento de locador e locatário
│   ├── checklist/              # Checklists de entrega e devolução
│   ├── anunciar/               # Criação de anúncios
│   ├── detalhesanuncio/        # Página de detalhe de anúncio
│   ├── pagamento/              # Fluxo de pagamento (Stripe Elements)
│   └── busca/                  # Busca e filtro de anúncios
├── pages/api/                  # API Routes (Pages Router)
│   ├── aluguel/                # CRUD + dispatch/cancel
│   ├── anuncio/                # CRUD de anúncios
│   ├── checkout/               # PaymentIntent + Stripe Webhook
│   ├── login/                  # Autenticação
│   └── users/                  # Dados de usuário
├── server/                     # Lógica server-side
│   ├── controllers/            # Controladores HTTP
│   ├── services/               # Regras de negócio
│   ├── repositories/           # Acesso ao banco
│   ├── middlewares/            # Auth, validação, upload
│   └── handlers/               # Wiring controllers → routes
├── infra/
│   ├── database/               # Configuração Drizzle + schemas
│   └── firebase.ts             # Configuração Firebase
├── components/                 # Componentes React reutilizáveis
├── contexts/                   # AuthContext, NotificationContext
├── modules/                    # React Query (queries/mutations) + Zod schemas
└── services/                   # API client (axios)
```

---

## Fluxo de pagamento

1. Usuário escolhe datas → app verifica conflito de datas via `POST /api/checkout`
2. Se livre, cria um PaymentIntent no Stripe e retorna o `clientSecret`
3. Stripe Elements processa o pagamento no browser
4. Stripe dispara webhook `payment_intent.succeeded` para `/api/checkout/stripe-webhook`
5. Webhook cria o registro de aluguel no MySQL e abre a conversa no Firestore automaticamente

---

## Status do aluguel

```
WAITING_FOR_DISPATCH  →  WAITING_FOR_DELIVERY  →  ITEM_IN_HAND  →  COMPLETED
                                                                        ↓
                                                                    CANCELLED
```

| Status | Descrição |
|---|---|
| `WAITING_FOR_DISPATCH` | Pagamento confirmado, locador precisa confirmar envio |
| `WAITING_FOR_DELIVERY` | Item enviado, locatário aguarda recebimento |
| `ITEM_IN_HAND` | Locatário confirmou recebimento |
| `COMPLETED` | Aluguel concluído |
| `CANCELLED` | Aluguel cancelado |

---

## Scripts disponíveis

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção
npm run start        # inicia o build de produção
npm run db:generate  # gera migrations Drizzle
npm run db:migrate   # aplica migrations
npm run test         # roda testes com Vitest
npm run lint         # ESLint
```

---

## Deploy

O projeto está configurado para deploy na [Vercel](https://vercel.com). Basta conectar o repositório e configurar as variáveis de ambiente no painel da Vercel.

> **Atenção:** O webhook do Stripe precisa apontar para a URL de produção. Configure em [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks) com o endpoint `https://seu-dominio.vercel.app/api/checkout/stripe-webhook` e o evento `payment_intent.succeeded`.
