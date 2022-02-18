FROM ubuntu:20.04 AS base

# prevent awscli TZ prompt
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
  apt-get install -y python3-pip software-properties-common wget curl unzip dirmngr gnupg apt-transport-https ca-certificates awscli

RUN ln -s /usr/bin/python3 /usr/bin/python

RUN wget https://github.com/Squidex/squidex-samples/releases/download/cli-v7.12/linux-x64.zip && \
  unzip linux-x64.zip && \
  mv sq /bin

FROM base AS integration

WORKDIR /app

RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash
RUN apt-get install -yqq nodejs git
RUN  npm i -g npm@^6 yarn

COPY ci/integration/scripts/requirements.txt .
RUN pip install -r requirements.txt

