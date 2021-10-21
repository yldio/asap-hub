FROM ubuntu:18.04

# prevent awscli TZ prompt
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y python3-pip software-properties-common wget curl unzip dirmngr gnupg apt-transport-https ca-certificates awscli

RUN ln -s /usr/bin/pip3 /usr/bin/pip
RUN ln -s /usr/bin/python3 /usr/bin/python

RUN wget https://github.com/Squidex/squidex-samples/releases/download/cli-v7.19/ubuntu-x64.zip && \
    unzip ubuntu-x64.zip && \
    mv sq /bin

