#!/usr/bin/env bash
set -euo pipefail

# Low-cost, deterministic test monitor. It intentionally handles only the
# owner test sender until the reply path is proven.
export PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin"
STATE_DIR="${STATE_DIR:-$HOME/.hermes/social-inbox}"
STATE_FILE="$STATE_DIR/processed"
LOG_FILE="$STATE_DIR/monitor.log"
mkdir -p "$STATE_DIR"
touch "$STATE_FILE"
exec 9>"$STATE_DIR/lock"
flock -n 9 || exit 0

ACCOUNT="instagram_caries-balt"
SENDER="rxmmn_7"
RECIPIENT_ID="2887892108234459"
# The test sender has one known thread. Inspecting it directly avoids walking
# every historical conversation on every 15-minute run.
TEST_CONVERSATION_ID="aWdfZAG06MzQwMjgyMzY2ODQxNzEwMzAxMjQ0MjYyNTc3MTE0NjA3MTI2MzU5"
REPLY="Hey! We help clubs, businesses and events with custom branded shirts, workwear and merchandise. Is there a particular item or rough quantity you’re looking for?"

log() { printf '%s %s\n' "$(date -Is)" "$*" >> "$LOG_FILE"; }

printf '%s\n' "$TEST_CONVERSATION_ID" | while read -r conversation_id; do
  messages="$(timeout 45 composio execute INSTAGRAM_LIST_ALL_MESSAGES --account "$ACCOUNT" -d "{\"conversation_id\":\"$conversation_id\",\"limit\":10}" 2>>"$LOG_FILE" || true)"
  printf '%s' "$messages" | jq -c '.. | objects | select((.id? and (.from?.username? // "") == "'"$SENDER"'"))' 2>/dev/null | while read -r message; do
    message_id="$(printf '%s' "$message" | jq -r '.id')"
    text="$(printf '%s' "$message" | jq -r '(.message // .text // "") | ascii_downcase')"
    [ -n "$message_id" ] || continue
    grep -Fqx "instagram:$message_id" "$STATE_FILE" && continue
    if ! printf '%s' "$text" | grep -Eq '(shirt|t-?shirt|tee|merch|uniform|apparel|clothing|print|embroider|order|quote|price|cost|quantity|bulk)'; then
      printf 'instagram:%s\n' "$message_id" >> "$STATE_FILE"
      log "ignored non-buying test message $message_id"
      continue
    fi
    result="$(timeout 45 composio execute INSTAGRAM_SEND_TEXT_MESSAGE --account "$ACCOUNT" -d "$(jq -cn --arg id "$RECIPIENT_ID" --arg text "$REPLY" '{recipient_id:$id,text:$text}')" 2>&1 || true)"
    if printf '%s' "$result" | grep -q '"successful": true'; then
      printf 'instagram:%s\n' "$message_id" >> "$STATE_FILE"
      log "replied to $message_id"
    elif printf '%s' "$result" | grep -q '2534022'; then
      # Meta explicitly says the window is closed; do not waste an execution
      # retrying this message. A later inbound message has a different ID.
      printf 'instagram:%s\n' "$message_id" >> "$STATE_FILE"
      log "window closed for $message_id"
    else
      log "send blocked for $message_id: $(printf '%s' "$result" | tr '\n' ' ' | cut -c1-300)"
    fi
  done
done
