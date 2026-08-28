FROM public.ecr.aws/docker/library/alpine:3.20

# nodejs, librsvg (rsvg-convert) and a font are what the render job needs to turn
# a timeline into overlay frames; ffmpeg and the aws cli are what every job needs
RUN apk add --no-cache \
  bash \
  ffmpeg \
  aws-cli \
  coreutils \
  nodejs \
  librsvg \
  fontconfig \
  font-dejavu

COPY entrypoint.sh encode.sh finish.sh ingest.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/encode.sh \
  /usr/local/bin/finish.sh /usr/local/bin/ingest.sh

WORKDIR /scratch

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
