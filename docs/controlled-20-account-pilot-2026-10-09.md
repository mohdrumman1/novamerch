# Controlled 20-account pilot  -  Phase A

**Status:** built as a review-and-approval pilot. It is not an automatic-send campaign.

**Queue audit  -  9 October 2026:** no verified, sports-club, consent- or referral-based accounts are presently available in Airtable for this pilot. The existing historical records are mainly Google Places chiropractic and veterinary contacts; their public contact details and `Ready to Email` label do not establish permission. No records were relabelled or added to the pilot queue. Build the first ten only from inbound enquiries, explicit referrals, or other documented permission.

## Objective

Produce the first attributable, high-quality quote opportunities from one narrowly defined account type. The success measure is qualified quote requests and recorded gross profit, not email volume or open rates.

## Campaign definition

| Field | Value |
|---|---|
| Campaign ID | `pilot-2026-10-clubwear` |
| Segment | Sports clubs and community teams with a credible upcoming uniform, registration, season-launch or event trigger |
| Maximum | 20 unique organisations total; no daily quota pressure |
| Copy test | `clubwear-v1` only for the first 10 approved contacts; compare any next variant only after recording outcomes |
| Offer | A practical uniform/options pack: provide logo, approximate quantity and deadline; NovaMerch returns suitable options and landed-price ranges |
| Stop condition | Any DNC, hard bounce, provider block, complaint, ambiguous permission, or material quality concern pauses that account immediately |

## Who can enter

An account must meet every condition before it is made send-eligible:

1. The organisation and buying trigger are verified from a first-party source, referral or direct conversation.
2. There is a documented permitted `Contact Basis`: requested material, existing customer relationship or express consent. A public email address is not enough.
3. `Suppressed` is false, there is no prior reply/bounce/provider block and there is one valid business email.
4. `Campaign ID` is `pilot-2026-10-clubwear`, `Copy Version` is populated, and the approving owner and timestamp are recorded.
5. The opportunity is plausibly capable of a worthwhile group order. Do not record or disclose internal margin details in customer-facing material.

The executable selector in `admin-panel/src/lib/outreach-control.ts` now enforces the segment, campaign, human approval, duplicate-recipient removal and 20-account maximum. It is selector-only: it cannot send, write Airtable, or override suppression.

## Airtable review workflow

Use the existing **Phase A - Review Queue** and, for each selected record, fill in:

| Field | Required value |
|---|---|
| Contact Basis | Specific source and scope of permission, not merely "public email" |
| Campaign ID | `pilot-2026-10-clubwear` |
| Copy Version | `clubwear-v1` |
| Status | `Ready to Email` only after every other field is complete |
| Notes | Buying trigger, source checked, approver and date |

No lead is bulk-promoted. The first 10 are reviewed individually, then outcomes are reviewed before considering the remaining 10.

## Permission-first inbound path

The public website intake endpoint now records a new inbound enquiry with a timestamped `Contact Basis` of **Requested material via website enquiry**. This means genuine quote-form enquiries arrive as reviewable, consent-evidenced leads rather than being mixed with found public-email records. It keeps the lead at `New`; it does not mark it `Ready to Email`, clear suppression or initiate a sequence.

The sports-clubs CTA now passes `pilot-2026-10-clubwear` and `sports-clubs-v1` into the intake form. New inbound leads therefore carry campaign and copy attribution from the first touch, allowing the weekly review to compare quote outcomes without exposing internal economics externally.

For a repeat form enquiry, the existing lead keeps its operational status and suppression state. The enquiry is appended to its notes, while `Campaign ID` and `Copy Version` record the latest attributable form touch.

### Release verification

**Production verified  -  9 October 2026.** The sports-club CTA and admin intake endpoint are live. A labelled synthetic website enquiry returned successfully, was created as `New` with the expected contact basis, campaign and copy version, was verified in Airtable, then deleted. No customer outreach was sent or enabled by this release. Retain the same verification sequence for any material future changes to the form or intake endpoint.

## Copy: approved factual starting point

**Subject:** Clubwear options for your next [season/event]

Hi [first name/team],

[Permission/context in one factual sentence.] If you are reviewing clubwear for [trigger], we can put together practical options for your logo, quantity and deadline.

Reply with those three details and we will return a short, suitable options pack with landed-price ranges. If this is not useful, just say so and we will not follow up.

Regards,
NovaMerch

Do not use customer names, logos, photos, testimonials, supplier details, internal cost, profit or margin without the relevant written permission. In particular, Cooks Hill may not be presented as proof without written approval.

## Execution and learning loop

1. Send only after the DNC gate has passed for that recipient immediately before dispatch.
2. Record the provider message ID, send timestamp, campaign and copy version.
3. Check inbound responses each business day. An explicit opt-out, hard bounce or block suppresses immediately; any other reply pauses follow-ups for human handling.
4. At day 10, calculate accepted sends, positive replies, quote requests, quotes, wins, quoted gross profit and won gross profit by campaign/copy.
5. Change exactly one variable for the next batch: target trigger, offer, subject, opening line or follow-up timing. Do not change several variables at once.

## Release gate

The pilot cannot be activated in the sender until DNC v2 has a restricted Airtable integration and passes one shadow-to-write reconciliation. Until then, this document and the selector are a safe preparation layer only.
