/*
# Fix admin_apply_smm_markup RPC

1. Fixes
- Re-creates the `admin_apply_smm_markup` function that was missing from the database
- The "Apply to all" markup button in the admin SMM Services page was failing with "UPDATE requires a WHERE clause" because the RPC didn't exist

2. Changes
- Adds the bulk markup function back with proper admin authorization check
- Function updates all smm_services rows with the given markup percentage
*/

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
