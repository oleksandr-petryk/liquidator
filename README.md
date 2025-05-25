# Liquidator

This API provides authorization / authentication logic. It allows to log-in with google & apple. It supports organisations and teams.

Useful:

- Swagger: [http://localhost:8888/api/liquidator/docs](http://localhost:8888/api/liquidator/docs)
- App URL: [http://localhost:8888/api/liquidator](http://localhost:8888/api/liquidator)

[![CI](https://github.com/oleksandr-petryk/liquidator/actions/workflows/ci.yml/badge.svg)](https://github.com/oleksandr-petryk/liquidator/actions/workflows/ci.yml)

## Local run

1. Install nvm
2. Install Node.js v22
3. Install packages `yarn`
4. Run docker compose `yarn docker:local:start`
5. Prepare .env file `cp .env.local.example .env`
6. Run app in dev mode `yarn start:dev`

## Setup

Generate RSA keys:

```shell
./scripts/generate-rsa-for-jwt.sh
```

Check result in [./keys/.env](./keys/.env) file
