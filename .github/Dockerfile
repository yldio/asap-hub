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

# Install Node from the official nodejs.org tarball rather than NodeSource apt.
# NodeSource's 24.x channel still serves 24.15.0, which has an ESM-loader
# regression that breaks Yarn PnP with EBADF on fstat (nodejs/node#62012).
# Pin the fixed 24.16.0; bump as newer patches ship.
ENV NODE_VERSION=24.16.0
RUN apt-get update && apt-get install -yqq git xz-utils \
  && curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" -o /tmp/node.tar.xz \
  && tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 --no-same-owner \
  && rm /tmp/node.tar.xz \
  && corepack enable \
  && node -e 'process.exit(process.versions.node === "24.16.0" ? 0 : 1)'
