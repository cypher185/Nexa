-- =====================================================================
-- NexaLogs — Full Database Schema
-- Run this in the Supabase SQL editor (https://app.supabase.com → SQL).
-- All currency stored as integer KOBO (1 NGN = 100 kobo).
-- =====================================================================

-- 1. EXTENSIONS ---------------------------------------------------------
create extension if not exists "pgcrypto";

-- 2. ENUMS --------------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('admin', 'user');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.product_source as enum ('internal', 'provider');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.stock_status as enum ('available', 'reserved', 'sold');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum ('pending', 'fulfilled', 'refunded', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.wallet_tx_type as enum ('fund', 'purchase', 'refund', 'adjust');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.wallet_tx_status as enum ('pending', 'success', 'failed');
exception when duplicate_object then null; end $$;

-- 3. PROFILES -----------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  is_banned boolean not null default false,
  created_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid());

-- profiles_admin_all is created later, after has_role() is defined


-- 4. USER ROLES (separate table — never on profiles) --------------------
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

-- Security-definer role check (avoid RLS recursion)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

drop policy if exists "user_roles_select_own" on public.user_roles;
create policy "user_roles_select_own" on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists "user_roles_admin_all" on public.user_roles;
create policy "user_roles_admin_all" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Recreate profiles admin policy now that has_role exists
drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 5. WALLETS ------------------------------------------------------------
create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance_kobo bigint not null default 0 check (balance_kobo >= 0),
  updated_at timestamptz not null default now()
);

grant select on public.wallets to authenticated;
grant insert, update, delete on public.wallets to authenticated;
grant all on public.wallets to service_role;

alter table public.wallets enable row level security;

drop policy if exists "wallets_select_own" on public.wallets;
create policy "wallets_select_own" on public.wallets
  for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists "wallets_admin_all" on public.wallets;
create policy "wallets_admin_all" on public.wallets
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 6. WALLET TRANSACTIONS -----------------------------------------------
create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.wallet_tx_type not null,
  status public.wallet_tx_status not null default 'pending',
  amount_kobo bigint not null,
  balance_after_kobo bigint,
  reference text unique,
  korapay_ref text,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists wallet_tx_user_idx on public.wallet_transactions(user_id, created_at desc);
create index if not exists wallet_tx_korapay_ref_idx on public.wallet_transactions(korapay_ref);

grant select, insert, delete on public.wallet_transactions to authenticated;
grant all on public.wallet_transactions to service_role;

alter table public.wallet_transactions enable row level security;

drop policy if exists "wallet_tx_select_own" on public.wallet_transactions;
create policy "wallet_tx_select_own" on public.wallet_transactions
  for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists "wallet_tx_admin_delete" on public.wallet_transactions;
create policy "wallet_tx_admin_delete" on public.wallet_transactions
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "wallet_tx_admin_insert" on public.wallet_transactions;
create policy "wallet_tx_admin_insert" on public.wallet_transactions
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));

-- 7. CATEGORIES ---------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  accent text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

grant select on public.categories to anon, authenticated;
grant all on public.categories to service_role;

alter table public.categories enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select to anon, authenticated using (is_active = true or public.has_role(auth.uid(), 'admin'));

drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all" on public.categories
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 8. EXTERNAL PROVIDERS ------------------------------------------------
create table if not exists public.external_providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  base_url text,
  api_key_secret_name text,
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

grant select on public.external_providers to authenticated;
grant all on public.external_providers to service_role;

alter table public.external_providers enable row level security;

drop policy if exists "providers_admin_all" on public.external_providers;
create policy "providers_admin_all" on public.external_providers
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 9. PRODUCTS -----------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  title text not null,
  description text,
  price_kobo bigint not null check (price_kobo >= 0),
  source public.product_source not null default 'internal',
  provider_id uuid references public.external_providers(id) on delete set null,
  provider_sku text,
  metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(is_active);

grant select on public.products to anon, authenticated;
grant all on public.products to service_role;

