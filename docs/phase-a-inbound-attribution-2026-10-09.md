# Phase A inbound attribution release

The sports-clubs CTA now opens the quote form with campaign and copy attribution. The form sends that attribution to the admin intake endpoint.

For each new consented inbound enquiry, the endpoint records:

- `Contact Basis`: requested material via website enquiry, timestamped;
- `Campaign ID`: the captured campaign, defaulting to `direct`;
- `Copy Version`: the captured copy version, defaulting to `website-v1`.

The endpoint leaves all new leads at `New`. It never promotes a lead to an outbound sequence, clears a suppression, or sends an email.

If an inbound email already has a Lead record, the endpoint preserves its operational status and suppression state, appends the enquiry to `Notes`, and records the form’s campaign/copy as the **latest attributable touch**. This makes repeat form requests measurable without reactivating an old lead.

Release verification: submit one labelled synthetic request from an allowed website origin, verify the lead fields in Airtable, then remove the test record. Do not use customer proof, commercial terms, internal cost, profit or margin in public copy.
