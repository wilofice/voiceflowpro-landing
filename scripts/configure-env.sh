#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-.env}"
TOUCH_FILE_CREATED=false

if [[ ! -f "$ENV_FILE" ]]; then
  touch "$ENV_FILE"
  TOUCH_FILE_CREATED=true
fi

if [[ ! -w "$ENV_FILE" ]]; then
  echo "Cannot write to $ENV_FILE" >&2
  exit 1
fi

update_env_var() {
  local file="$1"
  local key="$2"
  local value="$3"
  local tmp
  tmp="$(mktemp)"
  if [[ -s "$file" ]]; then
    grep -v "^${key}=" "$file" >"$tmp" || true
  fi
  printf '%s=%s\n' "$key" "$value" >>"$tmp"
  mv "$tmp" "$file"
}

prompt_for_value() {
  local key="$1"
  local prompt="$2"
  local secret="$3"

  local existing=""
  if existing_line=$(grep -E "^${key}=" "$ENV_FILE" 2>/dev/null); then
    existing="${existing_line#*=}"
  fi

  local display_existing=""
  if [[ -n "$existing" ]]; then
    if [[ "$secret" == "secret" ]]; then
      display_existing="(currently set)"
    else
      display_existing="(currently: $existing)"
    fi
  fi

  local input=""
  if [[ "$secret" == "secret" ]]; then
    read -r -s -p "$prompt $display_existing: " input
    echo
  else
    read -r -p "$prompt $display_existing: " input
  fi

  if [[ -z "$input" && -n "$existing" ]]; then
    input="$existing"
  fi

  if [[ "$key" == "SESSION_SECRET" && -z "$input" ]]; then
    if command -v openssl >/dev/null 2>&1; then
      input="$(openssl rand -hex 32)"
    else
      input="$(LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 64)"
    fi
    echo "Generated SESSION_SECRET value"
  fi

  update_env_var "$ENV_FILE" "$key" "$input"
}

VARIABLES=(
  "SESSION_SECRET|Session secret (leave blank to auto-generate)|secret"
  "STRIPE_SECRET_KEY|Stripe secret key|secret"
  "STRIPE_PRICE_PRO_MONTHLY|Stripe price ID – Pro monthly|"
  "STRIPE_PRICE_PRO_ANNUAL|Stripe price ID – Pro annual|"
  "STRIPE_PRICE_TEAM_MONTHLY|Stripe price ID – Team monthly|"
  "STRIPE_PRICE_TEAM_ANNUAL|Stripe price ID – Team annual|"
  "VITE_STRIPE_PUBLIC_KEY|Stripe publishable key|"
  "VITE_STRIPE_PRICE_PRO_MONTHLY|Stripe price ID (client) – Pro monthly|"
  "VITE_STRIPE_PRICE_PRO_ANNUAL|Stripe price ID (client) – Pro annual|"
  "VITE_STRIPE_PRICE_TEAM_MONTHLY|Stripe price ID (client) – Team monthly|"
  "VITE_STRIPE_PRICE_TEAM_ANNUAL|Stripe price ID (client) – Team annual|"
  "APP_VERSION|App version tag (e.g. 1.0.0)|"
  "DOWNLOAD_WINDOWS_URL|Download URL – Windows build|"
  "DOWNLOAD_WINDOWS_SIZE|Download size label – Windows (e.g. 142 MB)|"
  "DOWNLOAD_WINDOWS_SHA256|SHA256 checksum – Windows build|"
  "DOWNLOAD_WINDOWS_VERSION|Build version – Windows|"
  "DOWNLOAD_MACOS_URL|Download URL – macOS build|"
  "DOWNLOAD_MACOS_SIZE|Download size label – macOS|"
  "DOWNLOAD_MACOS_SHA256|SHA256 checksum – macOS build|"
  "DOWNLOAD_MACOS_VERSION|Build version – macOS|"
  "DOWNLOAD_LINUX_URL|Download URL – Linux build|"
  "DOWNLOAD_LINUX_SIZE|Download size label – Linux|"
  "DOWNLOAD_LINUX_SHA256|SHA256 checksum – Linux build|"
  "DOWNLOAD_LINUX_VERSION|Build version – Linux|"
  "DOWNLOAD_RELEASE_NOTES_URL|Release notes URL|"
)

cat <<HEADER
============================================
 VoiceFlowPro environment configuration tool
 Target file: $ENV_FILE
============================================
HEADER

for entry in "${VARIABLES[@]}"; do
  IFS='|' read -r key prompt secret <<<"$entry"
  prompt_for_value "$key" "$prompt" "$secret"
  echo "Updated $key"
  echo "--------------------------------------------"
done

if [[ "$TOUCH_FILE_CREATED" == true ]]; then
  echo "Created new environment file at $ENV_FILE"
fi

echo "Environment variables saved to $ENV_FILE"