alter table public.products enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select to anon, authenticated using (is_active = true or public.has_role(auth.uid(), 'admin'));

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all" on public.products
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 10. ACCOUNT STOCK (credentials) --------------------------------------
create table if not exists public.account_stock (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  credentials text not null,           -- store as encrypted/raw text; reveal to buyer only
  delivery_payload jsonb not null default '{}'::jsonb,
  status public.stock_status not null default 'available',
  sold_to uuid references auth.users(id) on delete set null,
  sold_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists stock_product_status_idx on public.account_stock(product_id, status);
create index if not exists stock_sold_to_idx on public.account_stock(sold_to);

grant select on public.account_stock to authenticated;
grant all on public.account_stock to service_role;

alter table public.account_stock enable row level security;

drop policy if exists "stock_select_own" on public.account_stock;
create policy "stock_select_own" on public.account_stock
  for select to authenticated using (sold_to = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists "stock_admin_all" on public.account_stock;
create policy "stock_admin_all" on public.account_stock
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 11. ORDERS ------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id),
  stock_id uuid references public.account_stock(id),
  price_kobo bigint not null,
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders(user_id, created_at desc);

grant select on public.orders to authenticated;
grant all on public.orders to service_role;

alter table public.orders enable row level security;

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all" on public.orders
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 12. SITE SETTINGS ----------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

grant select on public.site_settings to anon, authenticated;
grant all on public.site_settings to service_role;

alter table public.site_settings enable row level security;

drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "settings_admin_all" on public.site_settings;
create policy "settings_admin_all" on public.site_settings
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 13. AUTO-CREATE profile + wallet + 'user' role on signup -------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));

  insert into public.wallets (user_id, balance_kobo) values (new.id, 0);

  insert into public.user_roles (user_id, role) values (new.id, 'user')
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 14. ATOMIC PURCHASE FUNCTION -----------------------------------------
-- Locks one available stock row, debits wallet, inserts order, returns credentials.
create or replace function public.purchase_account(_product_id uuid)
returns table (order_id uuid, stock_id uuid, credentials text, balance_after_kobo bigint)
language plpgsql security definer set search_path = public
as $$
declare
  _user_id uuid := auth.uid();
  _price bigint;
  _stock_id uuid;
  _credentials text;
  _delivery jsonb;
  _balance bigint;
  _order_id uuid;
begin
  if _user_id is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  -- price
  select price_kobo into _price from public.products where id = _product_id and is_active = true;
  if _price is null then
    raise exception 'PRODUCT_NOT_FOUND';
  end if;

  -- lock wallet
  select balance_kobo into _balance from public.wallets where user_id = _user_id for update;
  if _balance is null then
    insert into public.wallets (user_id, balance_kobo) values (_user_id, 0) returning balance_kobo into _balance;
  end if;
  if _balance < _price then
    raise exception 'INSUFFICIENT_BALANCE';
  end if;

  -- lock one available stock
  select s.id, s.credentials, s.delivery_payload
    into _stock_id, _credentials, _delivery
  from public.account_stock s
  where s.product_id = _product_id and s.status = 'available'
  order by s.created_at
  for update skip locked
  limit 1;

  if _stock_id is null then
    raise exception 'OUT_OF_STOCK';
  end if;

  -- mark stock sold
  update public.account_stock
    set status = 'sold', sold_to = _user_id, sold_at = now()
    where id = _stock_id;

  -- debit wallet
  update public.wallets
    set balance_kobo = balance_kobo - _price, updated_at = now()
    where user_id = _user_id
    returning balance_kobo into _balance;

  -- create order
  insert into public.orders (user_id, product_id, stock_id, price_kobo, status)
  values (_user_id, _product_id, _stock_id, _price, 'fulfilled')
  returning id into _order_id;

  -- record wallet transaction
  insert into public.wallet_transactions (user_id, type, status, amount_kobo, balance_after_kobo, description, metadata)
  values (_user_id, 'purchase', 'success', -_price, _balance,
          'Purchase: ' || _product_id::text,
          jsonb_build_object('order_id', _order_id, 'product_id', _product_id, 'stock_id', _stock_id));

  return query select _order_id, _stock_id, _credentials, _balance;
end;
$$;

grant execute on function public.purchase_account(uuid) to authenticated;

-- 15. CREDIT WALLET (service role / webhook) ---------------------------
create or replace function public.credit_wallet(_user_id uuid, _amount_kobo bigint, _reference text, _korapay_ref text)
returns bigint
language plpgsql security definer set search_path = public
as $$
declare
  _balance bigint;
