# Fluxo de Pagamento — Integração Frontend

Guia para integrar o checkout de cursos pagos a partir do frontend (Next.js). Descreve **só o que o frontend precisa fazer**: criar a cobrança, redirecionar o aluno para a tela de pagamento do Asaas e detectar a liberação de acesso.

Este documento é **autossuficiente** — quem implementa o frontend não precisa de acesso ao código do backend.

> **Modelo de pagamento:** usamos **Payment Link hospedado do Asaas**. O aluno preenche CPF/CNPJ, endereço e dados do cartão **na tela do Asaas**, não no nosso frontend. Por isso o frontend **nunca** coleta nem envia dado sensível de pagamento — ele só dispara o checkout e recebe uma URL para onde redirecionar.

> **Forma de pagamento escolhida no checkout:** o aluno escolhe **PIX, Boleto ou Cartão de crédito no seu frontend** (ex.: botões/seletor), e esse método vai no corpo da requisição. O link do Asaas é gerado **travado nesse método** — a tela do Asaas já abre direto na forma escolhida, não oferece troca. **Cartão de crédito** permite parcelamento (até o limite configurado, hoje **3x**); **PIX** e **Boleto** são pagamento à vista, sem parcelas.

---

## Pré-requisitos

### Base URL da API

Todos os endpoints são servidos sob o prefixo **`/api`**.

| Ambiente   | Base URL                  |
|------------|---------------------------|
| Produção   | `/api` (mesmo host do frontend) |
| Desenvolvimento | `http://localhost:8080/api` |

Mantenha a base URL em uma variável de ambiente (ex.: `NEXT_PUBLIC_API_BASE_URL`). Nos exemplos deste documento os caminhos aparecem como `/api/...`; **concatene-os à base URL** do seu ambiente. Em dev, o backend está em outra origem (`localhost:8080`), então as requisições são cross-origin (CORS) — use a base URL completa.

### Autenticação (token)

Todas as requisições deste fluxo (exceto o redirect ao Asaas) exigem um **JWT** no header:

```
Authorization: Bearer <accessToken>
```

O token vem do login. Detalhar o fluxo de login **não é objetivo deste documento**, mas o mínimo que você precisa saber:

- `POST /api/auth/login` com `{ "email": "...", "password": "..." }` → retorna `{ "accessToken": "...", "refreshToken": "..." }`.
- O `accessToken` **expira em 24 horas**. Quando expirar, as requisições retornam `401`/`403`.
- Para renovar sem novo login: `POST /api/auth/refresh` com `{ "refreshToken": "..." }` → retorna `{ "accessToken": "..." }`.

Nos exemplos abaixo, `accessToken` é esse token já obtido.

---

## Visão geral do fluxo

```
┌──────────┐  1. POST /charges/checkout    ┌──────────┐
│ Frontend │  { courseId, paymentMethod }  │  Backend │
│          │ ────────────────────────────► │          │
│          │ ◄──────────────────────────── │          │
└────┬─────┘     { invoiceUrl }             └──────────┘
     │
     │ 2. redireciona o aluno para invoiceUrl
     ▼
┌──────────────────────────────────┐
│  Tela de pagamento do Asaas       │  já travada no método escolhido (cartão até Nx);
│  (método escolhido no checkout)   │  aluno preenche CPF/CNPJ e paga
└────┬─────────────────────────────┘
     │ 3. aluno paga
     ▼
┌──────────┐   webhook PAYMENT_*    ┌──────────┐   cria matrícula ATIVA
│  Asaas   │ ─────────────────────► │  Backend │ ───────────────────────►  acesso liberado
└──────────┘  (servidor-a-servidor) └──────────┘
                                          ▲
┌──────────┐   4. GET .../access          │
│ Frontend │ ─────────────────────────────┘  (polling até hasAccess = true)
└──────────┘
```

Pontos-chave para o frontend:

