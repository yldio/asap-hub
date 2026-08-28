#!/usr/bin/env bash
set -Eeuo pipefail

: "${VIDEO_ID:?VIDEO_ID is required}"
: "${ASSET_ID:?ASSET_ID is required}"
: "${ASSET_KEY:?ASSET_KEY is required}"
: "${BUCKET_NAME:?BUCKET_NAME is required}"
: "${TABLE_NAME:?TABLE_NAME is required}"

WORK_DIR="${WORK_DIR:-/scratch}"
PROXY_KEY="projects/${VIDEO_ID}/assets/${ASSET_ID}/proxy.mp4"

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

now() {
  date -u '+%Y-%m-%dT%H:%M:%S.000Z'
}

ITEM_KEY_JSON="{\"PK\":{\"S\":\"VIDEO#${VIDEO_ID}\"},\"SK\":{\"S\":\"ASSET#${ASSET_ID}\"}}"

FAILURE_REPORTED=0

report_failure() {
  local message="$1"
  if [[ "$FAILURE_REPORTED" == "1" ]]; then
    return
  fi
  FAILURE_REPORTED=1
  log "FAILED $message"
  # the condition keeps a delete that raced the ingest from resurrecting the item
  aws_dynamodb update-item \
    --table-name "$TABLE_NAME" \
    --key "$ITEM_KEY_JSON" \
    --update-expression 'SET #state = :state, #error = :error, #updatedAt = :updatedAt' \
    --condition-expression 'attribute_exists(PK)' \
    --expression-attribute-names '{"#state":"state","#error":"error","#updatedAt":"updatedAt"}' \
    --expression-attribute-values \
    "{\":state\":{\"S\":\"failed\"},\":error\":{\"S\":$(json_string "${message:0:500}")},\":updatedAt\":{\"S\":\"$(now)\"}}" \
    >/dev/null || log "WARN could not record the failure on ASSET#${ASSET_ID}"
}

FAILED_LINE=''

# EXIT rather than ERR alone, so an unexpected exit still records a state
on_exit() {
  local status=$?
  if [[ "$status" -ne 0 ]]; then
    report_failure "ingest.sh exited ${status}${FAILED_LINE:+ at line ${FAILED_LINE}}: $(tail -c 400 "$LOG_TAIL_FILE" 2>/dev/null || true)"
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

probe_duration_ms() {
  local seconds
  seconds="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1" || true)"
  if [[ -z "$seconds" || "$seconds" == "N/A" ]]; then
    printf '0'
    return
  fi
  awk -v d="$seconds" 'BEGIN { printf "%d", (d * 1000) + 0.5 }'
}

stream_value() {
  printf '%s\n' "$STREAM_INFO" | awk -F= -v key="$1" '$1 == key { print $2; exit }'
}

mkdir -p "$WORK_DIR"
INPUT_FILE="${WORK_DIR}/asset"
PROXY_FILE="${WORK_DIR}/proxy.mp4"

log "start videoId=${VIDEO_ID} assetId=${ASSET_ID} key=${ASSET_KEY}"

run_step "download s3://${BUCKET_NAME}/${ASSET_KEY}" \
  aws_s3 cp "s3://${BUCKET_NAME}/${ASSET_KEY}" "$INPUT_FILE"

STREAM_INFO="$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 "$INPUT_FILE" || true)"
FORMAT_NAME="$(ffprobe -v error -show_entries format=format_name -of csv=p=0 "$INPUT_FILE" || true)"

CODEC_NAME="$(stream_value codec_name)"
WIDTH="$(stream_value width)"
HEIGHT="$(stream_value height)"
FRAME_RATE="$(stream_value r_frame_rate)"
[[ "$WIDTH" =~ ^[0-9]+$ ]] || WIDTH=0
[[ "$HEIGHT" =~ ^[0-9]+$ ]] || HEIGHT=0

# r_frame_rate is a fraction, 60000/1001 is the 59.94 that belongs on a 60fps timeline
FPS="$(awk -v r="${FRAME_RATE:-0}" 'BEGIN {
  split(r, parts, "/")
  den = (parts[2] == "" ? 1 : parts[2])
  if (den == 0) { print 0 } else { printf "%d", (parts[1] / den) + 0.5 }
}')"