begin
  if _amount_kobo <= 0 then raise exception 'INVALID_AMOUNT'; end if;

  -- idempotency
  if exists (select 1 from public.wallet_transactions where reference = _reference and status = 'success') then
    select balance_kobo into _balance from public.wallets where user_id = _user_id;
    return _balance;
  end if;

  select balance_kobo into _balance from public.wallets where user_id = _user_id for update;
  if _balance is null then
    insert into public.wallets (user_id, balance_kobo) values (_user_id, 0) returning balance_kobo into _balance;
  end if;

  update public.wallets
    set balance_kobo = balance_kobo + _amount_kobo, updated_at = now()
    where user_id = _user_id
    returning balance_kobo into _balance;

  insert into public.wallet_transactions (user_id, type, status, amount_kobo, balance_after_kobo, reference, korapay_ref, description)
  values (_user_id, 'fund', 'success', _amount_kobo, _balance, _reference, _korapay_ref, 'Wallet funded via Korapay');

  return _balance;
end;
$$;

-- 16. SEED CATEGORIES --------------------------------------------------
insert into public.categories (slug, name, description, icon, accent, sort_order) values
  ('facebook',  'Facebook',  'Aged personal profiles and business managers with active history.', 'f',  'blue',   1),
  ('instagram', 'Instagram', 'Aged Instagram accounts with real followers and clean history.',     'ig', 'pink',   2),
  ('tiktok',    'TikTok',    'TikTok accounts with TikTok Shop and Live enabled.',                 'tk', 'cyan',   3),
  ('x',         'X (Twitter)','Clean, shadowban-free X accounts with active posting history.',     'x',  'white',  4),
  ('gmail',     'Gmail',     'Phone-verified Gmail accounts with recovery email included.',        'gm', 'amber',  5),
  ('youtube',   'YouTube',   'YouTube channels with watch hours and clean monetization history.',  'yt', 'red',    6),
  ('linkedin',  'LinkedIn',  'Real, established LinkedIn accounts ready for outreach.',            'li', 'sky',    7),
  ('snapchat',  'Snapchat',  'Snapchat accounts with high snap scores and clean history.',         'sc', 'yellow', 8)
on conflict (slug) do nothing;

-- =====================================================================
-- PUBLIC STOCK COUNTS
-- account_stock has restrictive RLS (credentials must never leak), so
-- shoppers (anon + authenticated) cannot SELECT it directly. Expose only
-- aggregate available counts via a security-definer RPC.
-- =====================================================================
create or replace function public.get_available_stock(_product_ids uuid[])
returns table(product_id uuid, available_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select product_id, count(*)::bigint
  from public.account_stock
  where status = 'available'
    and product_id = any(_product_ids)
  group by product_id;
$$;

grant execute on function public.get_available_stock(uuid[]) to anon, authenticated;

-- =====================================================================
-- BOOTSTRAP YOUR ADMIN ACCOUNT
-- 1. Sign up through the app with your admin email.
-- 2. Run this once, replacing the email:
--      insert into public.user_roles (user_id, role)
--      select id, 'admin' from auth.users where email = 'YOUR@EMAIL.COM'
--      on conflict do nothing;
-- =====================================================================

-- =====================================================================
-- SMM SERVICES (social media marketing panel reseller)
-- =====================================================================

do $$ begin
  create type public.smm_order_status as enum (
    'pending','in_progress','completed','partial','canceled','refunded','failed'
  );
exception when duplicate_object then null; end $$;

-- Providers (upstream SMM panels — generic JAP/Peakerr-style API)
create table if not exists public.smm_providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  api_url text not null,
  api_key text not null,
  enabled boolean not null default true,
  balance_usd numeric(14,4),
  currency text default 'USD',
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.smm_providers to authenticated;
grant all on public.smm_providers to service_role;
alter table public.smm_providers enable row level security;

drop policy if exists "smm_providers_admin_all" on public.smm_providers;
create policy "smm_providers_admin_all" on public.smm_providers
  for all to authenticated using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- Display categories (Instagram, TikTok, YouTube, …)
create table if not exists public.smm_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

grant select on public.smm_categories to anon, authenticated;
grant insert, update, delete on public.smm_categories to authenticated;
grant all on public.smm_categories to service_role;
alter table public.smm_categories enable row level security;

drop policy if exists "smm_categories_public_read" on public.smm_categories;
create policy "smm_categories_public_read" on public.smm_categories
  for select using (true);

drop policy if exists "smm_categories_admin_all" on public.smm_categories;
create policy "smm_categories_admin_all" on public.smm_categories
  for all to authenticated using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- Services
create table if not exists public.smm_services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.smm_providers(id) on delete cascade,
  provider_service_id text not null,
  category_id uuid references public.smm_categories(id) on delete set null,
  provider_category text,
  name text not null,
  type text,
  rate_usd_per_1000 numeric(14,6) not null default 0,
  markup_pct numeric(6,2) not null default 30,
  min_qty int not null default 1,
  max_qty int not null default 1000000,
  dripfeed boolean not null default false,
  refill boolean not null default false,
  cancel boolean not null default false,
  enabled boolean not null default true,
  visible boolean not null default true,
  description text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (provider_id, provider_service_id)
);