1. O frontend **inicia** a cobrança com 1 requisição autenticada.
2. O frontend **redireciona** para a URL retornada (não renderiza formulário de cartão).
3. A confirmação do pagamento chega ao backend **por webhook** (servidor-a-servidor) — o frontend **não** participa disso.
4. Para saber se o acesso foi liberado, o frontend **consulta o gate de acesso** (polling ou ao voltar para a aplicação).

> Após pagar, o aluno **permanece na tela de confirmação do Asaas** (não há redirect automático de volta para a aplicação). O frontend descobre a liberação pelo gate de acesso (Passo 4) — por isso a sugestão de abrir o pagamento em outra aba.

> Todos os endpoints abaixo, exceto o webhook, exigem o header `Authorization: Bearer <accessToken>`.

---

## Passo 0 — Descobrir o curso e o preço

Antes do checkout você precisa do `courseId` e, para exibir o valor, do `price` do curso. **Atenção a uma pegadinha:** o endpoint de **listagem não traz `price` nem `active`** — só o de **detalhe** traz.

**Listar cursos (catálogo, paginado):** `GET /api/courses`

Retorna uma `Page` de cursos ativos. Cada item tem apenas: `id`, `name`, `description`, `category`, `type`, `thumbnailUrl`. **Não tem preço.** Use para montar a vitrine e pegar o `id`.

**Detalhe de um curso:** `GET /api/courses/{id}`

```json
{
  "id": "f3a1c0de-0000-4000-8000-000000000000",
  "name": "Curso de Exemplo",
  "description": "...",
  "category": "CURSO_LIVRE",
  "type": "ONLINE",
  "active": true,
  "price": 97.00,
  "duration": "...",
  "instructors": [],
  "thumbnailUrl": "...",
  "links": [],
  "files": [],
  "details": null
}
```

Regra para o frontend decidir se mostra o botão **"Comprar"**:

- Curso é **pago** quando `active === true` **e** `price > 0`.
- Curso com `price` nulo/zero é gratuito (não passa pelo checkout — use a matrícula direta, fora do escopo deste doc).

Ou seja: liste com `GET /api/courses`, e ao abrir a página do curso busque o detalhe com `GET /api/courses/{id}` para obter `price` e `active`.

---

## Passo 1 — Iniciar o checkout

`POST /api/charges/checkout`

Cria (ou reaproveita) uma cobrança pendente para o aluno autenticado e devolve a URL de pagamento.

**Request**

```http
POST /api/charges/checkout
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "courseId": "f3a1c0de-0000-4000-8000-000000000000",
  "paymentMethod": "CREDIT_CARD"
}
```

**Campos do body**

| Campo           | Obrigatório | Descrição |
|-----------------|-------------|-----------|
| `courseId`      | sim         | `id` do curso (UUID) obtido no Passo 0. |
| `paymentMethod` | sim         | Forma de pagamento escolhida pelo aluno. Valores aceitos: `PIX`, `BOLETO`, `CREDIT_CARD`. Determina a tela do Asaas: `CREDIT_CARD` habilita parcelamento (até 3x); `PIX`/`BOLETO` são à vista. Valor diferente desses três → `400`. |
| `callbackUrl`   | não         | URL absoluta http(s) para onde o Asaas redireciona o aluno após pagar. Se omitido, o aluno permanece na tela de confirmação do Asaas. |

**Response `200 OK`**

```json
{
  "invoiceUrl": "https://sandbox.asaas.com/c/abc123..."
}
```

Exemplo de chamada no frontend:

```ts
type PaymentMethod = "PIX" | "BOLETO" | "CREDIT_CARD";

async function iniciarCheckout(
  courseId: string,
  paymentMethod: PaymentMethod,
  accessToken: string,
) {
  const res = await fetch("/api/charges/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ courseId, paymentMethod }),
  });

  if (!res.ok) {
    // ver tabela de erros abaixo
    throw new Error(`Checkout falhou: ${res.status}`);
  }

  const { invoiceUrl } = await res.json();
  return invoiceUrl as string;
}
```

