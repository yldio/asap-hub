FROM nikolaik/python-nodejs:python3.9-nodejs14-slim

RUN apt-get update -y && apt-get install -y unzip software-properties-common

RUN wget https://github.com/Squidex/squidex-samples/releases/download/cli-v7.4/linux-x64.zip && \
    unzip linux-x64.zip && \
    mv sq /bin
