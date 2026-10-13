# DNC v2 Airtable access specification

**Status:** dedicated token created on 9 October 2026; not yet deployed to a worker or used for any Airtable write.

## Purpose

Give the DNC-only worker enough access to suppress a uniquely matched, explicit opt-out. It must not become a general-purpose Airtable, outreach or email credential.

## Required Airtable permission

Create one dedicated Airtable personal access token with only:

- scopes: `data.records:read` and `data.records:write`;
- resource scope: the Nova Merch Leads base only;
- operational use: a single DNC v2 workflow.

**Implementation record:** `NovaMerch DNC v2  -  suppression only` was created with exactly this one-base, two-scope boundary. Its secret value is intentionally not recorded in source control, documentation, chat, browser storage or logs.

Airtable tokens are scoped at base level rather than individual field level. Therefore the worker code - not the token alone - must enforce the allowed table and fields.

## Worker allowlist

The worker may:

1. Read the **Leads** table only to normalise-match the sender email.
2. Re-read the unique matched record immediately before a write.
3. Update only `Status`, `Suppressed`, `Replied Date` and `Notes` when all DNC conditions pass.
4. Append a concise, timestamped internal source reference to `Notes`.
5. Emit only redacted counts to the operator report.

The worker must not:

- access any other base or table;
- create, delete or merge records;
- change email, campaign, copy, consent, revenue, profit or other sales fields;
- send email, create drafts, subscribe contacts or invoke Brevo;
- update a record when the sender has zero or multiple matching leads;
- expose contact identifiers or email bodies in Telegram, logs or reports.

## Implementation

The dedicated helper is [`scripts/dnc-v2-airtable.sh`](../scripts/dnc-v2-airtable.sh). It accepts only a validated sender email, ISO timestamp and non-content source reference. It looks up exactly one normalised-email match and defaults to **shadow mode**. `--apply` is the sole write path; it is idempotent and updates only the four allowlisted fields. Its output is a redacted outcome code only.

## Runtime controls

- Store the token only in the existing protected workflow credential store; never in source control, docs, chat or a browser password manager.
- Make each write idempotent: if already suppressed, report `already_suppressed` and do nothing.
- Require exact explicit opt-out classification and exactly one normalised-email match.
- Keep the first scheduled run in shadow mode, then compare candidates and writes against Airtable manually before enabling the next run.
- Revoke this dedicated token if the DNC workflow is retired, its host changes, or a security review finds misuse.

## Acceptance test

Use a non-production test record or a previously suppressed test account. Verify all of the following:

1. no-match → no Airtable write;
2. ambiguous match → no Airtable write;
3. already suppressed → no Airtable write;
4. unique explicit opt-out → only the four allowlisted fields change;
5. run twice → second run produces no additional modification;
6. report contains counts only, with no customer content or identifiers.

Do not activate the 20-account pilot until this test and one real shadow-to-write reconciliation pass.

### 9 October execution record

- The token was stored on the Hermes host in a dedicated root-owned file (`0600`); its value was then cleared from the local clipboard and is not recorded here.
- The helper was installed with owner-only execute permission (`0700`) and passed shell syntax validation.
- A read-only acceptance run against a deliberately nonexistent address returned `no_unique_match`; no Airtable write was possible from that path.
- The active Noah review was updated to call the helper, not Airtable directly, only for clear explicit opt-outs. A direct scheduled-job run completed and delivered its redacted report successfully.

### 10 October internal write-path acceptance

- A temporary NovaMerch-only test lead with a non-deliverable internal address was created, processed with `--apply`, and verified to receive only the four allowlisted changes (`Status`, `Suppressed`, `Replied Date`, and an appended audit note).
- The temporary record was deleted and then queried again to confirm it was absent. No prospect was used or modified.
- This validates the narrow helper boundary. Keep the first genuine explicit opt-out under observation for end-to-end classification and idempotency evidence.

The 20-account outbound pilot remains review-only until contact-basis and reply checks are also satisfied.