### Comportamento importante

- **Anti-duplicação por método:** se já existe uma cobrança **pendente** para o mesmo aluno + curso **e o mesmo `paymentMethod`**, o backend retorna o **mesmo `invoiceUrl`** em vez de criar um novo link. Pode chamar o endpoint quantas vezes precisar com o mesmo método — não gera cobranças duplicadas. Se o aluno **trocar o método** (ex.: gerou um PIX e depois escolhe cartão), o backend cria um **link novo** travado no novo método.
- **Já comprado:** se o aluno já pagou esse curso (cobrança `PAGA`), o endpoint retorna **`409 Conflict`**. Nesse caso, leve o aluno direto ao conteúdo do curso (ele já tem acesso).

---

## Passo 2 — Redirecionar para a tela de pagamento

Com o `invoiceUrl` em mãos, redirecione o aluno. Duas opções:

```ts
// Opção A — redireciona na mesma aba
window.location.href = invoiceUrl;

// Opção B — abre em nova aba (mantém sua aplicação aberta para o polling do Passo 4)
window.open(invoiceUrl, "_blank");
```

> Sugestão: abra em nova aba e, na sua aba original, mostre uma tela de "aguardando pagamento" que faz o polling do Passo 4. Assim você detecta a liberação sem depender de o aluno voltar manualmente.

A tela do Asaas já abre **travada no método escolhido no checkout**: o aluno não troca a forma de pagamento ali, apenas preenche os próprios dados (CPF/CNPJ e, no cartão, os dados do cartão e o número de parcelas até o limite configurado) e conclui o pagamento.

> **Valor mínimo de parcela (cartão):** o Asaas exige um valor mínimo por parcela. Em cursos de valor baixo, ele pode oferecer **menos** parcelas do que o limite (3x) — isso é regra do gateway, não do backend.

---

## Passo 3 — Confirmação do pagamento (não é o frontend)

Quando o aluno paga, o **Asaas chama o webhook do backend** (`POST /api/webhooks/asaas`, servidor-a-servidor). O backend, então:

1. Marca a cobrança como `PAGA`.
2. **Cria a matrícula (`enrollment`) com status `ATIVA`** — é isso que libera o acesso ao curso.

O frontend **não recebe** essa notificação diretamente. Por isso existe o Passo 4.

> Confirmação por meio de pagamento: **Cartão** confirma no evento `PAYMENT_CONFIRMED`; **PIX/Boleto** no `PAYMENT_RECEIVED`. Para o frontend, o efeito é o mesmo: o acesso passa a estar liberado.
>
> **Estorno/chargeback:** se o pagamento for devolvido depois, o backend marca a cobrança como `ESTORNADA` e **revoga o acesso**. Ou seja, o gate de acesso pode voltar a negar — sempre confie no gate, não em um estado "pago" guardado no cliente.

---

## Passo 4 — Detectar a liberação de acesso (gate)

`GET /api/enrollments/courses/{courseId}/access`

Diz se o aluno autenticado tem acesso ao curso. Use para:

- Fazer **polling** após o checkout, até `hasAccess: true`.
- **Proteger a rota** do conteúdo do curso (verificar antes de renderizar o player/material).

**Request**

```http
GET /api/enrollments/courses/f3a1c0de-0000-4000-8000-000000000000/access
Authorization: Bearer <accessToken>
```

**Response `200 OK`**

```json
{
  "courseId": "f3a1c0de-0000-4000-8000-000000000000",
  "hasAccess": true,
  "status": "ATIVA"
}
```

- `hasAccess` — `true` quando o acesso está liberado.
- `status` — status da matrícula: `ATIVA`, etc. É `null` quando o aluno **não tem** matrícula no curso (ainda não pagou ou nunca se matriculou).

Exemplo de polling no frontend:

