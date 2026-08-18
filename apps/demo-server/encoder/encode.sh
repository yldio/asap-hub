#!/usr/bin/env bash
set -Eeuo pipefail

: "${S3_OBJECT_KEY:?S3_OBJECT_KEY is required}"
: "${BUCKET_NAME:?BUCKET_NAME is required}"
: "${TABLE_NAME:?TABLE_NAME is required}"

SPRITE_INTERVAL_SECONDS="${SPRITE_INTERVAL_SECONDS:-10}"
SPRITE_TILE_WIDTH="${SPRITE_TILE_WIDTH:-160}"
SPRITE_COLUMNS="${SPRITE_COLUMNS:-10}"
SKIP_AWS="${SKIP_AWS:-0}"
WORK_DIR="${WORK_DIR:-/scratch}"

log() {
  printf '%s %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"
}

# wrappers rather than arrays: an empty array expansion trips `set -u` on older bash
aws_s3() {
  if [[ -n "${S3_ENDPOINT:-}" ]]; then
    aws --endpoint-url "$S3_ENDPOINT" s3 "$@"
  else
    aws s3 "$@"
  fi
}

aws_dynamodb() {
  if [[ -n "${DYNAMODB_ENDPOINT:-}" ]]; then
    aws --endpoint-url "$DYNAMODB_ENDPOINT" dynamodb "$@"
  else
    aws dynamodb "$@"
  fi
}

# raw/{videoId}/original.mp4
VIDEO_ID="$(printf '%s' "$S3_OBJECT_KEY" | cut -d/ -f2)"
if [[ -z "$VIDEO_ID" || "$VIDEO_ID" == "$S3_OBJECT_KEY" ]]; then
  log "ERROR cannot derive videoId from S3_OBJECT_KEY=$S3_OBJECT_KEY"
  exit 1
fi

FAILURE_REPORTED=0

report_failure() {
  local message="$1"
  if [[ "$FAILURE_REPORTED" == "1" ]]; then
    return
  fi
  FAILURE_REPORTED=1
  log "FAILED $message"
  if [[ "$SKIP_AWS" == "1" ]]; then
    return
  fi
  aws_dynamodb update-item \
    --table-name "$TABLE_NAME" \
    --key "{\"PK\":{\"S\":\"VIDEO#${VIDEO_ID}\"},\"SK\":{\"S\":\"META\"}}" \
    --update-expression 'SET processingState = :state, processingError = :error' \
    --expression-attribute-values \
    "{\":state\":{\"S\":\"failed\"},\":error\":{\"S\":$(json_string "${message:0:500}")}}" \
    >/dev/null || log "WARN could not record the failure on VIDEO#${VIDEO_ID}"
}

# aws cli takes raw JSON, so the message has to survive quotes and newlines
json_string() {
  printf '%s' "$1" | tr -cd '\11\12\15\40-\176' | awk 'BEGIN { printf "\"" }
    {
      gsub(/\\/, "\\\\")
      gsub(/"/, "\\\"")
      gsub(/\t/, " ")
      if (NR > 1) printf "\\n"
      printf "%s", $0
    }
    END { printf "\"" }'
}

FAILED_LINE=''

# EXIT rather than ERR alone, so an unexpected exit still records a state
on_exit() {
  local status=$?
  if [[ "$status" -ne 0 ]]; then
    report_failure "encode.sh exited ${status}${FAILED_LINE:+ at line ${FAILED_LINE}}: $(tail -c 400 "$LOG_TAIL_FILE" 2>/dev/null || true)"
  fi
  rm -f "$LOG_TAIL_FILE"
  exit "$status"
}

LOG_TAIL_FILE="$(mktemp)"
trap 'FAILED_LINE=$LINENO' ERR
trap on_exit EXIT

run_step() {
  local label="$1"
  local status=0
  shift
  log "$label"
  "$@" >"$LOG_TAIL_FILE" 2>&1 || status=$?
  if [[ "$status" -ne 0 ]]; then
    log "$(tail -n 20 "$LOG_TAIL_FILE")"
  fi
  return "$status"
}

mkdir -p "$WORK_DIR"
INPUT_FILE="${WORK_DIR}/original"
STREAM_FILE="${WORK_DIR}/stream.mp4"
SPRITE_FILE="${WORK_DIR}/sprite.jpg"
VTT_FILE="${WORK_DIR}/thumbnails.vtt"

log "start videoId=${VIDEO_ID} key=${S3_OBJECT_KEY} bucket=${BUCKET_NAME}"

if [[ "$SKIP_AWS" == "1" ]]; then
  : "${LOCAL_INPUT:?LOCAL_INPUT is required when SKIP_AWS=1}"
  cp "$LOCAL_INPUT" "$INPUT_FILE"
  log "download skipped, copied ${LOCAL_INPUT}"
else
  run_step "download s3://${BUCKET_NAME}/${S3_OBJECT_KEY}" \
    aws_s3 cp "s3://${BUCKET_NAME}/${S3_OBJECT_KEY}" "$INPUT_FILE"
fi

