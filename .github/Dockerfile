FROM ubuntu:20.04 AS base

# prevent awscli TZ prompt
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
  python3-pip \
  software-properties-common \
  wget \
  curl \
  jq \
  unzip \
  dirmngr \
  gnupg \
  apt-transport-https \
  ca-certificates \
  awscli \
  && ln -s /usr/bin/python3 /usr/bin/python

FROM base AS integration

RUN curl -sL https://deb.nodesource.com/setup_20.x | bash \
  && apt-get update && apt-get install -yqq \
  nodejs \
  git \
  && npm i -g npm@^6 yarn
