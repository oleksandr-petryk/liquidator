#!/bin/bash

docker ps

until nc -z localhost 5432; do
  echo "Waiting for Postgres..."
  sleep 2
done
until nc -z localhost 29092; do
  echo "Waiting for Kafka..."
  sleep 2
done

# until curl -s http://localhost:9000/minio/health/live; do
#   echo "Waiting for Minio..."
#   sleep 2
# done

until curl -s localhost:8888/api/liquidator/health; do
  echo "Waiting for Liquidator..."
  sleep 2
done
