#!/bin/sh

docker compose -p liquidator-local down

docker compose -p liquidator-local up -d
