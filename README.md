# Nuvemshop Flags Backend

Backend production-ready em Node.js + Express para criar flags/tags visuais e associar a produtos na Nuvemshop.

## Rodar local (Docker)

1) Copie `.env.example` para `.env` e ajuste valores
2) Suba o stack:

```bash
docker compose up --build
```

3) (Opcional) Seed de usuário admin:

```bash
docker compose run --rm app npm run seed
```

Servidor em `http://localhost:3000`

## Variaveis de ambiente

- `MONGODB_URI` MongoDB connection string
- `JWT_SECRET` segredo do JWT
- `JWT_EXPIRES_IN` expiração do JWT (ex: 7d)
- `ENCRYPTION_KEY` chave de 32+ chars para criptografar access_token
- `NUVEMSHOP_WEBHOOK_SECRET` secret para validar HMAC dos webhooks
- `CORS_ORIGIN` origem permitida ("*" ou lista separada por virgula)
- `RATE_LIMIT_WINDOW_MS` janela de rate limit do endpoint publico
- `RATE_LIMIT_MAX` max requests do endpoint publico
- `PUBLIC_IDS_LIMIT` max ids por request
- `PUBLIC_IDS_MAX_LENGTH` max length da query ids
- `PUBLIC_CACHE_TTL_SECONDS` cache TTL do endpoint publico

## Exemplos de requests

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123","store_id":"store_demo"}'
```

### Criar Flag

```bash
curl -X POST http://localhost:3000/flags \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Frete Gratis",
    "slug":"frete-gratis",
    "type":"badge",
    "text":"Frete Gratis",
    "bgColor":"#FF9900",
    "textColor":"#FFFFFF",
    "position":"top-left",
    "priority":10,
    "conditions":[{"type":"sale_price_exists"}],
    "isActive":true
  }'
```

### Aplicar flags em um produto

```bash
curl -X POST http://localhost:3000/products/123/flags \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"flagIds":["FLAG_ID"]}'
```

### Endpoint publico

```bash
curl "http://localhost:3000/public/store_demo/products/flags?ids=123,456"
```

### Webhook Nuvemshop

```bash
curl -X POST http://localhost:3000/webhooks/nuvemshop \
  -H "Content-Type: application/json" \
  -H "x-nuvemshop-event: product/updated" \
  -H "x-nuvemshop-store-id: store_demo" \
  -H "x-nuvemshop-hmac-sha256: SIGNATURE" \
  -d '{"id":123,"name":"Produto","price":100,"sale_price":90,"stock":5,"tags":["promo"]}'
```

## Resposta padrao

```json
{
  "success": true,
  "data": {}
}
```

## Notas

- O endpoint publico retorna somente dados de renderizacao de flags.
- Todas as queries filtram por `store_id` para isolamento multi-tenant.
- O modulo OAuth tem TODOs para completar o fluxo conforme docs da Nuvemshop.
