# Hermes hosting decision log

Running log of hosting choice for NovaMerch's Hermes agent. Not a live status dashboard  -  see [README](README.md) for overall implementation status and [hermes-admin-implementation-plan.md](hermes-admin-implementation-plan.md) for the full design.

## 2026-09-12: Hetzner CX23 rejected on cost

Walked through Hetzner server creation (Nuremberg, Ubuntu 26.04, CX23, 2 vCPU/4GB/40GB SSD) as the cheapest always-on self-managed option identified in the implementation plan's hosting table. Created and attached SSH key (`~/.ssh/id_ed25519_novamerch`, local to Rumman's Mac) and a firewall (`novamerch-hermes-fw`: inbound SSH 22 + ICMP only, outbound unrestricted).

**Server was NOT purchased.** Quoted total was $7.80/mo (server $7.14 + IPv4 $0.66, incl. 10% VAT)  -  rejected: "we are not paying 7.8 USD a month for Hetzner to host our hermes agent."

**Why this matters:** NovaMerch's stated hosting budget for this pilot is effectively $0/month recurring, stricter than the implementation plan's own $15–30/month incremental-spend ceiling (which was written to cover model/tool usage, not assuming zero hosting cost). Any hosting recommendation from here needs to target genuinely free always-on capacity, not "cheapest paid" as previously scoped.

**Leftover artifacts from this attempt** (harmless, no ongoing cost  -  Hetzner firewalls/SSH keys are free to hold unused):
- Hetzner SSH key `novamerch-mac`  -  can stay for whenever a paid host is revisited, or be deleted.
- Hetzner firewall `novamerch-hermes-fw`  -  unattached, no cost, safe to leave or delete.
- No server, no volume, no backups were created  -  no Hetzner billing started.

## Next step: find genuinely free always-on hosting

Options to evaluate, cheapest-first, before reconsidering any paid VPS:

1. **Oracle Cloud "Always Free" tier**  -  Ampere A1 (ARM) compute, up to 4 OCPUs / 24GB RAM combined, no time limit, genuinely $0/month forever (not a trial). Requires a credit card at signup for identity verification only (not charged unless usage exceeds the free allowance, which this workload won't). Known gotcha: free-tier ARM capacity is sometimes unavailable in a given region at signup time due to demand  -  may need to try a few regions or retry.
2. **Railway marginal cost, re-tested**  -  n8n alone is already projected to $5.28/mo against the $5 included Hobby allowance, so a second always-on service adds to an already-exceeded allowance. Still worth a short real measurement (a few days) if Oracle's signup/capacity turns out to be a blocker  -  Hermes gateway's own footprint (mostly idle, polling Telegram) may be small enough that the overage stays under a few dollars, but this is not guaranteed.
3. Local Mac, supervised only  -  the plan's own fallback: $0, but does not satisfy "works whenever I text it" (Rumman's explicit requirement), only usable while the Mac is awake and running.

Do not proceed with any paid host until Oracle Free Tier is confirmed unworkable (signup failure, capacity unavailable in every region tried, or a real functional blocker) or Railway's measured marginal cost comes back acceptable.

## 2026-09-12: Superseded  -  Hetzner purchased and live

Despite the above, the CX23 was purchased (`novamerch-hermes`, Nuremberg, $7.80/mo incl. VAT+IPv4) and Hermes was installed and wired up on it the same day. Recorded here for an accurate history  -  the $0-hosting research above was not acted on.

**Live on `novamerch-hermes` (2.28.116.196):**
- Ubuntu 26.04, real KVM VM (not a container like Hive DynamicX's box  -  systemd works natively, no supervisord workaround needed).
- Hetzner Cloud Firewall `novamerch-hermes-fw`: inbound SSH (22) + ICMP only, everything else dropped; local `ufw` mirrors the same rule as defense in depth.
- Hermes Agent v0.21.2, installed clean via the official installer (`/usr/local/lib/hermes-agent`, uv-managed venv, FHS root layout).
- **freellmapi** ([tashfeenahmed/freellmapi](https://github.com/tashfeenahmed/freellmapi)) self-hosted via Docker Compose, bound to `127.0.0.1:3001` only (never exposed to the internet  -  reach its dashboard via `ssh -L 3011:127.0.0.1:3001 root@2.28.116.196`, then `http://localhost:3011`). Dashboard account: `admin@novamerch-hermes.local` (placeholder email  -  change it in Settings if you want your own).
- freellmapi providers configured: **OpenRouter** (key added, 8 models registered, free-tier `:free` models route at $0 cost  -  confirmed working end to end) and **Deepseek** as a custom OpenAI-compatible endpoint (`deepseek-chat` + `deepseek-reasoner` registered)  -  **currently unusable, account has zero balance** (`402 Insufficient Balance`). Deepseek's API is not free even pay-as-you-go; needs the account funded (even a small deposit) before it'll serve requests. Until then, freellmapi's fallback chain skips it and routes to OpenRouter's free models instead, which is already working.
- Hermes `config.yaml` model block repointed: `provider: custom`, `base_url: http://127.0.0.1:3001/v1`, key via `FREELLMAPI_API_KEY` in `.env` (freellmapi's master dashboard key, prefix `freellmapi-...`, grabbed from the dashboard header), `default: auto` (lets freellmapi's own router pick the best available free model per request rather than pinning one). A separate `sk-cp-...` client-profile key was minted first while scripting the setup before the master key was found  -  redundant now, harmless to leave, can be deleted from the dashboard's Client Profiles page if unwanted.
- ChatGPT/Codex OAuth login was **not completed**  -  started, then explicitly deprioritized in favor of freellmapi-only. Can be added later with `hermes auth add openai-codex --type oauth` if wanted as a paid-but-already-subscribed fallback for harder tasks.

**Not yet done:**
- Telegram bot  -  no `TELEGRAM_BOT_TOKEN` set yet, this is the next step before the agent is reachable by text at all.
- Composio (Gmail/Calendar/GitHub)  -  not connected for NovaMerch's own accounts.
- Agent Mail  -  no dedicated inbox/identity for this agent yet.
- Fund the Deepseek account, or don't  -  OpenRouter's free tier alone may be sufficient; revisit after real usage shows whether its rate limits (50 free req/day without prior $10 spend) are actually a constraint at NovaMerch's volume.
