FROM ubuntu:18.04

WORKDIR /src

VOLUME ["/dev/fixtures"]
VOLUME ["/dev/squidex"]

RUN apt-get update && \
    apt-get install -y wget unzip dirmngr gnupg apt-transport-https software-properties-common ca-certificates curl

RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list && \
    apt-get update && \
    apt-get install -y mongodb-org

RUN wget https://github.com/Squidex/squidex-samples/releases/download/cli-v5.2/linux-x64.zip && \
    unzip linux-x64.zip && \
    mv sq /bin

COPY dev/setup-squidex.sh ./

CMD ["./setup-squidex.sh"]
