FROM debian:latest

WORKDIR /src

RUN apt-get update && \
    apt-get install -y wget unzip libicu63 dirmngr gnupg apt-transport-https software-properties-common ca-certificates curl

RUN curl -fsSL https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add - && \
    add-apt-repository 'deb https://repo.mongodb.org/apt/debian buster/mongodb-org/4.2 main' && \
    apt-get update && \
    apt-get install -y mongodb-org

RUN wget https://github.com/Squidex/squidex-samples/releases/download/cli-v5.2/linux-x64.zip && \
    unzip linux-x64.zip && \
    mv sq /bin

VOLUME ["/dev/fixtures"]

COPY dev/setup-cms.sh ./

CMD ["./setup-cms.sh"]
