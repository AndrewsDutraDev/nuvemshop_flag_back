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

## Testar com Postman

1) Crie um Environment com:
- `baseUrl` = `http://localhost:3000`
- `token` = (deixe vazio)

2) Crie uma request `Login`:
- Method: `POST`
- URL: `{{baseUrl}}/auth/login`
- Body (JSON):
```json
{
  "email": "admin@example.com",
  "password": "TroqueEssaSenha_123!",
  "store_id": "store_demo"
}
```
- Na aba **Tests**, salve o token:
```javascript
const json = pm.response.json();
pm.environment.set('token', json.data.token);
```

3) Crie uma request `Criar Flag`:
- Method: `POST`
- URL: `{{baseUrl}}/flags`
- Header: `Authorization: Bearer {{token}}`
- Body (JSON): mesmo payload do exemplo abaixo.

4) Crie uma request `Aplicar Flags`:
- Method: `POST`
- URL: `{{baseUrl}}/products/123/flags`
- Header: `Authorization: Bearer {{token}}`
- Body (JSON):
```json
{ "flagIds": ["FLAG_ID"] }
```

5) Crie uma request `Public Flags` (sem auth):
- Method: `GET`
- URL: `{{baseUrl}}/public/store_demo/products/flags?ids=123,456`

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
