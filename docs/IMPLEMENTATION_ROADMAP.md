# NovaMerch 2.0 implementation roadmap

## Completed in this milestone

- Public website redesign, product and industry routes, FAQ spacing fixes, and hero video.
- Existing admin read/write audit.
- Explicit leads and operations base configuration helpers.
- Read-only operational schema validator and source-reference convention.
- Cloudflare D1 schema for durable jobs and event deduplication.
- Signed, order-scoped approval/tracking token primitives with issuance disabled by default.
- Existing quote request path remains available; production automation is disabled by default.

## Checkpoints

1. Verify Airtable schemas and export backups. Enable the staging operations base only after review.
2. Route staged inbound quote requests to `Inbound Enquiries`, with durable idempotency and admin queue visibility.
3. Add onboarding, immutable artwork/specification versions, and approval gates before supplier release.
4. Add multi-supplier shipment events, partial fulfilment, and transactional notification adapters.
5. Add issues, returns, refunds, recovery feedback, and profitability reporting.
6. Add signed tracking and approval links, staff roles/MFA, security review, and regression testing.

Production Airtable writes and real customer messages remain disabled until the checkpoint review is recorded.
