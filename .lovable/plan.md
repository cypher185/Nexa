## SMM Services — Full automated panel (generic SMM panel API)

A new top-level section at `/smm` that lets users order social media marketing services (likes, followers, views, etc.) paid from their wallet. Orders are auto-placed against an upstream SMM panel and their status auto-syncs in the background.

### What the user gets

- New nav entry "SMM Services" → `/smm` (separate from the accounts marketplace).
- `/smm` — browse all available services, grouped by platform (Instagram, TikTok, YouTube, etc.) and type (Followers, Likes, Views, …).
- `/smm/$serviceId` — service detail + order form (target link, quantity within service min/max, live price preview, "Order" button → wallet-deducts).
- `/dashboard/smm-orders` (under `_authenticated`) — user's SMM order history with live status (Pending / In Progress / Completed / Partial / Refund / Canceled), remains count, and refund amount if partial.
- Wallet auto-refunds when the panel returns `Canceled` or the partial-refund portion of `Partial`.

### What the admin gets (new tabs under `/admin`)

- **SMM Providers** — add/edit upstream panels. Fields: name, API URL, API key, enabled. Test-connection button (hits `/balance`). Multiple panels supported; each service is tied to one.
- **SMM Services** — list of synced services. "Sync from provider" button pulls the provider's `services` list. Per service: enabled toggle, category override, display name override, **markup %** (final user rate = provider rate × (1 + markup/100)), min/max overrides, visible-on-site toggle.
- **SMM Orders** — all user orders, filter by status/user/service, manual "Refresh status", manual refund, delete log.
- Existing admin can delete SMM order logs (matches the earlier "admin can delete logs" rule).

### Data model (new tables, kobo-based to match existing schema)

```text
smm_providers(id, name, api_url, api_key_encrypted, enabled, balance_kobo, last_synced_at, created_at)
smm_categories(id, name, slug, sort_order)            -- display categories (Instagram, TikTok…)
smm_services(
  id, provider_id, provider_service_id,
  category_id, name, type,                            -- type: Default | Custom Comments | Package | Drip-feed | Subscriptions
  rate_per_1000_kobo,                                 -- provider rate, snapshot at sync
  markup_pct numeric,                                 -- admin-set
  min_qty int, max_qty int,
  dripfeed boolean, refill boolean, cancel boolean,
  enabled boolean, visible boolean,
  description text, updated_at
)
smm_orders(
  id, user_id, service_id, provider_id,
  provider_order_id text,                             -- returned by panel
  link text, quantity int,
  charge_kobo, refund_kobo default 0,
  status smm_order_status,                            -- pending|in_progress|completed|partial|canceled|refunded|failed
  start_count int, remains int,
  last_polled_at, created_at, updated_at
)
```

Standard grants + RLS:
- `smm_providers`, all admin tables: admin-only via `has_role(auth.uid(),'admin')`.
- `smm_categories`, `smm_services`: `SELECT` to `anon` + `authenticated` when `visible=true` and `enabled=true`; full to admin.
- `smm_orders`: user can `SELECT` their own rows; `INSERT` via server fn only; admin full access (incl. delete).

### Server functions (TanStack `createServerFn`, all in `src/lib/smm/*.functions.ts`)

User-facing (use `requireSupabaseAuth`):
- `listSmmCatalog()` — public, returns enabled+visible services grouped by category with final user rate.
- `getSmmService(id)` — public, single service detail.
- `placeSmmOrder({ serviceId, link, quantity })` — validates qty within min/max, computes `charge_kobo = ceil(rate * qty / 1000)`, atomically debits wallet via `wallet_transactions(type='purchase')`, calls provider `add` endpoint, stores `provider_order_id`, returns the order.
- `listMySmmOrders()` — current user's orders.

Admin-only (`requireSupabaseAuth` + `has_role` check):
- `adminListSmmProviders / upsert / delete / testConnection`.
- `adminSyncSmmServices(providerId)` — calls `services`, upserts into `smm_services` (preserves admin overrides).
- `adminListSmmOrders / refreshSmmOrderStatus / refundSmmOrder / deleteSmmOrder`.

Background status sync:
- Server route `POST /api/public/smm/poll` (signature-verified with a `SMM_CRON_SECRET`) iterates pending/in_progress orders, calls provider `status` (multi if supported), updates rows, and credits wallet refunds for `Canceled` / `Partial`. Intended to be hit by pg_cron or external scheduler every ~2 min.

### Upstream SMM Panel API (generic — same shape across JAP/Peakerr/SMMStone/etc.)

All providers expose `POST {api_url}` with form-encoded body and a shared `key`:

```text
{ key, action: "services" }                              → [{ service, name, type, category, rate, min, max, dripfeed, refill, cancel }, ...]
{ key, action: "add", service, link, quantity }          → { order }
{ key, action: "status", order } | { ..., orders: "1,2"} → { status, charge, start_count, remains, currency } (or keyed object)
{ key, action: "balance" }                               → { balance, currency }
{ key, action: "refill", order }                         → { refill }
```

Implemented once in `src/lib/smm/panel-client.server.ts`. API keys stored as Lovable Cloud secrets per provider (`SMM_PROVIDER_<ID>_KEY`) — added via `add_secret` when admin creates a provider, never stored plaintext in the DB.

### UI / routes added

```text
src/routes/smm.tsx                               -- /smm catalog (layout + index)
src/routes/smm.$serviceId.tsx                    -- service detail + order form
src/routes/_authenticated/smm-orders.tsx        -- user's SMM order history
src/routes/admin.smm-providers.tsx              -- providers CRUD + test
src/routes/admin.smm-services.tsx               -- services list, sync, markup
src/routes/admin.smm-orders.tsx                 -- all orders, manual ops, delete
src/routes/api/public/smm/poll.ts               -- cron-callable status sync
```

Existing site chrome / admin nav updated to surface the new sections; site-chrome top nav gets an "SMM" link; admin bottom nav scrolls to include the 3 new tabs.

### Currency / FX note

SMM panels typically price in USD per 1000. Schema stores everything in NGN kobo to stay consistent with wallets. Two options handled in admin:

- (a) Sync stores the provider's USD rate and admin sets a manual NGN/USD rate in `admin.settings` → applied at sync time and on every price recompute, OR
- (b) Admin sets the NGN per-1000 rate manually per service (markup % field becomes the override).

Default: (a) with manual NGN/USD on `admin.settings`, falling back to (b) per-service override.

### Secrets requested

- `SMM_CRON_SECRET` — HMAC secret used by `/api/public/smm/poll` for signature verification.
- Per-provider API keys via `add_secret` when admin creates the provider in the UI.

### Out of scope (v1)

- Refill / cancel buttons for users (admin-only initially).
- Drip-feed / subscription order types (the schema stores the flags but UI only supports Default + Package orders in v1).
- Per-service images.

If this looks right I'll switch to build mode and start with the migration + provider client + admin screens, then the public catalog and user order flow.