DURATION_MS="$(probe_duration_ms "$INPUT_FILE")"
log "probed codec=${CODEC_NAME:-none} format=${FORMAT_NAME:-unknown} ${WIDTH}x${HEIGHT} ${FPS}fps ${DURATION_MS}ms"

# the editor seeks the proxy, so it is always a faststart mp4: MediaRecorder WebM
# carries neither a duration nor cues, and even an mp4 may not be faststart
if [[ -z "$CODEC_NAME" ]]; then
  run_step "remux audio only proxy.mp4" \
    ffmpeg -nostdin -y -i "$INPUT_FILE" \
    -vn -c:a aac -b:a 128k -movflags +faststart "$PROXY_FILE"
elif [[ "$CODEC_NAME" == "h264" && ("$FORMAT_NAME" == *mp4* || "$FORMAT_NAME" == *mov*) ]]; then
  run_step "copy proxy.mp4" \
    ffmpeg -nostdin -y -i "$INPUT_FILE" \
    -c copy -movflags +faststart "$PROXY_FILE"
else
  run_step "transcode proxy.mp4" \
    ffmpeg -nostdin -y -i "$INPUT_FILE" \
    -c:v libx264 -preset veryfast -crf 24 \
    -c:a aac -b:a 128k -movflags +faststart "$PROXY_FILE"
fi

if [[ "$DURATION_MS" -le 0 ]]; then
  DURATION_MS="$(probe_duration_ms "$PROXY_FILE")"
  log "source carried no duration, proxy reports ${DURATION_MS}ms"
fi
if [[ "$DURATION_MS" -le 0 ]]; then
  log "ERROR no duration on the source or the proxy"
  exit 1
fi

run_step "upload proxy.mp4" \
  aws_s3 cp "$PROXY_FILE" "s3://${BUCKET_NAME}/${PROXY_KEY}" \
  --content-type video/mp4

UPDATE_SET='SET #state = :state, #proxyKey = :proxyKey, #durationMs = :durationMs, #updatedAt = :updatedAt'
UPDATE_NAMES='"#state":"state","#proxyKey":"proxyKey","#durationMs":"durationMs","#updatedAt":"updatedAt","#error":"error"'
UPDATE_VALUES="\":state\":{\"S\":\"ready\"},\":proxyKey\":{\"S\":\"${PROXY_KEY}\"},\":durationMs\":{\"N\":\"${DURATION_MS}\"},\":updatedAt\":{\"S\":\"$(now)\"}"

if [[ "$WIDTH" -gt 0 && "$HEIGHT" -gt 0 ]]; then
  UPDATE_SET="${UPDATE_SET}, #width = :width, #height = :height"
  UPDATE_NAMES="${UPDATE_NAMES},\"#width\":\"width\",\"#height\":\"height\""
  UPDATE_VALUES="${UPDATE_VALUES},\":width\":{\"N\":\"${WIDTH}\"},\":height\":{\"N\":\"${HEIGHT}\"}"
fi
if [[ "$FPS" -gt 0 ]]; then
  UPDATE_SET="${UPDATE_SET}, #fps = :fps"
  UPDATE_NAMES="${UPDATE_NAMES},\"#fps\":\"fps\""
  UPDATE_VALUES="${UPDATE_VALUES},\":fps\":{\"N\":\"${FPS}\"}"
fi

run_step "mark ASSET#${ASSET_ID} ready" \
  aws_dynamodb update-item \
  --table-name "$TABLE_NAME" \
  --key "$ITEM_KEY_JSON" \
  --update-expression "${UPDATE_SET} REMOVE #error" \
  --condition-expression 'attribute_exists(PK)' \
  --expression-attribute-names "{${UPDATE_NAMES}}" \
  --expression-attribute-values "{${UPDATE_VALUES}}"

log "done videoId=${VIDEO_ID} assetId=${ASSET_ID} durationMs=${DURATION_MS}"
