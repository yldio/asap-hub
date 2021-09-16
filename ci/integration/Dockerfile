FROM registry.gitlab.com/yldio/asap-hub/squidex-utils:latest

WORKDIR /app

# Ubuntu 18.04 ships with python 3.6
# Install node, yarn & npm

RUN echo "deb https://deb.nodesource.com/node_14.x buster main" > /etc/apt/sources.list.d/nodesource.list && \
    wget -qO- https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list && \
    wget -qO- https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    apt-get update && \
    apt-get install -yqq nodejs python-pip git && \
    npm i -g npm@^6 \
    npm i -g yarn@^2

COPY ci/integration/scripts/requirements.txt .
RUN pip install -r requirements.txt
