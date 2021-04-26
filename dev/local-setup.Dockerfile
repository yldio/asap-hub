FROM registry.gitlab.com/yldio/asap-hub/squidex-utils:latest

WORKDIR /app

RUN wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu1804-x86_64-100.3.1.tgz && \
    tar -zxvf mongodb-database-tools-ubuntu1804-x86_64-100.3.1.tgz && \
    mv mongodb-database-tools-ubuntu1804-x86_64-100.3.1/bin/* /bin

COPY dev/setup-squidex.sh .
COPY packages/squidex packages/squidex
COPY dev/fixtures fixtures

CMD ["./setup-squidex.sh"]
