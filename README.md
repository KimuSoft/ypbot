# ypbot

## Development

```sh
gh repo clone kimusoft/ypbot

cd ypbot

corepack enable

yarn

docker compose -f docker-compose.dev.yml up -d

cp .env.example .env

yarn dev
```
