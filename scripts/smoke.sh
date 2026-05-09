#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${SMOKE_BASE_URL:-https://poolcleaningdude.com}"

case "$BASE_URL" in
  http://*|https://*) ;;
  *)
    echo "SMOKE_BASE_URL must start with http:// or https://" >&2
    exit 2
    ;;
esac

BASE_URL="${BASE_URL%/}"
ROUTES=(
  "/"
  "/contact-us"
  "/services"
  "/areas/wayne-pa"
  "/pool-opening"
)

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

for route in "${ROUTES[@]}"; do
  body_file="$TMP_DIR/body-${route//\//_}.html"
  url="${BASE_URL}${route}"
  status="$(curl --silent --show-error --max-time 20 --output "$body_file" --write-out "%{http_code}" "$url")"

  if [[ "$status" != "200" ]]; then
    echo "Smoke check failed: $url returned HTTP $status" >&2
    exit 1
  fi

  if [[ ! -s "$body_file" ]]; then
    echo "Smoke check failed: $url returned an empty body" >&2
    exit 1
  fi
done

if ! grep -q "Pool Cleaning Dude" "$TMP_DIR/body-_.html"; then
  echo "Smoke check failed: homepage is missing Pool Cleaning Dude brand text" >&2
  exit 1
fi

echo "Smoke checks passed for $BASE_URL"
