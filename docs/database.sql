-- GatherGenius Experience OS - Supabase Schema with Explicit Grants + RLS
-- Paste into Supabase SQL Editor and Run.

create extension if not exists pgcrypto;

create table if not exists public.event_locks (
  id uuid primary key default gen_random_uuid(),
  lock_code text unique,
  prompt text,
  event_type text,
  location text,
  guests integer default 0,
  budget numeric default 0,
  total numeric default 0,
  deposit numeric default 0,
  confidence_score numeric default 0,
  guarantee_status text default 'draft',
  status text default 'ready_to_lock',
  event_lock_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.event_executions (
  id uuid primary key default gen_random_uuid(),
  lock_code text,
  status text default 'deposit_pending',
  event_type text,
  total numeric default 0,
  deposit numeric default 0,
  confidence_score numeric default 0,
  execution_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.vendor_execution_responses (
  id uuid primary key default gen_random_uuid(),
  request_code text,
  lock_code text,
  vendor_name text,
  role text,
  decision text default 'accepted',
  reason text,
  sla_status text default 'within_sla',
  response_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'vendor_execution_responses_decision_check'
  ) then
    alter table public.vendor_execution_responses
    add constraint vendor_execution_responses_decision_check
    check (decision in ('accepted','declined'));
  end if;
end $$;

create table if not exists public.vendor_replacements (
  id uuid primary key default gen_random_uuid(),
  replacement_code text unique,
  lock_code text,
  role text,
  declined_vendor text,
  replacement_vendor text,
  status text default 'replacement_started',
  replacement_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.vendor_performance (
  id uuid primary key default gen_random_uuid(),
  vendor_name text,
  role text,
  total_requests integer default 0,
  accepted_requests integer default 0,
  declined_requests integer default 0,
  conversion_rate numeric default 0,
  cancellation_rate numeric default 0,
  avg_response_hours numeric default 0,
  placement_score numeric default 0,
  created_at timestamptz default now()
);

create table if not exists public.pricing_intelligence (
  id uuid primary key default gen_random_uuid(),
  event_type text,
  location text,
  guest_range text,
  avg_total_cost numeric,
  avg_vendor_cost jsonb default '{}'::jsonb,
  demand_score numeric default 0,
  created_at timestamptz default now()
);

create index if not exists idx_event_locks_lock_code on public.event_locks(lock_code);
create index if not exists idx_event_locks_created_at on public.event_locks(created_at);
create index if not exists idx_event_executions_lock_code on public.event_executions(lock_code);
create index if not exists idx_vendor_execution_responses_lock_code on public.vendor_execution_responses(lock_code);
create index if not exists idx_vendor_replacements_lock_code on public.vendor_replacements(lock_code);
create index if not exists idx_vendor_performance_vendor_name on public.vendor_performance(vendor_name);
create index if not exists idx_pricing_intelligence_event_location on public.pricing_intelligence(event_type, location);

-- Explicit grants for Supabase Data API
grant select, insert, update, delete on public.event_locks to service_role;
grant select, insert, update, delete on public.event_executions to service_role;
grant select, insert, update, delete on public.vendor_execution_responses to service_role;
grant select, insert, update, delete on public.vendor_replacements to service_role;
grant select, insert, update, delete on public.vendor_performance to service_role;
grant select, insert, update, delete on public.pricing_intelligence to service_role;

-- Optional safe reads
grant select on public.pricing_intelligence to anon;
grant select on public.vendor_performance to authenticated;

-- Enable RLS
alter table public.event_locks enable row level security;
alter table public.event_executions enable row level security;
alter table public.vendor_execution_responses enable row level security;
alter table public.vendor_replacements enable row level security;
alter table public.vendor_performance enable row level security;
alter table public.pricing_intelligence enable row level security;

-- Policies
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='event_locks' and policyname='service role full access event_locks') then
    create policy "service role full access event_locks"
    on public.event_locks for all to service_role using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='event_executions' and policyname='service role full access event_executions') then
    create policy "service role full access event_executions"
    on public.event_executions for all to service_role using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='vendor_execution_responses' and policyname='service role full access vendor_execution_responses') then
    create policy "service role full access vendor_execution_responses"
    on public.vendor_execution_responses for all to service_role using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='vendor_replacements' and policyname='service role full access vendor_replacements') then
    create policy "service role full access vendor_replacements"
    on public.vendor_replacements for all to service_role using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='vendor_performance' and policyname='service role full access vendor_performance') then
    create policy "service role full access vendor_performance"
    on public.vendor_performance for all to service_role using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='pricing_intelligence' and policyname='service role full access pricing_intelligence') then
    create policy "service role full access pricing_intelligence"
    on public.pricing_intelligence for all to service_role using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='pricing_intelligence' and policyname='public can read pricing intelligence') then
    create policy "public can read pricing intelligence"
    on public.pricing_intelligence for select to anon using (true);
  end if;