create index if not exists smm_services_category_idx on public.smm_services(category_id);
create index if not exists smm_services_visible_idx on public.smm_services(visible, enabled);

grant select on public.smm_services to anon, authenticated;
grant insert, update, delete on public.smm_services to authenticated;
grant all on public.smm_services to service_role;
alter table public.smm_services enable row level security;

drop policy if exists "smm_services_public_read" on public.smm_services;
create policy "smm_services_public_read" on public.smm_services
  for select using (visible = true and enabled = true);

drop policy if exists "smm_services_admin_all" on public.smm_services;
create policy "smm_services_admin_all" on public.smm_services
  for all to authenticated using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- Orders
create table if not exists public.smm_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_id uuid not null references public.smm_services(id) on delete restrict,
  provider_id uuid not null references public.smm_providers(id) on delete restrict,
  provider_order_id text,
  link text not null,
  quantity int not null,
  charge_kobo bigint not null,
  refund_kobo bigint not null default 0,
  status public.smm_order_status not null default 'pending',
  start_count int,
  remains int,
  provider_charge_usd numeric(14,4),
  last_polled_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists smm_orders_user_idx on public.smm_orders(user_id, created_at desc);
create index if not exists smm_orders_status_idx on public.smm_orders(status);

grant select on public.smm_orders to authenticated;
grant all on public.smm_orders to service_role;
alter table public.smm_orders enable row level security;

drop policy if exists "smm_orders_select_own" on public.smm_orders;
create policy "smm_orders_select_own" on public.smm_orders
  for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

drop policy if exists "smm_orders_admin_all" on public.smm_orders;
create policy "smm_orders_admin_all" on public.smm_orders
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- RPC: charge wallet + create SMM order (called server-side after provider 'add' succeeds)
create or replace function public.create_smm_order(
  _user_id uuid,
  _service_id uuid,
  _link text,
  _quantity int,
  _charge_kobo bigint,
  _provider_order_id text,
  _provider_charge_usd numeric
)
returns table(order_id uuid, balance_kobo bigint)
language plpgsql security definer set search_path = public
as $$
declare
  _balance bigint;
  _provider uuid;
  _order_id uuid;
begin
  if _charge_kobo <= 0 then raise exception 'INVALID_AMOUNT'; end if;
  select provider_id into _provider from public.smm_services where id = _service_id and enabled = true;
  if _provider is null then raise exception 'SERVICE_UNAVAILABLE'; end if;

  select balance_kobo into _balance from public.wallets where user_id = _user_id for update;
  if _balance is null then
    insert into public.wallets (user_id, balance_kobo) values (_user_id, 0) returning balance_kobo into _balance;
  end if;
  if _balance < _charge_kobo then raise exception 'INSUFFICIENT_BALANCE'; end if;

  update public.wallets
    set balance_kobo = balance_kobo - _charge_kobo, updated_at = now()
    where user_id = _user_id
    returning balance_kobo into _balance;

  insert into public.smm_orders (
    user_id, service_id, provider_id, provider_order_id, link, quantity,
    charge_kobo, status, provider_charge_usd
  ) values (
    _user_id, _service_id, _provider, _provider_order_id, _link, _quantity,
    _charge_kobo, 'pending', _provider_charge_usd
  ) returning id into _order_id;

  insert into public.wallet_transactions (user_id, type, status, amount_kobo, balance_after_kobo, description, metadata)
  values (_user_id, 'purchase', 'success', -_charge_kobo, _balance,
          'SMM order: ' || _quantity || ' × ' || _service_id::text,
          jsonb_build_object('smm_order_id', _order_id, 'service_id', _service_id, 'provider_order_id', _provider_order_id));

  return query select _order_id, _balance;
