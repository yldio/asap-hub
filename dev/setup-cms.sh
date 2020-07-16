#!/bin/sh

set -x

wait_for_url() {
    echo "Testing $1"
    timeout -s TERM 5m bash -c \
    'while [[ "$(curl -s -o /dev/null -L -w ''%{http_code}'' ${0})" != "200" ]];\
    do echo "Waiting for ${0}" && sleep 2;\
    done' ${1}
    echo "READY!"
}

migrate() {
  mongoimport --collection=Identity_Users --db=Squidex --file=dev/fixtures/user.json --host=mongo:27017
  sq config add asap-local 5eec9b8133e8330001a8aae9 iwsrcubobxxxrnropuj5k0xe4gjxip42tflvx5pv1a8x -u http://squidex:80
  sq apps create asap-local
  sq sync in dev/fixtures/squidex
}

wait_for_url http://squidex:80/readiness
migrate