DURATION_SECONDS="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$INPUT_FILE")"
if [[ -z "$DURATION_SECONDS" || "$DURATION_SECONDS" == "N/A" ]]; then
  log "ERROR ffprobe returned no duration"
  exit 1
fi

DURATION_MS="$(awk -v d="$DURATION_SECONDS" 'BEGIN { printf "%d", (d * 1000) + 0.5 }')"
if [[ "$DURATION_MS" -le 0 ]]; then
  log "ERROR non positive duration ${DURATION_SECONDS}s"
  exit 1
fi
log "duration ${DURATION_SECONDS}s (${DURATION_MS}ms)"

run_step "encode stream.mp4" \
  ffmpeg -nostdin -y -i "$INPUT_FILE" \
  -c:v libx264 -preset medium -crf 24 \
  -g 60 -keyint_min 60 -sc_threshold 0 \
  -c:a aac -b:a 128k -movflags +faststart "$STREAM_FILE"

# one tile per interval, ceil so the final partial interval still gets a frame
TILE_COUNT="$(awk -v ms="$DURATION_MS" -v i="$SPRITE_INTERVAL_SECONDS" \
  'BEGIN { n = int((ms / 1000) / i); if ((ms / 1000) > n * i) n += 1; if (n < 1) n = 1; print n }')"
COLUMNS="$SPRITE_COLUMNS"
if [[ "$TILE_COUNT" -lt "$COLUMNS" ]]; then
  COLUMNS="$TILE_COUNT"
fi
ROWS="$(((TILE_COUNT + COLUMNS - 1) / COLUMNS))"
log "sprite ${TILE_COUNT} tiles, ${COLUMNS}x${ROWS} grid at ${SPRITE_TILE_WIDTH}px wide"

run_step "build sprite.jpg" \
  ffmpeg -nostdin -y -i "$INPUT_FILE" \
  -frames:v 1 \
  -vf "fps=1/${SPRITE_INTERVAL_SECONDS},scale=${SPRITE_TILE_WIDTH}:-2,tile=${COLUMNS}x${ROWS}" \
  -q:v 4 "$SPRITE_FILE"

TILE_HEIGHT="$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$SPRITE_FILE")"
TILE_HEIGHT="$((TILE_HEIGHT / ROWS))"
log "sprite tile height ${TILE_HEIGHT}px"

format_timestamp() {
  awk -v ms="$1" 'BEGIN {
    h = int(ms / 3600000); ms -= h * 3600000
    m = int(ms / 60000); ms -= m * 60000
    s = int(ms / 1000); ms -= s * 1000
    printf "%02d:%02d:%02d.%03d", h, m, s, ms
  }'
}

{
  printf 'WEBVTT\n\n'
  index=0
  while [[ "$index" -lt "$TILE_COUNT" ]]; do
    start_ms=$((index * SPRITE_INTERVAL_SECONDS * 1000))
    end_ms=$(((index + 1) * SPRITE_INTERVAL_SECONDS * 1000))
    if [[ "$end_ms" -gt "$DURATION_MS" ]]; then
      end_ms="$DURATION_MS"
    fi
    x=$(((index % COLUMNS) * SPRITE_TILE_WIDTH))
    y=$(((index / COLUMNS) * TILE_HEIGHT))
    printf '%s --> %s\n' "$(format_timestamp "$start_ms")" "$(format_timestamp "$end_ms")"
    printf 'sprite.jpg#xywh=%d,%d,%d,%d\n\n' "$x" "$y" "$SPRITE_TILE_WIDTH" "$TILE_HEIGHT"
    index=$((index + 1))
  done
} >"$VTT_FILE"
log "wrote thumbnails.vtt"

if [[ "$SKIP_AWS" == "1" ]]; then
  log "upload skipped, artefacts left in ${WORK_DIR}"
  log "done videoId=${VIDEO_ID} durationMs=${DURATION_MS}"
  exit 0
fi

MEDIA_PREFIX="s3://${BUCKET_NAME}/media/${VIDEO_ID}"

run_step "upload stream.mp4" \
  aws_s3 cp "$STREAM_FILE" "${MEDIA_PREFIX}/stream.mp4" \
  --content-type video/mp4
run_step "upload sprite.jpg" \
  aws_s3 cp "$SPRITE_FILE" "${MEDIA_PREFIX}/sprite.jpg" \
  --content-type image/jpeg
run_step "upload thumbnails.vtt" \
  aws_s3 cp "$VTT_FILE" "${MEDIA_PREFIX}/thumbnails.vtt" \
  --content-type text/vtt

run_step "mark VIDEO#${VIDEO_ID} ready" \
  aws_dynamodb update-item \
  --table-name "$TABLE_NAME" \
  --key "{\"PK\":{\"S\":\"VIDEO#${VIDEO_ID}\"},\"SK\":{\"S\":\"META\"}}" \
  --update-expression 'SET durationMs = :durationMs, processingState = :state REMOVE processingError' \
  --expression-attribute-values \
  "{\":durationMs\":{\"N\":\"${DURATION_MS}\"},\":state\":{\"S\":\"ready\"}}"

log "done videoId=${VIDEO_ID} durationMs=${DURATION_MS}"