end $$;

insert into public.event_locks (
  lock_code, prompt, event_type, location, guests, budget, total, deposit,
  confidence_score, guarantee_status, status, event_lock_data
)
values (
  'TEST-LOCK-001',
  'Build my wedding for 120 guests under $20k in Virginia',
  'Wedding',
  'Virginia',
  120,
  20000,
  11880,
  1782,
  94,
  'guaranteed',
  'ready_to_lock',
  '{"test": true}'::jsonb
)
on conflict (lock_code) do nothing;

select * from public.event_locks where lock_code = 'TEST-LOCK-001';



-- User data permissions for voice/context personalization
create table if not exists public.user_data_permissions (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  permissions jsonb default '{}'::jsonb,
  approved_sources text[] default '{}',
  consent_version text default 'v1',
  consent_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_user_data_permissions_user_key on public.user_data_permissions(user_key);
create index if not exists idx_user_data_permissions_created_at on public.user_data_permissions(created_at);

grant select, insert, update, delete on public.user_data_permissions to service_role;
grant select, insert, update, delete on public.user_data_permissions to authenticated;

alter table public.user_data_permissions enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_data_permissions' and policyname='service role full access user_data_permissions') then
    create policy "service role full access user_data_permissions"
    on public.user_data_permissions for all to service_role using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_data_permissions' and policyname='authenticated manage own permission preview') then
    create policy "authenticated manage own permission preview"
    on public.user_data_permissions for all to authenticated using (true) with check (true);
  end if;
end $$;



-- Conversation memory for Realtime Conversation Core
create table if not exists public.conversation_memory (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  role text,
  content text,
  action text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_conversation_memory_user_key on public.conversation_memory(user_key);
create index if not exists idx_conversation_memory_created_at on public.conversation_memory(created_at);

grant select, insert, update, delete on public.conversation_memory to service_role;
grant select, insert, update, delete on public.conversation_memory to authenticated;

alter table public.conversation_memory enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversation_memory' and policyname='service role full access conversation_memory') then
    create policy "service role full access conversation_memory"
    on public.conversation_memory for all to service_role using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversation_memory' and policyname='authenticated manage conversation memory preview') then
    create policy "authenticated manage conversation memory preview"
    on public.conversation_memory for all to authenticated using (true) with check (true);
  end if;
end $$;



-- Live pricing request history
create table if not exists public.pricing_requests (
  id uuid primary key default gen_random_uuid(),
  query text,
  category text,
  location text,
  confidence text,
  mode text,
  pricing_result jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_pricing_requests_category on public.pricing_requests(category);
create index if not exists idx_pricing_requests_created_at on public.pricing_requests(created_at);

grant select, insert, update, delete on public.pricing_requests to service_role;
grant select, insert, update, delete on public.pricing_requests to authenticated;

alter table public.pricing_requests enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='pricing_requests' and policyname='service role full access pricing_requests') then
    create policy "service role full access pricing_requests"
    on public.pricing_requests for all to service_role using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='pricing_requests' and policyname='authenticated manage pricing requests preview') then
    create policy "authenticated manage pricing requests preview"
    on public.pricing_requests for all to authenticated using (true) with check (true);
  end if;
end $$;



-- GeniusShield security incident logs
create table if not exists public.security_incidents (
  id uuid primary key default gen_random_uuid(),
  shield_version text,
  severity text,
  blocked boolean default false,
  threat_ids text[] default '{}',
  evidence jsonb default '{}'::jsonb,
  response_message text,
  created_at timestamptz default now()
);

create index if not exists idx_security_incidents_severity on public.security_incidents(severity);
create index if not exists idx_security_incidents_created_at on public.security_incidents(created_at);

grant select, insert, update, delete on public.security_incidents to service_role;
grant select, insert, update, delete on public.security_incidents to authenticated;

alter table public.security_incidents enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='security_incidents' and policyname='service role full access security_incidents') then
    create policy "service role full access security_incidents"
    on public.security_incidents for all to service_role using (true) with check (true);
  end if;
