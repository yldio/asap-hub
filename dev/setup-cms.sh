#!/bin/sh

set -x

mongoimport --collection=Identity_Users --db=Squidex --file=dev/fixtures/user.json --host=mongo:27017
sq config add asap-local 5eec9b8133e8330001a8aae9 iwsrcubobxxxrnropuj5k0xe4gjxip42tflvx5pv1a8x -u http://squidex:80
sq apps create asap-local
sq sync in dev/fixtures/squidex/fixtures
