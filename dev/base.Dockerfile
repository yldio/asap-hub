FROM ubuntu:18.04 AS base

# prevent awscli TZ prompt
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y python3-pip software-properties-common wget curl unzip dirmngr gnupg apt-transport-https ca-certificates awscli

RUN ln -s /usr/bin/pip3 /usr/bin/pip
RUN ln -s /usr/bin/python3 /usr/bin/python

RUN wget https://github.com/Squidex/squidex-samples/releases/download/cli-v7.12/linux-x64.zip && \
    unzip linux-x64.zip && \
    mv sq /bin

FROM base AS integration

WORKDIR /app

# Ubuntu 18.04 ships with python 3.6
# Install node, yarn & npm

RUN echo "deb https://deb.nodesource.com/node_14.x buster main" > /etc/apt/sources.list.d/nodesource.list && \
    wget -qO- https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list && \
    wget -qO- https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    apt-get update && \
    apt-get install -yqq nodejs yarn python-pip git && \
    npm i -g npm@^6

COPY ci/integration/scripts/requirements.txt .
RUN pip install -r requirements.txt

