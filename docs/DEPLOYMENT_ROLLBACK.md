# Deployment and rollback

1. Deploy to the `staging` Wrangler environment with `AIRTABLE_LEADS_BASE_ID`, `AIRTABLE_OPERATIONS_BASE_ID`, `INBOUND_QUOTE_MODE=operations`, and `AUTOMATION_ENABLED=false`.
2. Run schema validation and read-only record comparisons. Export affected Airtable tables before any write.
3. Enable one staged workflow at a time. Keep a mapping export containing source base, source record ID, target record ID, and checksum.
4. Roll back by disabling the feature flag, routing reads/writes back to the prior base, and leaving already-created target records untouched for reconciliation.
5. Never replay historical status corrections as customer notifications. Inspect D1 `event_ledger` before retrying uncertain provider responses.

No production base or customer communication is changed by the current milestone.
