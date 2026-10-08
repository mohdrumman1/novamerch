# NovaMerch Hermes — deployment status and access guide

**Document status:** describes what is actually running as of 2026-09-16 (updated same day — freellmapi decommissioned, model provider now direct OpenRouter, fallback chain + daily health-check cron added; see "2026-09-16 incident" note in the Model provider row below), why each piece was chosen, and how to reach it. Companion to [hermes-admin-implementation-plan.md](hermes-admin-implementation-plan.md) (the design/workflow spec) and [hermes-hosting-decision-log.md](hermes-hosting-decision-log.md) (the hosting-cost back-and-forth, kept separately since it's mostly superseded history — its freellmapi section is now historical only, not current state). This doc is written to be self-contained — readable by Claude, Codex, or a human picking this up cold, without needing prior chat context.

## What's live, and why

| Piece | What | Why |
|---|---|---|
| Host | Hetzner CX23, Nuremberg — `novamerch-hermes`, IP `2.28.116.196`. Ubuntu 26.04, real KVM VM. $7.80/mo (incl. VAT + IPv4) | Cheapest always-on option that satisfies "reachable by text whenever," which ruled out running locally on a Mac. A real VM (not a container, unlike Hive DynamicX's box) means the Hermes gateway runs as a normal systemd service — no supervisord workaround needed. |
| Firewall | Hetzner Cloud Firewall `novamerch-hermes-fw`: inbound SSH (22) + ICMP only. Local `ufw` mirrors the same rule. | Nothing else needs to be reachable from the internet — Telegram uses outbound long-polling, freellmapi is loopback-only. Minimal attack surface. |
| Agent harness | Hermes Agent v0.21.2, official installer, `/usr/local/lib/hermes-agent`, uv-managed venv, FHS root layout. Gateway runs as a **systemd user service** (`hermes-gateway.service`, linger enabled so it survives SSH logout / reboot). | Standard Hermes deployment pattern (same harness as Hive DynamicX). Systemd's `Restart=` behavior is the crash watchdog — no extra scripting needed here, unlike the container-based Hive box. |
| Model provider | **Direct OpenRouter** (`provider: openrouter` in `hermes config`), paid key (`OPENROUTER_API_KEY` in `.env`). `model.default: deepseek/deepseek-v4-flash`. **freellmapi is decommissioned** (container stopped 2026-09-16, not deleted — `docker start freellmapi-freellmapi-1` would bring it back if ever wanted, but nothing points at it anymore). | **2026-09-16 incident:** Noah went down with a generic "model provider failed after retries" Telegram error. Root cause: `model.default` was set to `deepseek/deepseek-v4-flash-latest` — a display alias from OpenRouter's `/models` listing (shown there with a `~` prefix, e.g. `~deepseek/deepseek-v4-flash-latest`), **not a literal callable model ID**. Every chat completion 400'd (`... is not a valid model ID`), non-retryable, so it failed immediately on every message with no useful detail in the Telegram error. At the same time, decided to fully retire freellmapi (it was already bypassed for the main chat path — config had moved to direct `provider: openrouter` before this incident, only the now-removed `FREELLMAPI_API_KEY` and the idle container were left over) in favor of a real OpenRouter key with a native fallback chain (see Reliability row below). **Lesson: never set `model.default` (or any model ID passed to `hermes config set` / `--model`) from an OpenRouter `/models` listing entry that starts with `~` — that's an alias marker, not the ID to use.** Verify a candidate ID first: `curl -s https://openrouter.ai/api/v1/models \| python3 -c "import json,sys; [print(m['id']) for m in json.load(sys.stdin)['data'] if 'deepseek' in m['id'].lower()]"` and only use IDs with no leading `~`. Or better, use the interactive picker (`hermes model` / `hermes fallback add`, both require a real TTY — won't run over a piped SSH command) which resolves aliases correctly instead of hand-typing an ID. |
| Integrations | Composio CLI, logged in as `novamerch.au@gmail.com` (org `novamerch.au_workspace`). Connected and confirmed working: **Gmail** (`gmail_snide-reen`, tested via `GMAIL_LIST_LABELS`), **GitHub** (`github_hei-eoan`, tested via `GITHUB_GET_THE_AUTHENTICATED_USER`), **Brevo** (`brevo_nisan-crick`, tested via `BREVO_LIST_EMAIL_CAMPAIGNS` after disabling Brevo's IP-allowlist restriction). `/root/.hermes/AGENTS.md` directs Hermes to route these through `composio execute` instead of its own bundled Gmail/GitHub skills. | Same integration-layer pattern as Hive DynamicX — one credential broker instead of per-service OAuth setups. Brevo specifically because it's NovaMerch's actual outreach-email sending platform (see the published templates in `outreach-copy-2026-09-11.md`), distinct from Gmail's role as the human-style reply channel. Brevo's IP allowlist had to be disabled (`app.brevo.com/security/authorised_ips`) since Composio's outbound calls come from a rotating IP pool, not one fixed address — confirmed by two test calls arriving from two different IPs. Note: Brevo's own `BREVO_GET_ACCOUNT_INFO` tool is broken server-side on Composio's end (`_validate_response() takes 2 positional arguments but 3 were given`) — not a config issue here, other Brevo tools work fine. |
| Chat interface | Telegram bot **@novamerch_admin_bot** (`t.me/novamerch_admin_bot`), connected via long polling (confirmed in gateway logs: `[Telegram] Connected to Telegram (polling mode)`). **DM-pairing access model**, not a static allowlist — same as Hive DynamicX. Rumman and Nick both paired and confirmed live as of 2026-09-12. | No shared/org Telegram account, matching the pattern already established for Hive DynamicX and Nathan. Each person DMs the bot, gets a one-time pairing code, and someone with server access runs `hermes pairing approve telegram <code>`. |
| Agent's own identity | AgentMail inbox **`noah.novamerch@agentmail.to`**, key in `AGENTMAIL_API_KEY` in `.env`. Confirmed live via a real test send (got back a real `message_id`) on 2026-09-12. Key is scoped without `inbox_read` (inbox-metadata lookups 403) but can send and list/read via `/messages` — sufficient for normal use. | Same pattern as Hive DynamicX's `hannah.hive@agentmail.to` — gives the agent a real address of its own for anything that should visibly come from *it*, not from a human mailbox (status/failure alerts, agent-initiated correspondence), keeping Composio Gmail for anything that should look like it's from novamerch.au@ directly. |
| Product sourcing search | No dedicated Alibaba/Accio Composio toolkit exists (Accio has no public API). Wired instead: generic `composio_search` toolkit (`COMPOSIO_SEARCH_WEB` + `COMPOSIO_SEARCH_FETCH_URL_CONTENT`) for supplier/product discovery, added to `/root/.hermes/AGENTS.md` on 2026-09-12. Tested live: query for embroidered-patch suppliers returned real Alibaba listings with MOQ figures. | Confirmed via `composio search "alibaba"` on the server — no Alibaba/Accio-specific toolkit is registered in Composio. This is scraping-based product search only, not a structured inventory/pricing API. Supplier links/names stay subject to the existing customer-facing exposure rule. |
| Supplier negotiation | Noah can draft negotiation emails (price/MOQ/terms) for suppliers reached over email, via Composio Gmail (`GMAIL_CREATE_DRAFT`) — **draft only, human sends.** Alibaba's own message center has no API and is not automated. Added 2026-09-12. | Same drafts-only caution as customer-facing email (admin plan phase-one rule), extended to suppliers — an agent shouldn't commit to pricing/terms language unreviewed. Order-status updates already arrive via Gmail directly from Alibaba, so no separate order-tracking integration was needed. |
| Reliability — process/site watchdog | `noah-alert-watchdog.service` (systemd user service, `/usr/local/bin/noah-alert-watchdog.sh`), polls every 60s: (1) `systemctl --user is-active hermes-gateway`, (2) HTTP status of `https://novamerchau.com`. On either going down/unhealthy, sends one email from `noah.novamerch@agentmail.to` to `novamerch.au@gmail.com`; sends a `[RECOVERED]` email on return to healthy. Re-arms on recovery — no repeat spam while still down. **Tested live 2026-09-12**: deliberately stopped the gateway, both the down-alert and recovery-alert fired correctly (real `message_id`s logged). Logs: `/root/.hermes/logs/alert-watchdog.log`. | Requested explicitly — parity with Hive DynamicX's crash-alert hook, extended to also cover the storefront (`novamerchau.com`), not just the agent process. Note: testing this interrupted an in-flight task Noah was working on at the time — stopping the gateway kills whatever it's mid-turn on, same as any process restart would. **Known gap this watchdog does NOT cover:** it only checks whether the gateway *process* is alive, not whether model calls it's making are actually succeeding — the 2026-09-16 bad-model-ID incident left the process running (no restart, no alert) while every single chat turn 400'd. That gap is what the two rows below close. |
| Reliability — model fallback chain | `hermes fallback list` (config key `fallback_providers` in `config.yaml`): primary `deepseek/deepseek-v4-flash`, then `deepseek/deepseek-v3.2-exp`, then `deepseek/deepseek-chat-v3.1`, all via OpenRouter. Added 2026-09-16, same day freellmapi was retired. | Tried automatically, in order, on rate-limit / 5xx / connection errors from the primary — this is what freellmapi's multi-provider aggregation used to buy, now native to Hermes against one paid OpenRouter key instead of ~34 free-tier providers. **Does not help against a bad/renamed model ID** (that's a non-retryable 400 — Hermes aborts immediately rather than trying the fallback chain), so this complements but doesn't replace the health-check row below. |
| Reliability — daily model health check | Cron job `daily-model-healthcheck` (id `18e42fc02b7b`), `hermes cron`, runs `0 0 * * *` (midnight UTC). The scheduled turn itself IS the test: prompt just asks the agent to reply "model check OK"; if the model provider can't produce a reply, the run fails and `--failure-deliver telegram:8214266486` fires a Telegram alert. Silent (no message) when healthy. Added 2026-09-16, in direct response to the incident above — this is the check that would have caught it same-day instead of leaving it silently broken until someone noticed Noah wasn't replying. | Check status any time: `hermes cron list` / `hermes cron runs 18e42fc02b7b` / `hermes cron incidents` on the server. To change the alert target: `hermes cron edit 18e42fc02b7b --failure-deliver <target>` (grammar: `telegram:<chat_id>`, `local` to silence, etc. — see `hermes cron create --help`). |
| Data/scraping tools (monid) | **Guardrails: [hermes-monid-guardrails.md](hermes-monid-guardrails.md), deployed 2026-09-19 as a section of `/root/.hermes/AGENTS.md` (backup: `AGENTS.md.bak-pre-monid-20260919`); update both together.** Monid is business discovery only, one approved query per paid run, never sends/approves/promotes leads. Monid CLI `@monid-ai/cli` v0.1.7 installed globally on the server (`monid --version`), `monid setup --client hermes` run, and the Monid skill installed into Hermes via `hermes skills install https://monid.ai/SKILL.md --name monid --yes` (source: url, community, enabled; Hermes scan verdict SAFE, one MEDIUM `unpinned_npm_install` note from the skill's own `@latest` install line). Installed 2026-09-19. API key added 2026-09-19 (label `main`, active, key lives in monid's own config on the server, not in `.env` or this repo). Balance at that time: US$0.91. | Gives Noah a catalogue of paid scraping/enrichment endpoints for gaps the existing Composio tools (Gmail, GitHub, Brevo, `composio_search`) don't cover. Monid runs spend the Monid account balance, so Noah should prefer Composio and any tool already configured, and use monid only when those don't fit. Keep the CLI and skill on the same version: if `monid --version` and the skill's `version:` frontmatter differ, run `npm install -g @monid-ai/cli@latest` and re-run `hermes skills install https://monid.ai/SKILL.md --name monid --yes`. To rotate the key: create a new one at https://app.monid.ai/access/api-keys, then on the server `monid keys add -k <key> -l <label>` and `monid keys activate -l <label>`; check with `monid keys list` and `monid balance`. |

## Not yet done

- **Alibaba Open Platform integration deliberately not pursued.** Order-status updates already arrive via Gmail (Alibaba emails novamerch.au@ directly), so the Open Platform API isn't needed for that. Decided 2026-09-12.
- **ChatGPT/Codex OAuth was never completed** for this agent — started once, then deliberately abandoned in favor of freellmapi-only, per an explicit "why do I need this when I want freellmapi" redirect. Superseded 2026-09-16 (freellmapi retired for direct OpenRouter — see Model provider row above), but the OAuth path was still never set up; can be added later with `hermes auth add openai-codex --type oauth` as a paid-but-already-subscribed fallback for harder tasks, if ever wanted.
- A cron-scheduled daily inbox brief + auto-drafting workflow (discussed 2026-09-12, not yet built — Rumman plans to ask Noah directly; scope it as draft-only, no autonomous sends, per the admin plan's phase-one rules, if it gets built).
- **freellmapi container is stopped, not removed** — `docker rm`/compose teardown + Deepseek-funding decision were never revisited since the whole provider is now retired; safe to fully delete (`docker rm freellmapi-freellmapi-1`, then whatever's under `/root/freellmapi/`) whenever someone wants to reclaim the disk, no rush.

## How to access things

**SSH into the server:**
```
ssh -i ~/.ssh/id_ed25519_novamerch root@2.28.116.196
```
(Key is local to Rumman's Mac, not committed to this repo — regenerate and re-add via Hetzner's console if lost.)

**Gateway service (Hermes/Telegram):**
```
hermes gateway status                        # is it running
hermes gateway start / stop / restart
journalctl --user -u hermes-gateway -f        # live logs
journalctl --user -u hermes-gateway --no-pager -n 100   # recent logs
```

**Approve a Telegram pairing request** (after someone DMs the bot and gets a code):
```
hermes pairing approve telegram <code>
```

**Check/change the model provider and default model** (do this instead of hand-editing `config.yaml`):
```
hermes config get model                 # shows current default + provider — sanity-check after ANY change here
hermes model                            # interactive picker to change it — needs a real TTY, will not run over a piped SSH command
hermes fallback list                    # show the fallback chain
hermes fallback add                     # interactive picker to append one — same TTY requirement as `hermes model`
```
Before ever hand-typing a model ID (e.g. via `hermes config set model.default <id>`), verify it's real and not a `~`-prefixed alias from the `/models` listing — see the 2026-09-16 incident note in the Model provider row above for exactly what goes wrong otherwise:
```
curl -s https://openrouter.ai/api/v1/models | python3 -c "
import json,sys
for m in json.load(sys.stdin)['data']:
    if 'deepseek' in m['id'].lower(): print(m['id'])
"
```
Only use IDs with no leading `~` in that output.

**Daily model health check** (catches "gateway running but every model call is failing" — the exact failure mode the process/site watchdog above can't see):
```
hermes cron list                        # confirm daily-model-healthcheck is [active]
hermes cron runs 18e42fc02b7b           # recent run history
hermes cron incidents                   # any acknowledged/unacknowledged failures
```

**freellmapi dashboard** (decommissioned 2026-09-16 — container stopped, kept only for reference in case it's ever revived; self-hosted, loopback-only by design — reach it via tunnel):
```
ssh -i ~/.ssh/id_ed25519_novamerch -L 3011:127.0.0.1:3001 root@2.28.116.196 -N
```
then open `http://localhost:3011` in a browser (won't respond while the container is stopped — `docker start freellmapi-freellmapi-1` first). Login: `admin@novamerch-hermes.local` (placeholder — change email/password in Settings if wanted).

**Where secrets live:**
- `/root/.hermes/.env` on the server — `OPENROUTER_API_KEY`, `TELEGRAM_BOT_TOKEN`. Not in this repo, not in git anywhere. (`FREELLMAPI_API_KEY` removed 2026-09-16 along with the provider it authenticated.)
- Composio's own credentials (Gmail/GitHub/Brevo OAuth tokens) live in Composio's backend, not on this server — the server only holds a CLI session (`composio whoami` to check it's still logged in as `novamerch.au@gmail.com`).
- freellmapi's own provider keys (OpenRouter, Deepseek), if the container is ever revived, are encrypted at rest in its own SQLite store inside the Docker container, keyed by `ENCRYPTION_KEY` in `/root/freellmapi/.env` on the server — separate from and now superseded by the `OPENROUTER_API_KEY` Hermes uses directly.

**Composio CLI on the server** (for checking/adding connections directly):
```
export PATH=$HOME/.local/bin:$PATH   # composio isn't on PATH by default in a non-interactive shell
composio connections list
composio search "<what you want to do>"
composio execute <TOOL_SLUG> --account <word_id> -d '{...}'
```

**Context file the agent itself reads:** `/root/.hermes/AGENTS.md` on the server — tells Hermes which Composio accounts to use for what, and points it at this repo's admin plan for operating rules (drafts-only, no supplier-info leakage, no fabricated prices/dates). Not in this git repo (it's server-local config), but its content is a close mirror of the "Existing foundations" and "Operating rules" sections of [hermes-admin-implementation-plan.md](hermes-admin-implementation-plan.md) — update both together if the rules change.
