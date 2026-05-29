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

RUN curl -sL https://deb.nodesource.com/setup_24.x | bash \
  && apt-get update && apt-get install -yqq \
  nodejs \
  git \
  && corepack enable \
  # Node 24.15.0 has an ESM-loader regression that breaks Yarn PnP with
  # EBADF on fstat (nodejs/node#62012); require the fixed 24.16.0+.
  && node -e 'process.exit(process.versions.node.localeCompare("24.16.0", undefined, { numeric: true }) < 0 ? 1 : 0)'
