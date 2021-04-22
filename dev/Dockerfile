FROM ubuntu:18.04

WORKDIR /app

RUN apt-get update && \
    apt-get install -y wget unzip dirmngr gnupg apt-transport-https software-properties-common ca-certificates curl

RUN wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu1804-x86_64-100.3.1.tgz && \
    tar -zxvf mongodb-database-tools-ubuntu1804-x86_64-100.3.1.tgz && \
    mv mongodb-database-tools-ubuntu1804-x86_64-100.3.1/bin/* /bin

RUN wget https://github.com/Squidex/squidex-samples/releases/download/cli-v7.4/linux-x64.zip && \
    unzip linux-x64.zip && \
    mv sq /bin

COPY dev/setup-squidex.sh .
COPY packages/squidex packages/squidex
COPY dev/fixtures fixtures

CMD ["./setup-squidex.sh"]
