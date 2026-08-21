# Demo hub encoder

ARM64 Fargate image that turns a raw upload into the media a watch page needs: a faststart
MP4, a thumbnail sprite, and a WebVTT track pointing into that sprite.

The task is started by the `demo-hub-${stage}-encoder-raw-object-created` EventBridge rule
whenever an object lands under `raw/` in the storage bucket. The rule injects
`S3_OBJECT_KEY`; `BUCKET_NAME`, `TABLE_NAME` and `REGION` come from the task definition, and
credentials come from the task role.

## What it does

1. Derives `videoId` from the second segment of `S3_OBJECT_KEY` (`raw/{videoId}/original.mp4`).
2. Downloads the raw object to `/scratch`.
3. Probes the duration and rounds it to integer milliseconds.
4. Encodes `stream.mp4` (H.264 CRF 24, AAC 128k, `+faststart`, fixed 60 frame keyframe group).
5. Builds `sprite.jpg`, one 160px wide frame per 10 seconds, tiled 10 per row, and
   `thumbnails.vtt` mapping each 10 second range to a `#xywh` fragment in the sprite.
6. Uploads all three to `media/{videoId}/` with explicit content types.
7. Sets `durationMs` and `processingState = 'ready'` on `PK=VIDEO#{videoId}, SK=META`.

Any failure sets `processingState = 'failed'` with a truncated `processingError` and exits
non-zero. That runs from an `EXIT` trap, so a partial failure still records a state.

## Environment

| Variable                  | Required          | Notes                                                       |
| ------------------------- | ----------------- | ----------------------------------------------------------- |
| `S3_OBJECT_KEY`           | yes               | Injected per run by the EventBridge rule                    |
| `BUCKET_NAME`             | yes               | Storage bucket                                              |
| `TABLE_NAME`              | yes               | Single table                                                |
| `S3_ENDPOINT`             | no                | Endpoint override for MinIO                                 |
| `DYNAMODB_ENDPOINT`       | no                | Endpoint override for DynamoDB Local                        |
| `SKIP_AWS`                | no                | `1` runs encode and VTT generation only, from `LOCAL_INPUT` |
| `LOCAL_INPUT`             | when `SKIP_AWS=1` | Local file to use instead of downloading                    |
| `WORK_DIR`                | no                | Scratch directory, defaults to `/scratch`                   |
| `SPRITE_INTERVAL_SECONDS` | no                | Defaults to `10`                                            |
| `SPRITE_TILE_WIDTH`       | no                | Defaults to `160`                                           |
| `SPRITE_COLUMNS`          | no                | Defaults to `10`                                            |

The AWS CLI also honours `AWS_ENDPOINT_URL_S3` and `AWS_ENDPOINT_URL_DYNAMODB` directly if you
prefer those over `S3_ENDPOINT` / `DYNAMODB_ENDPOINT`.

## Build and push

Fargate runs this on ARM64, so build for `linux/arm64` regardless of your machine.

```sh
ACCOUNT_ID=<account-id>
REGION=us-east-1
REPO=demo-hub-dev-encoder

aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

docker buildx build \
  --platform linux/arm64 \
  -t "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:latest" \
  --push \
  apps/demo-server/encoder
```

The task definition pins `:latest`, so a push is picked up by the next task that starts. There
is no service to redeploy.

## Running locally

Against MinIO and DynamoDB Local (see the repo docker-compose and the
`dynamodb:local:setup` script):

```sh
docker run --rm \
  --network host \
  -e S3_OBJECT_KEY=raw/demo-1/original.mp4 \
  -e BUCKET_NAME=demo-hub-local-storage \
  -e TABLE_NAME=demo-hub-local-data \
  -e S3_ENDPOINT=http://localhost:9000 \
  -e DYNAMODB_ENDPOINT=http://localhost:8000 \
  -e AWS_ACCESS_KEY_ID=minioadmin \
  -e AWS_SECRET_ACCESS_KEY=minioadmin \
  -e AWS_DEFAULT_REGION=us-east-1 \
  demo-hub-encoder:local
```

MinIO needs path style addressing, which the CLI uses automatically when the endpoint is not
an AWS hostname.

To check the encode and the sprite maths on a local file without touching AWS at all:

```sh
SKIP_AWS=1 \
LOCAL_INPUT=./sample.mp4 \
WORK_DIR=./out \
S3_OBJECT_KEY=raw/demo-1/original.mp4 \
BUCKET_NAME=unused TABLE_NAME=unused \
./encode.sh
```

That leaves `stream.mp4`, `sprite.jpg` and `thumbnails.vtt` in `./out` and skips every AWS
call. It needs `ffmpeg` and `ffprobe` on your PATH.
