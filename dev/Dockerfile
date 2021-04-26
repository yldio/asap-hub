FROM ubuntu:18.04

RUN apt-get update && \
    apt-get install -y wget unzip dirmngr gnupg apt-transport-https software-properties-common ca-certificates curl

RUN wget https://github.com/Squidex/squidex-samples/releases/download/cli-v7.4/linux-x64.zip && \
    unzip linux-x64.zip && \
    mv sq /bin
