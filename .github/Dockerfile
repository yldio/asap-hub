FROM ubuntu:22.04 AS base

# prevent awscli TZ prompt
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
  python3-pip \
  software-properties-common \
  wget \
  curl \
  unzip \
  dirmngr \
  gnupg \
  apt-transport-https \
  ca-certificates \
  awscli \
  libssl-dev \
  && ln -s /usr/bin/python3 /usr/bin/python

RUN wget https://github.com/Squidex/squidex-samples/releases/download/cli-v7.12/linux-x64.zip && \
  unzip linux-x64.zip && \
  rm linux-x64.zip && \
  mv sq /bin

FROM base AS integration

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash \
  && apt-get update && apt-get install -yqq \
  nodejs \
  git \
  && npm i -g npm@^6 yarn

COPY .github/scripts/squidex/requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt

