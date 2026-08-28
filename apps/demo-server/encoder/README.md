# Demo hub encoder

ARM64 Fargate image that runs the studio's container jobs. `entrypoint.sh` dispatches on
`$JOB`:

| `JOB`               | Script      | What it produces                                    |
| ------------------- | ----------- | --------------------------------------------------- |
| `encode` or nothing | `encode.sh` | The watch page media for a raw upload               |
| `ingest`            | `ingest.sh` | A seekable `proxy.mp4` and the probe of a new asset |

An unset `JOB` has to keep meaning `encode`: the EventBridge rule below sets none.

Deployed, a job is started by `ecs:RunTask` from the api lambda (`src/jobs`), except the
upload encode, which is still started by the EventBridge rule. Locally the same image runs
under `docker run`, pointed at MinIO and DynamoDB Local by `S3_ENDPOINT` and
`DYNAMODB_ENDPOINT`.

## encode

The task is started by the `demo-hub-${stage}-encoder-raw-object-created` EventBridge rule
whenever an object lands under `raw/` in the storage bucket. The rule injects
`S3_OBJECT_KEY`; `BUCKET_NAME`, `TABLE_NAME` and `REGION` come from the task definition, and
credentials come from the task role.

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

Steps 5 to 7 live in `finish.sh`, which `encode.sh` sources: every job that produces a
watchable video ends the same way, so the render job can reuse it unchanged.

## ingest

Started when an asset upload completes. It turns whatever the browser produced into
something the editor can seek: MediaRecorder WebM carries neither a duration nor cues, and
even an mp4 may not be faststart.

1. Downloads `ASSET_KEY` to `/scratch`.
2. Probes the codec, container, dimensions and `r_frame_rate` (`60000/1001` becomes 60fps).
3. Writes `proxy.mp4`: `-c copy` when the source is already h264 in mp4 or mov, an audio only
   remux when there is no video stream, otherwise a `veryfast` CRF 24 transcode. Always
   `+faststart`.
4. Uploads it to `projects/{videoId}/assets/{assetId}/proxy.mp4`.
5. Sets `state = 'ready'` with `proxyKey`, `durationMs`, `width`, `height` and `fps` on
   `PK=VIDEO#{videoId}, SK=ASSET#{assetId}`.

Any failure sets `state = 'failed'` with a truncated `error`. Both updates are conditional on
`attribute_exists(PK)`, so an asset deleted mid ingest is not resurrected.

## Environment

| Variable                  | Required          | Notes                                                       |
| ------------------------- | ----------------- | ----------------------------------------------------------- |
| `S3_OBJECT_KEY`           | encode            | Injected per run by the EventBridge rule                    |
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
| `JOB`                     | no                | `encode` (default) or `ingest`                              |
| `VIDEO_ID`                | ingest            | Project the asset belongs to                                |
| `ASSET_ID`                | ingest            | Asset being ingested                                        |
| `ASSET_KEY`               | ingest            | Key of the uploaded original                                |

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
`dynamodb:local:setup` script). Build the image the way the local job runner expects to find
it:

```sh
docker compose build encoder
```

That tags `demo-hub-encoder:local`. The compose service is in the `jobs` profile because
nothing should keep it running: the job runner starts one container per job. An encode:

```sh
docker run --rm \
  --network host \
  -e S3_OBJECT_KEY=raw/demo-1/original.mp4 \
  -e BUCKET_NAME=demo-hub-local-storage \
  -e TABLE_NAME=demo-hub-local-data \
  -e S3_ENDPOINT=http://localhost:9010 \
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

An ingest, against the same local stack:

```sh
docker run --rm \
  --network host \
  -e JOB=ingest \
  -e VIDEO_ID=demo-1 \
  -e ASSET_ID=asset-1 \
  -e ASSET_KEY=projects/demo-1/assets/asset-1/original.webm \
  -e BUCKET_NAME=demo-hub-local-storage \
  -e TABLE_NAME=demo-hub-local-data \
  -e S3_ENDPOINT=http://localhost:9010 \
  -e DYNAMODB_ENDPOINT=http://localhost:8000 \
  -e AWS_ACCESS_KEY_ID=minioadmin \
  -e AWS_SECRET_ACCESS_KEY=minioadmin \
  -e AWS_DEFAULT_REGION=us-east-1 \
  demo-hub-encoder:local
```