end;
$$;
grant execute on function public.create_smm_order(uuid, uuid, text, int, bigint, text, numeric) to service_role;

-- RPC: refund wallet (used by poll job for canceled / partial)
create or replace function public.refund_smm_order(_order_id uuid, _amount_kobo bigint, _reason text)
returns bigint
language plpgsql security definer set search_path = public
as $$
declare
  _balance bigint;
  _user uuid;
begin
  if _amount_kobo <= 0 then return null; end if;
  select user_id into _user from public.smm_orders where id = _order_id for update;
  if _user is null then raise exception 'ORDER_NOT_FOUND'; end if;

  update public.smm_orders
    set refund_kobo = refund_kobo + _amount_kobo, updated_at = now()
    where id = _order_id;

  select balance_kobo into _balance from public.wallets where user_id = _user for update;
  if _balance is null then
    insert into public.wallets (user_id, balance_kobo) values (_user, _amount_kobo) returning balance_kobo into _balance;
  else
    update public.wallets set balance_kobo = balance_kobo + _amount_kobo, updated_at = now()
      where user_id = _user returning balance_kobo into _balance;
  end if;

  insert into public.wallet_transactions (user_id, type, status, amount_kobo, balance_after_kobo, description, metadata)
  values (_user, 'refund', 'success', _amount_kobo, _balance,
          coalesce(_reason, 'SMM order refund'),
          jsonb_build_object('smm_order_id', _order_id));

  return _balance;
end;
$$;
grant execute on function public.refund_smm_order(uuid, bigint, text) to service_role;
-- =====================================================================

-- ============= SMM auto-poll via pg_cron =============
create extension if not exists pg_cron;
create extension if not exists pg_net;

create or replace function public.admin_setup_smm_cron(_url text, _secret text, _every_minutes int default 2)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  _job_name text := 'smm-poll';
  _sql text;
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'FORBIDDEN';
  end if;
  if _every_minutes < 1 or _every_minutes > 60 then
    raise exception 'INVALID_INTERVAL';
  end if;

  perform cron.unschedule(_job_name) where exists (select 1 from cron.job where jobname = _job_name);

  _sql := format(
    $cmd$ select net.http_post(url := %L, headers := jsonb_build_object('Content-Type','application/json','x-cron-secret',%L), body := '{}'::jsonb) $cmd$,
    _url, _secret
  );
  perform cron.schedule(_job_name, format('*/%s * * * *', _every_minutes), _sql);
end;
$$;
grant execute on function public.admin_setup_smm_cron(text, text, int) to authenticated, service_role;

create or replace function public.admin_disable_smm_cron()
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'FORBIDDEN';
  end if;
  perform cron.unschedule('smm-poll') where exists (select 1 from cron.job where jobname = 'smm-poll');
end;
$$;
grant execute on function public.admin_disable_smm_cron() to authenticated, service_role;

create or replace function public.admin_smm_cron_status()
returns table (jobname text, schedule text, active boolean)
language sql
security definer
set search_path = public, extensions
as $$
  select j.jobname, j.schedule, j.active
  from cron.job j
  where j.jobname = 'smm-poll'
    and public.has_role(auth.uid(), 'admin');
$$;
grant execute on function public.admin_smm_cron_status() to authenticated, service_role;
-- =====================================================================

-- ============= SMM Poll & Order Event Logs =============
-- Summary row per poll run
create table if not exists public.smm_poll_log (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  checked int not null default 0,
  updated int not null default 0,
  errors jsonb,
  source text,                 -- 'cron' | 'manual'
  ok boolean not null default true
);
create index if not exists smm_poll_log_started_idx on public.smm_poll_log(started_at desc);
grant select on public.smm_poll_log to authenticated;
grant all on public.smm_poll_log to service_role;
alter table public.smm_poll_log enable row level security;
drop policy if exists "smm_poll_log_admin_read" on public.smm_poll_log;
create policy "smm_poll_log_admin_read" on public.smm_poll_log
  for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- Per-order status update history