end $$;



-- Source-aware code generation history
create table if not exists public.source_aware_code_generations (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  generation_mode text,
  code_preview text,
  sources_used text[] default '{}',
  safety_result jsonb default '{}'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_source_aware_code_generations_user_key on public.source_aware_code_generations(user_key);
create index if not exists idx_source_aware_code_generations_created_at on public.source_aware_code_generations(created_at);

grant select, insert, update, delete on public.source_aware_code_generations to service_role;
grant select, insert, update, delete on public.source_aware_code_generations to authenticated;

alter table public.source_aware_code_generations enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='source_aware_code_generations' and policyname='service role full access source_aware_code_generations') then
    create policy "service role full access source_aware_code_generations"
    on public.source_aware_code_generations for all to service_role using (true) with check (true);
  end if;
end $$;



-- AI Experience Operating Layer runs
create table if not exists public.experience_operating_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  confidence numeric,
  next_action text,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_experience_operating_runs_user_key on public.experience_operating_runs(user_key);
create index if not exists idx_experience_operating_runs_created_at on public.experience_operating_runs(created_at);

grant select, insert, update, delete on public.experience_operating_runs to service_role;
grant select, insert, update, delete on public.experience_operating_runs to authenticated;

alter table public.experience_operating_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='experience_operating_runs' and policyname='service role full access experience_operating_runs') then
    create policy "service role full access experience_operating_runs"
    on public.experience_operating_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Voice outcome pipeline run history
create table if not exists public.voice_outcome_pipeline_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  confidence numeric,
  next_action text,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_voice_outcome_pipeline_runs_user_key on public.voice_outcome_pipeline_runs(user_key);
create index if not exists idx_voice_outcome_pipeline_runs_created_at on public.voice_outcome_pipeline_runs(created_at);

grant select, insert, update, delete on public.voice_outcome_pipeline_runs to service_role;
grant select, insert, update, delete on public.voice_outcome_pipeline_runs to authenticated;

alter table public.voice_outcome_pipeline_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='voice_outcome_pipeline_runs' and policyname='service role full access voice_outcome_pipeline_runs') then
    create policy "service role full access voice_outcome_pipeline_runs"
    on public.voice_outcome_pipeline_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- 99% Autonomous Experience Layer run history
create table if not exists public.autonomous_experience_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  confidence numeric,
  next_action text,
  can_proceed boolean default false,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_autonomous_experience_runs_user_key on public.autonomous_experience_runs(user_key);
create index if not exists idx_autonomous_experience_runs_created_at on public.autonomous_experience_runs(created_at);

grant select, insert, update, delete on public.autonomous_experience_runs to service_role;
grant select, insert, update, delete on public.autonomous_experience_runs to authenticated;

alter table public.autonomous_experience_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='autonomous_experience_runs' and policyname='service role full access autonomous_experience_runs') then
    create policy "service role full access autonomous_experience_runs"
    on public.autonomous_experience_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Interactive thought conversation exchanges
create table if not exists public.conversation_exchanges (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  input_text text,
  conversation_type text,
  turn_state jsonb default '{}'::jsonb,
  active_listening jsonb default '{}'::jsonb,
  follow_up text,
  memory_item jsonb default '{}'::jsonb,
  interruption jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_conversation_exchanges_user_key on public.conversation_exchanges(user_key);
create index if not exists idx_conversation_exchanges_created_at on public.conversation_exchanges(created_at);

grant select, insert, update, delete on public.conversation_exchanges to service_role;
grant select, insert, update, delete on public.conversation_exchanges to authenticated;

alter table public.conversation_exchanges enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversation_exchanges' and policyname='service role full access conversation_exchanges') then
    create policy "service role full access conversation_exchanges"
    on public.conversation_exchanges for all to service_role using (true) with check (true);
  end if;
end $$;
