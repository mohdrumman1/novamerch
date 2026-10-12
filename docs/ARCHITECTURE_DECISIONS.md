# Architecture decisions

- **Airtable ownership:** Base 1 (`appxYYtl9qnkcgUVx`) remains outbound leads. Base 2 (`appkQYN4Gcb1pSzu1`) is the target operational base. Configuration names both explicitly.
- **Migration:** incremental, feature-flagged, read-only comparison first. New IDs are created by Airtable; every migrated record stores a source-reference and mapping record.
- **Durability:** D1 stores job state, idempotency keys, and event ledger. Cloudflare Workflows is the delayed/retry orchestrator. Queues are deferred until measured throughput requires them.
- **Files:** R2 is the preferred attachment store once signed upload/download routes are added; no existing storage is removed in this milestone.
- **Email:** EmailJS/Resend remain intact. Brevo is an opt-in adapter and must reconcile provider message IDs/webhooks before retrying uncertain sends.
- **Security:** current admin auth is one shared username/HMAC cookie. Individual staff identities, roles, MFA, revocation, and sensitive action logs are required before production financial automation.