create table if not exists public.smm_order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.smm_orders(id) on delete cascade,
  poll_id uuid references public.smm_poll_log(id) on delete set null,
  old_status public.smm_order_status,
  new_status public.smm_order_status,
  remains int,
  start_count int,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists smm_order_events_order_idx on public.smm_order_events(order_id, created_at desc);
grant select on public.smm_order_events to authenticated;
grant all on public.smm_order_events to service_role;
alter table public.smm_order_events enable row level security;
drop policy if exists "smm_order_events_admin_read" on public.smm_order_events;
create policy "smm_order_events_admin_read" on public.smm_order_events
  for select to authenticated using (public.has_role(auth.uid(),'admin'));
-- =====================================================================

-- =====================================================================
-- PATCH: Fixes for SMM, bans, auto-poll
-- Re-run this whole block in the Supabase SQL editor.
-- =====================================================================

-- 1) Category logo URL (admin can paste an official logo URL)
alter table public.smm_categories add column if not exists logo_url text;

-- 2) Cross-table embeds: declare FK from .user_id to profiles.id so
-- PostgREST can embed `profiles:user_id(email)` in admin tables.
do $$ begin
  alter table public.wallet_transactions
    add constraint wallet_transactions_user_profile_fk
    foreign key (user_id) references public.profiles(id) on delete cascade;
exception when duplicate_object then null; when others then null; end $$;

do $$ begin
  alter table public.orders
    add constraint orders_user_profile_fk
    foreign key (user_id) references public.profiles(id) on delete cascade;
exception when duplicate_object then null; when others then null; end $$;

do $$ begin
  alter table public.smm_orders
    add constraint smm_orders_user_profile_fk
    foreign key (user_id) references public.profiles(id) on delete cascade;
exception when duplicate_object then null; when others then null; end $$;

-- 3) Ban enforcement at the DB level
create or replace function public.assert_not_banned(_uid uuid) returns void
language plpgsql stable security definer set search_path = public as $$
begin
  if exists (select 1 from public.profiles where id = _uid and is_banned = true) then
    raise exception 'USER_BANNED';
  end if;
end; $$;
grant execute on function public.assert_not_banned(uuid) to authenticated, service_role;

create or replace function public.purchase_account(_product_id uuid)
returns table (order_id uuid, stock_id uuid, credentials text, balance_after_kobo bigint)
language plpgsql security definer set search_path = public
as $$
declare
  _user_id uuid := auth.uid();
  _price bigint; _stock_id uuid; _credentials text; _delivery jsonb;
  _balance bigint; _order_id uuid;
begin
  if _user_id is null then raise exception 'NOT_AUTHENTICATED'; end if;
  perform public.assert_not_banned(_user_id);
  select price_kobo into _price from public.products where id = _product_id and is_active = true;
  if _price is null then raise exception 'PRODUCT_NOT_FOUND'; end if;
  select balance_kobo into _balance from public.wallets where user_id = _user_id for update;
  if _balance is null then
    insert into public.wallets (user_id, balance_kobo) values (_user_id, 0) returning balance_kobo into _balance;
  end if;
  if _balance < _price then raise exception 'INSUFFICIENT_BALANCE'; end if;
  select s.id, s.credentials, s.delivery_payload into _stock_id, _credentials, _delivery
    from public.account_stock s
    where s.product_id = _product_id and s.status = 'available'
    order by s.created_at for update skip locked limit 1;
  if _stock_id is null then raise exception 'OUT_OF_STOCK'; end if;
  update public.account_stock set status = 'sold', sold_to = _user_id, sold_at = now() where id = _stock_id;
  update public.wallets set balance_kobo = balance_kobo - _price, updated_at = now()
    where user_id = _user_id returning balance_kobo into _balance;
  insert into public.orders (user_id, product_id, stock_id, price_kobo, status)
    values (_user_id, _product_id, _stock_id, _price, 'fulfilled') returning id into _order_id;
  insert into public.wallet_transactions (user_id, type, status, amount_kobo, balance_after_kobo, description, metadata)
    values (_user_id, 'purchase', 'success', -_price, _balance, 'Purchase: ' || _product_id::text,
            jsonb_build_object('order_id', _order_id, 'product_id', _product_id, 'stock_id', _stock_id));
  return query select _order_id, _stock_id, _credentials, _balance;
