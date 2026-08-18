FROM public.ecr.aws/docker/library/alpine:3.20

RUN apk add --no-cache bash ffmpeg aws-cli coreutils

COPY encode.sh /usr/local/bin/encode.sh
RUN chmod +x /usr/local/bin/encode.sh

WORKDIR /scratch

ENTRYPOINT ["/usr/local/bin/encode.sh"]
