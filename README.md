# Borrow

Plataforma web de aluguel de itens entre pessoas. Proprietários anunciam objetos disponíveis para aluguel e locatários buscam, reservam e realizam o pagamento diretamente pelo sistema. O objetivo é facilitar o acesso a produtos sem a necessidade de compra, promovendo consumo colaborativo.

---

## Integrantes

| Nome | Matrícula |
|------|-----------|
| **Mariana Terol** | UC22200554 | 
| **Enrique Carvalho** | UC22103250 | 
| **Gabriel Adeodato** | UC22103132 | 
| **Victor Inácio** | UC22200065 | 
| **Breno Camarô** | UC22200177 |

> O desenvolvimento foi colaborativo, com todos os integrantes contribuindo em diferentes partes do projeto conforme a necessidade.

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

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

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Banco de dados MySQL
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=

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

> **Cloudinary:** crie uma conta em [cloudinary.com](https://cloudinary.com) e copie as credenciais do dashboard.

> **Stripe:** crie uma conta em [stripe.com](https://stripe.com), acesse o dashboard em modo teste e copie as chaves públicas e secretas.

> **Firebase:** crie um projeto no [console.firebase.google.com](https://console.firebase.google.com), ative o Firestore e copie as credenciais do SDK.

---

## Banco de Dados

Gere e aplique as migrations com Drizzle ORM:

```bash
npm run db:generate   # gera os arquivos de migration
npm run db:migrate    # aplica as migrations no banco
```

---

## Rodando Localmente

```bash
npm run dev
```

O app estará disponível em `http://localhost:3000`.

### Webhook do Stripe

Para testar pagamentos localmente, instale o [Stripe CLI](https://stripe.com/docs/stripe-cli) e rode em outro terminal:

```bash
stripe listen --forward-to localhost:3000/api/checkout/stripe-webhook
```

Copie o webhook secret exibido no terminal e preencha `STRIPE_WEBHOOK_SECRET` no `.env.local`.

---

## Deploy

O projeto está configurado para deploy na [Vercel](https://vercel.com). Conecte o repositório e configure as variáveis de ambiente no painel da Vercel.

Após o deploy, configure o endpoint do webhook no [painel do Stripe](https://dashboard.stripe.com/webhooks):

- **URL:** `https://seu-dominio.vercel.app/api/checkout/stripe-webhook`
- **Evento:** `payment_intent.succeeded`

---

## Scripts Disponíveis

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

## Funcionalidades

- [x] Cadastro e autenticação de usuários (JWT)
- [x] Criação, edição e exclusão de anúncios com fotos
- [x] Busca e filtragem de anúncios por categoria
- [x] Validação de conflito de datas antes e durante o pagamento
- [x] Pagamento via cartão de crédito integrado com Stripe
- [x] Chat em tempo real entre locador e locatário (Firebase Firestore)
- [x] Dashboard do usuário com meus anúncios, meus aluguéis e carteira
- [x] Fluxo de checklist de entrega e devolução
- [x] Acompanhamento do status do aluguel
- [x] Sistema de avaliações