end; $$;

create or replace function public.create_smm_order(
  _user_id uuid, _service_id uuid, _link text, _quantity int,
  _charge_kobo bigint, _provider_order_id text, _provider_charge_usd numeric
) returns table(order_id uuid, balance_kobo bigint)
language plpgsql security definer set search_path = public as $$
declare _balance bigint; _provider uuid; _order_id uuid;
begin
  perform public.assert_not_banned(_user_id);
  if _charge_kobo <= 0 then raise exception 'INVALID_AMOUNT'; end if;
  select provider_id into _provider from public.smm_services where id = _service_id and enabled = true;
  if _provider is null then raise exception 'SERVICE_UNAVAILABLE'; end if;
  select balance_kobo into _balance from public.wallets where user_id = _user_id for update;
  if _balance is null then
    insert into public.wallets (user_id, balance_kobo) values (_user_id, 0) returning balance_kobo into _balance;
  end if;
  if _balance < _charge_kobo then raise exception 'INSUFFICIENT_BALANCE'; end if;
  update public.wallets set balance_kobo = balance_kobo - _charge_kobo, updated_at = now()
    where user_id = _user_id returning balance_kobo into _balance;
  insert into public.smm_orders (user_id, service_id, provider_id, provider_order_id, link, quantity, charge_kobo, status, provider_charge_usd)
    values (_user_id, _service_id, _provider, _provider_order_id, _link, _quantity, _charge_kobo, 'pending', _provider_charge_usd)
    returning id into _order_id;
  insert into public.wallet_transactions (user_id, type, status, amount_kobo, balance_after_kobo, description, metadata)
    values (_user_id, 'purchase', 'success', -_charge_kobo, _balance,
            'SMM order: ' || _quantity || ' × ' || _service_id::text,
            jsonb_build_object('smm_order_id', _order_id, 'service_id', _service_id, 'provider_order_id', _provider_order_id));
  return query select _order_id, _balance;
end; $$;

-- 4) Fix auto-poll FORBIDDEN: API already validates admin; RPC doesn't need
-- has_role(auth.uid()) since it's invoked via service_role (auth.uid() = NULL).
create or replace function public.admin_setup_smm_cron(_url text, _secret text, _every_minutes int default 2)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare _sql text;
begin
  if _every_minutes < 1 or _every_minutes > 60 then raise exception 'INVALID_INTERVAL'; end if;
  perform cron.unschedule('smm-poll') where exists (select 1 from cron.job where jobname = 'smm-poll');
  _sql := format($cmd$ select net.http_post(url := %L, headers := jsonb_build_object('Content-Type','application/json','x-cron-secret',%L), body := '{}'::jsonb) $cmd$, _url, _secret);
  perform cron.schedule('smm-poll', format('*/%s * * * *', _every_minutes), _sql);
end; $$;
revoke execute on function public.admin_setup_smm_cron(text, text, int) from authenticated;
grant execute on function public.admin_setup_smm_cron(text, text, int) to service_role;

create or replace function public.admin_disable_smm_cron()
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  perform cron.unschedule('smm-poll') where exists (select 1 from cron.job where jobname = 'smm-poll');
end; $$;
revoke execute on function public.admin_disable_smm_cron() from authenticated;
grant execute on function public.admin_disable_smm_cron() to service_role;

create or replace function public.admin_smm_cron_status()
returns table (jobname text, schedule text, active boolean)
language sql security definer set search_path = public, extensions as $$
  select j.jobname, j.schedule, j.active from cron.job j where j.jobname = 'smm-poll';
$$;
revoke execute on function public.admin_smm_cron_status() from authenticated;
grant execute on function public.admin_smm_cron_status() to service_role;

-- 5) Bulk-apply markup helper
create or replace function public.admin_apply_smm_markup(_pct numeric)
returns int language plpgsql security definer set search_path = public as $$
declare _n int;
begin
  if not public.has_role(auth.uid(),'admin') then raise exception 'FORBIDDEN'; end if;
  if _pct < 0 or _pct > 10000 then raise exception 'INVALID_PCT'; end if;
  update public.smm_services set markup_pct = _pct, updated_at = now();
  get diagnostics _n = row_count;
  return _n;
end; $$;
grant execute on function public.admin_apply_smm_markup(numeric) to authenticated, service_role;
