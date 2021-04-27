FROM ubuntu:18.04

RUN apt-get update && \
    apt-get install -y wget unzip dirmngr gnupg apt-transport-https software-properties-common ca-certificates curl

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install

RUN wget https://github.com/Squidex/squidex-samples/releases/download/cli-v7.4/linux-x64.zip && \
    unzip linux-x64.zip && \
    mv sq /bin
