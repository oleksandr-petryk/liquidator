# Liquidator

This API provides authorization / authentication logic. It allows to log-in with google & apple. It supports organisations and teams.

Useful:

- Swagger: [http://localhost:8888/api/liquidator/docs](http://localhost:8888/api/liquidator/docs)
- App URL: [http://localhost:8888/api/liquidator](http://localhost:8888/api/liquidator)

[![Lint](https://github.com/oleksandr-petryk/liquidator/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/oleksandr-petryk/liquidator/actions/workflows/lint.yml)

## Setup

Generate RSA keys:

```shell
./scripts/generate-rsa-for-jwt.sh
```

Check result in [./keys/.env](./keys/.env) file