```ts
async function aguardarAcesso(courseId: string, accessToken: string) {
  const url = `/api/enrollments/courses/${courseId}/access`;

  for (let tentativa = 0; tentativa < 40; tentativa++) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const { hasAccess } = await res.json();

    if (hasAccess) return true;

    await new Promise((r) => setTimeout(r, 3000)); // espera 3s entre as tentativas
  }
  return false; // tempo esgotado — peça ao aluno para recarregar mais tarde
}
```

> O tempo até `hasAccess` virar `true` depende do meio de pagamento: **cartão** costuma confirmar em segundos; **PIX** em segundos a minutos; **boleto** pode levar **1+ dia útil**. Para boleto, não dependa só do polling na hora — mostre uma mensagem de "pagamento em processamento" e verifique o acesso quando o aluno voltar à aplicação.

---

## Sugestão de UX (máquina de estados)

```
[Curso pago, sem acesso]
        │  clica "Comprar"
        ▼
[POST /charges/checkout]
   ├─ 200 → redireciona p/ invoiceUrl ─► [Aguardando pagamento]
   │                                          │ polling GET .../access
   │                                          ├─ hasAccess:true ─► [Acesso liberado]
   │                                          └─ timeout ───────► [Pagamento em processamento]
   └─ 409 (já comprado) ───────────────────────────────────────► [Acesso liberado]
```

---

## Erros e respostas

| Cenário                                          | Endpoint            | Status            | O que o frontend faz |
|--------------------------------------------------|---------------------|-------------------|----------------------|
| Checkout OK                                      | `/charges/checkout` | `200 OK`          | redireciona p/ `invoiceUrl` |
| Curso já comprado pelo aluno                     | `/charges/checkout` | `409 Conflict`    | leva ao conteúdo (já tem acesso) |
| `courseId` inexistente                           | `/charges/checkout` | `404 Not Found`   | mensagem de curso indisponível |
| Curso `active = false` ou sem preço (`price ≤ 0`)| `/charges/checkout` | `400 Bad Request` | curso não disponível para compra |
| Sem token JWT / token inválido                   | qualquer            | `403 Forbidden`   | redireciona p/ login / refresh do token |
| `courseId` ausente no body                       | `/charges/checkout` | `400 Bad Request` | validar antes de enviar |
| `paymentMethod` ausente ou inválido              | `/charges/checkout` | `400 Bad Request` | garantir um de `PIX`/`BOLETO`/`CREDIT_CARD` |
| `callbackUrl` não é URL http(s) absoluta         | `/charges/checkout` | `400 Bad Request` | enviar URL absoluta ou omitir o campo |

### Formato do corpo de erro

Todas as respostas de erro (4xx/5xx) seguem o mesmo formato JSON:

```json
{
  "timestamp": "2026-06-28T14:32:10.123",
  "status": 409,
  "error": "Course already purchased",
  "message": "You have already purchased this course."
}
```

- `status` — código HTTP (mesmo do status da resposta).
- `error` — título curto do erro.
- `message` — descrição legível; pode ser exibida ao usuário ou logada.

> O `409` de "já comprado" e o `400` de "curso não disponível" trazem `error`/`message` específicos como acima. Use o **código HTTP** para decidir o fluxo (tabela acima) e `message` para o texto exibido.

---

## Resumo do que o frontend integra

| # | Ação | Endpoint | Auth |
|---|------|----------|------|
| 0 | Listar cursos / obter preço | `GET /api/courses` e `GET /api/courses/{id}` | Bearer token |
| 1 | Iniciar cobrança (com `paymentMethod`) | `POST /api/charges/checkout` | Bearer token |
| 2 | Redirecionar | abre `invoiceUrl` (Asaas) | — |
| 3 | Confirmação | (webhook → backend, **não é o frontend**) | — |
| 4 | Verificar/aguardar acesso | `GET /api/enrollments/courses/{courseId}/access` | Bearer token |

O frontend nunca lida com CPF/CNPJ, cartão ou webhook. Ele apenas **dispara o checkout**, **redireciona** e **consulta o gate de acesso**.
