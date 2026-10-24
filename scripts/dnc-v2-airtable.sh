#!/usr/bin/env bash
# Narrow, idempotent Airtable DNC writer. It never sends email or creates data.
set -euo pipefail

readonly BASE_ID='appxYYtl9qnkcgUVx'
readonly TABLE_ID='tbl1p7cvWR84ZjoKD'
readonly TOKEN_FILE='/root/.hermes/secrets/novamerch_dnc_airtable_pat'
readonly API_URL="https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}"

usage() {
  printf '%s\n' 'Usage: dnc-v2-airtable.sh --sender-email EMAIL --occurred-at ISO8601 --source-ref SAFE_REF [--apply]'
}

sender_email=''
occurred_at=''
source_ref=''
apply=false

while (($#)); do
  case "$1" in
    --sender-email) sender_email="${2:-}"; shift 2 ;;
    --occurred-at) occurred_at="${2:-}"; shift 2 ;;
    --source-ref) source_ref="${2:-}"; shift 2 ;;
    --apply) apply=true; shift ;;
    --help|-h) usage; exit 0 ;;
    *) usage >&2; exit 64 ;;
  esac
done

# These constraints prevent Airtable-formula injection and forbid bodies/PII in the audit reference.
[[ "$sender_email" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]] || {
  printf '%s\n' 'invalid_sender_email' >&2; exit 64;
}
[[ "$occurred_at" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}T ]] || {
  printf '%s\n' 'invalid_occurred_at' >&2; exit 64;
}
[[ "$source_ref" =~ ^[A-Za-z0-9._:-]{1,120}$ ]] || {
  printf '%s\n' 'invalid_source_ref' >&2; exit 64;
}
[[ -r "$TOKEN_FILE" ]] || { printf '%s\n' 'credential_unavailable' >&2; exit 78; }

token="$(<"$TOKEN_FILE")"
formula="LOWER({Email}) = '${sender_email,,}'"
response="$(curl --fail --silent --show-error --get "$API_URL" \
  -H "Authorization: Bearer ${token}" \
  --data-urlencode "filterByFormula=${formula}" \
  --data-urlencode 'fields[]=Email' \
  --data-urlencode 'fields[]=Suppressed' \
  --data-urlencode 'fields[]=Replied Date' \
  --data-urlencode 'fields[]=Status' \
  --data-urlencode 'fields[]=Notes')"

count="$(jq '.records | length' <<<"$response")"
if [[ "$count" == '0' ]]; then printf '%s\n' 'no_unique_match'; exit 0; fi
# The formula is an exact, case-insensitive match on one mailbox, so several rows can only be
# duplicate records of the same recipient. An implausibly large count means something is wrong.
if (( count > 10 )); then printf '%s\n' 'ambiguous_match'; exit 0; fi

# Other mailboxes at the same domain are reported on stderr and never written.
domain="${sender_email#*@}"
siblings="$(curl --fail --silent --show-error --get "$API_URL" \
  -H "Authorization: Bearer ${token}" \
  --data-urlencode "filterByFormula=AND(FIND('@${domain,,}', LOWER({Email})) > 0, LOWER({Email}) != '${sender_email,,}', NOT({Suppressed}))" \
  --data-urlencode 'fields[]=Email')" || siblings='{"records":[]}'
printf 'domain_siblings_unsuppressed=%s\n' "$(jq '.records | length' <<<"$siblings")" >&2

pending="$(jq -c '[.records[] | select((.fields["Suppressed"] // false) != true)]' <<<"$response")"
pending_count="$(jq 'length' <<<"$pending")"
if [[ "$pending_count" == '0' ]]; then printf '%s\n' 'already_suppressed'; exit 0; fi

if [[ "$apply" != 'true' ]]; then printf '%s\n' 'unique_match_shadow'; exit 0; fi

reply_date="${occurred_at:0:10}"
while IFS= read -r rec; do
  record_id="$(jq -r '.id' <<<"$rec")"
  existing_notes="$(jq -r '.fields["Notes"] // ""' <<<"$rec")"
  audit_note="DNC v2 explicit opt-out recorded ${occurred_at}. Source ref: ${source_ref}."
  if [[ -n "$existing_notes" ]]; then audit_note="${existing_notes}"$'\n'"${audit_note}"; fi

  payload="$(jq -n --arg status 'Do Not Contact' --arg note "$audit_note" --arg date "$reply_date" \
    '{fields: {Status: $status, Suppressed: true, "Replied Date": $date, Notes: $note}}')"
  curl --fail --silent --show-error --request PATCH "${API_URL}/${record_id}" \
    -H "Authorization: Bearer ${token}" \
    -H 'Content-Type: application/json' \
    --data "$payload" >/dev/null
done < <(jq -c '.[]' <<<"$pending")
printf 'records_updated=%s\n' "$pending_count" >&2
printf '%s\n' 'suppressed'
