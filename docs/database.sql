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



-- Ambient Operating Core V1 run history
create table if not exists public.ambient_core_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  readiness jsonb default '{}'::jsonb,
  intent jsonb default '{}'::jsonb,
  world jsonb default '{}'::jsonb,
  proactive jsonb default '{}'::jsonb,
  protection jsonb default '{}'::jsonb,
  response_text text,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_ambient_core_runs_user_key on public.ambient_core_runs(user_key);
create index if not exists idx_ambient_core_runs_created_at on public.ambient_core_runs(created_at);

grant select, insert, update, delete on public.ambient_core_runs to service_role;
grant select, insert, update, delete on public.ambient_core_runs to authenticated;

alter table public.ambient_core_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ambient_core_runs' and policyname='service role full access ambient_core_runs') then
    create policy "service role full access ambient_core_runs"
    on public.ambient_core_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- GatherGenius Operating Core run history
create table if not exists public.gathergenius_operating_core_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  readiness jsonb default '{}'::jsonb,
  intent jsonb default '{}'::jsonb,
  world jsonb default '{}'::jsonb,
  proactive jsonb default '{}'::jsonb,
  protection jsonb default '{}'::jsonb,
  decision jsonb default '{}'::jsonb,
  response_text text,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gathergenius_operating_core_runs_user_key on public.gathergenius_operating_core_runs(user_key);
create index if not exists idx_gathergenius_operating_core_runs_created_at on public.gathergenius_operating_core_runs(created_at);

grant select, insert, update, delete on public.gathergenius_operating_core_runs to service_role;
grant select, insert, update, delete on public.gathergenius_operating_core_runs to authenticated;

alter table public.gathergenius_operating_core_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gathergenius_operating_core_runs' and policyname='service role full access gathergenius_operating_core_runs') then
    create policy "service role full access gathergenius_operating_core_runs"
    on public.gathergenius_operating_core_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Realtime Ambient Core memory graph nodes
create table if not exists public.memory_graph_nodes (
  id text primary key,
  user_key text default 'anonymous_preview',
  type text,
  value text,
  confidence numeric,
  source text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.memory_graph_edges (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  from_node text,
  to_node text,
  relation text,
  weight numeric default 0.4,
  created_at timestamptz default now()
);

create table if not exists public.safe_execution_events (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  action_id text,
  action_type text,
  status text,
  blocked_reason text,
  action_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

grant select, insert, update, delete on public.memory_graph_nodes to authenticated, service_role;
grant select, insert, update, delete on public.memory_graph_edges to authenticated, service_role;
grant select, insert, update, delete on public.safe_execution_events to authenticated, service_role;

alter table public.memory_graph_nodes enable row level security;
alter table public.memory_graph_edges enable row level security;
alter table public.safe_execution_events enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='memory_graph_nodes' and policyname='service role full access memory_graph_nodes') then
    create policy "service role full access memory_graph_nodes" on public.memory_graph_nodes for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='memory_graph_edges' and policyname='service role full access memory_graph_edges') then
    create policy "service role full access memory_graph_edges" on public.memory_graph_edges for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='safe_execution_events' and policyname='service role full access safe_execution_events') then
    create policy "service role full access safe_execution_events" on public.safe_execution_events for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 1-3 operating upgrade run history
create table if not exists public.phase123_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_phase123_runs_user_key on public.phase123_runs(user_key);
create index if not exists idx_phase123_runs_created_at on public.phase123_runs(created_at);

grant select, insert, update, delete on public.phase123_runs to authenticated, service_role;

alter table public.phase123_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='phase123_runs' and policyname='service role full access phase123_runs') then
    create policy "service role full access phase123_runs" on public.phase123_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Realtime Human Conversation Layer
create table if not exists public.human_conversation_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  emotion jsonb default '{}'::jsonb,
  world jsonb default '{}'::jsonb,
  recommendation jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.relationship_memory (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  relationship_data jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

grant select, insert, update, delete on public.human_conversation_runs to authenticated, service_role;
grant select, insert, update, delete on public.relationship_memory to authenticated, service_role;

alter table public.human_conversation_runs enable row level security;
alter table public.relationship_memory enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='human_conversation_runs' and policyname='service role full access human_conversation_runs') then
    create policy "service role full access human_conversation_runs" on public.human_conversation_runs for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='relationship_memory' and policyname='service role full access relationship_memory') then
    create policy "service role full access relationship_memory" on public.relationship_memory for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 4 Agent Mesh + Execution Core
create table if not exists public.phase4_execution_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  agents jsonb default '[]'::jsonb,
  connectors jsonb default '{}'::jsonb,
  execution_queue jsonb default '[]'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.execution_queue_items (
  id text primary key,
  user_key text default 'anonymous_preview',
  action_type text,
  label text,
  source text,
  risk_level text,
  status text,
  permission jsonb default '{}'::jsonb,
  action_data jsonb default '{}'::jsonb,
  message text,
  created_at timestamptz default now(),
  approved_at timestamptz,
  executed_at timestamptz
);

create index if not exists idx_phase4_execution_runs_user_key on public.phase4_execution_runs(user_key);
create index if not exists idx_execution_queue_items_user_key on public.execution_queue_items(user_key);
create index if not exists idx_execution_queue_items_status on public.execution_queue_items(status);

grant select, insert, update, delete on public.phase4_execution_runs to authenticated, service_role;
grant select, insert, update, delete on public.execution_queue_items to authenticated, service_role;

alter table public.phase4_execution_runs enable row level security;
alter table public.execution_queue_items enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='phase4_execution_runs' and policyname='service role full access phase4_execution_runs') then
    create policy "service role full access phase4_execution_runs" on public.phase4_execution_runs for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='execution_queue_items' and policyname='service role full access execution_queue_items') then
    create policy "service role full access execution_queue_items" on public.execution_queue_items for all to service_role using (true) with check (true);
  end if;
end $$;



-- Reality Orchestration Core background runs
create table if not exists public.reality_orchestration_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  reality jsonb default '{}'::jsonb,
  predictive jsonb default '{}'::jsonb,
  human jsonb default '{}'::jsonb,
  ambient jsonb default '{}'::jsonb,
  agents jsonb default '[]'::jsonb,
  execution jsonb default '{}'::jsonb,
  trust jsonb default '{}'::jsonb,
  identity_graph jsonb default '{}'::jsonb,
  protection jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_reality_orchestration_runs_user_key on public.reality_orchestration_runs(user_key);
create index if not exists idx_reality_orchestration_runs_created_at on public.reality_orchestration_runs(created_at);

grant select, insert, update, delete on public.reality_orchestration_runs to authenticated, service_role;

alter table public.reality_orchestration_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='reality_orchestration_runs' and policyname='service role full access reality_orchestration_runs') then
    create policy "service role full access reality_orchestration_runs"
    on public.reality_orchestration_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 6 Production Autonomy Core
create table if not exists public.gg_user_profiles (
  user_key text primary key,
  email text,
  display_name text,
  created_at timestamptz default now(),
  last_seen_at timestamptz default now()
);

create table if not exists public.gg_persistent_memory (
  user_key text primary key,
  memory_data jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.gg_approval_queue (
  id text primary key,
  user_key text default 'anonymous_preview',
  action_type text,
  label text,
  status text,
  action_data jsonb default '{}'::jsonb,
  reason text,
  created_at timestamptz default now(),
  approved_at timestamptz
);

create table if not exists public.gg_observability_events (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  event_type text,
  message text,
  event_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_approval_queue_user_status on public.gg_approval_queue(user_key,status);
create index if not exists idx_gg_observability_user_created on public.gg_observability_events(user_key,created_at);

grant select, insert, update, delete on public.gg_user_profiles to authenticated, service_role;
grant select, insert, update, delete on public.gg_persistent_memory to authenticated, service_role;
grant select, insert, update, delete on public.gg_approval_queue to authenticated, service_role;
grant select, insert, update, delete on public.gg_observability_events to authenticated, service_role;

alter table public.gg_user_profiles enable row level security;
alter table public.gg_persistent_memory enable row level security;
alter table public.gg_approval_queue enable row level security;
alter table public.gg_observability_events enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_user_profiles' and policyname='service role full access gg_user_profiles') then
    create policy "service role full access gg_user_profiles" on public.gg_user_profiles for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_persistent_memory' and policyname='service role full access gg_persistent_memory') then
    create policy "service role full access gg_persistent_memory" on public.gg_persistent_memory for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_approval_queue' and policyname='service role full access gg_approval_queue') then
    create policy "service role full access gg_approval_queue" on public.gg_approval_queue for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_observability_events' and policyname='service role full access gg_observability_events') then
    create policy "service role full access gg_observability_events" on public.gg_observability_events for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 7 Trust & Production Control Core
create table if not exists public.gg_audit_trail (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  actor_role text,
  action text,
  resource text,
  status text,
  reason text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_audit_trail_user_created on public.gg_audit_trail(user_key, created_at);
create index if not exists idx_gg_audit_trail_status on public.gg_audit_trail(status);

grant select, insert, update, delete on public.gg_audit_trail to authenticated, service_role;

alter table public.gg_audit_trail enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_audit_trail' and policyname='service role full access gg_audit_trail') then
    create policy "service role full access gg_audit_trail"
    on public.gg_audit_trail for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 8 Autonomous Reality Network
create table if not exists public.gg_autonomous_reality_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  voice jsonb default '{}'::jsonb,
  swarm jsonb default '[]'::jsonb,
  world jsonb default '{}'::jsonb,
  execution_graph jsonb default '{}'::jsonb,
  relationship_graph jsonb default '{}'::jsonb,
  predictions jsonb default '{}'::jsonb,
  ambient jsonb default '{}'::jsonb,
  investor jsonb default '{}'::jsonb,
  devices jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_autonomous_reality_runs_user_created
on public.gg_autonomous_reality_runs(user_key, created_at);

grant select, insert, update, delete on public.gg_autonomous_reality_runs to authenticated, service_role;

alter table public.gg_autonomous_reality_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_autonomous_reality_runs' and policyname='service role full access gg_autonomous_reality_runs') then
    create policy "service role full access gg_autonomous_reality_runs"
    on public.gg_autonomous_reality_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 10 Distributed Ambient Intelligence Fabric
create table if not exists public.gg_distributed_ambient_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  runtime jsonb default '{}'::jsonb,
  memory_fabric jsonb default '{}'::jsonb,
  mesh jsonb default '{}'::jsonb,
  device_sync jsonb default '{}'::jsonb,
  optimization jsonb default '{}'::jsonb,
  execution jsonb default '{}'::jsonb,
  trust jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_distributed_ambient_runs_user_created
on public.gg_distributed_ambient_runs(user_key, created_at);

grant select, insert, update, delete on public.gg_distributed_ambient_runs to authenticated, service_role;

alter table public.gg_distributed_ambient_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_distributed_ambient_runs' and policyname='service role full access gg_distributed_ambient_runs') then
    create policy "service role full access gg_distributed_ambient_runs"
    on public.gg_distributed_ambient_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 11 Self-Improving Orchestration Core
create table if not exists public.gg_self_improving_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  fabric jsonb default '{}'::jsonb,
  outcome jsonb default '{}'::jsonb,
  learning jsonb default '{}'::jsonb,
  tuning jsonb default '{}'::jsonb,
  optimization_memory jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_self_improving_runs_user_created
on public.gg_self_improving_runs(user_key, created_at);

grant select, insert, update, delete on public.gg_self_improving_runs to authenticated, service_role;

alter table public.gg_self_improving_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_self_improving_runs' and policyname='service role full access gg_self_improving_runs') then
    create policy "service role full access gg_self_improving_runs"
    on public.gg_self_improving_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 12 Ecosystem Intelligence Core
create table if not exists public.gg_ecosystem_intelligence_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  orchestration jsonb default '{}'::jsonb,
  market jsonb default '{}'::jsonb,
  routing jsonb default '{}'::jsonb,
  opportunity jsonb default '{}'::jsonb,
  revenue jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_ecosystem_intelligence_runs_user_created
on public.gg_ecosystem_intelligence_runs(user_key, created_at);

grant select, insert, update, delete on public.gg_ecosystem_intelligence_runs to authenticated, service_role;

alter table public.gg_ecosystem_intelligence_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_ecosystem_intelligence_runs' and policyname='service role full access gg_ecosystem_intelligence_runs') then
    create policy "service role full access gg_ecosystem_intelligence_runs"
    on public.gg_ecosystem_intelligence_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 13 Marketplace & Monetization Core
create table if not exists public.gg_marketplace_monetization_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  ecosystem jsonb default '{}'::jsonb,
  marketplace jsonb default '{}'::jsonb,
  subscription jsonb default '{}'::jsonb,
  forecast jsonb default '{}'::jsonb,
  trust jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_marketplace_monetization_runs_user_created
on public.gg_marketplace_monetization_runs(user_key, created_at);

grant select, insert, update, delete on public.gg_marketplace_monetization_runs to authenticated, service_role;

alter table public.gg_marketplace_monetization_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_marketplace_monetization_runs' and policyname='service role full access gg_marketplace_monetization_runs') then
    create policy "service role full access gg_marketplace_monetization_runs"
    on public.gg_marketplace_monetization_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 14 Autonomous Growth & Scale Intelligence Core
create table if not exists public.gg_growth_scale_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  marketplace jsonb default '{}'::jsonb,
  growth jsonb default '{}'::jsonb,
  acquisition jsonb default '{}'::jsonb,
  retention jsonb default '{}'::jsonb,
  scale jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_growth_scale_runs_user_created
on public.gg_growth_scale_runs(user_key, created_at);

grant select, insert, update, delete on public.gg_growth_scale_runs to authenticated, service_role;

alter table public.gg_growth_scale_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_growth_scale_runs' and policyname='service role full access gg_growth_scale_runs') then
    create policy "service role full access gg_growth_scale_runs"
    on public.gg_growth_scale_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 15 Enterprise Multi-Tenant Core
create table if not exists public.gg_enterprise_multitenant_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id text default 'default',
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  tenant jsonb default '{}'::jsonb,
  organization jsonb default '{}'::jsonb,
  policy jsonb default '{}'::jsonb,
  metrics jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_enterprise_multitenant_runs_tenant_created
on public.gg_enterprise_multitenant_runs(tenant_id, created_at);

grant select, insert, update, delete on public.gg_enterprise_multitenant_runs to authenticated, service_role;

alter table public.gg_enterprise_multitenant_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_enterprise_multitenant_runs' and policyname='service role full access gg_enterprise_multitenant_runs') then
    create policy "service role full access gg_enterprise_multitenant_runs"
    on public.gg_enterprise_multitenant_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 16 Production Launch & Reliability Core
create table if not exists public.gg_production_reliability_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id text default 'default',
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  enterprise jsonb default '{}'::jsonb,
  readiness jsonb default '{}'::jsonb,
  reliability jsonb default '{}'::jsonb,
  rollback jsonb default '{}'::jsonb,
  rollout jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_production_reliability_runs_tenant_created
on public.gg_production_reliability_runs(tenant_id, created_at);

grant select, insert, update, delete on public.gg_production_reliability_runs to authenticated, service_role;

alter table public.gg_production_reliability_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_production_reliability_runs' and policyname='service role full access gg_production_reliability_runs') then
    create policy "service role full access gg_production_reliability_runs"
    on public.gg_production_reliability_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 17 Autonomous Operations Command Core
create table if not exists public.gg_operations_command_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id text default 'default',
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  reliability_core jsonb default '{}'::jsonb,
  command jsonb default '{}'::jsonb,
  incident jsonb default '{}'::jsonb,
  escalation jsonb default '{}'::jsonb,
  ledger jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_operations_command_runs_tenant_created
on public.gg_operations_command_runs(tenant_id, created_at);

grant select, insert, update, delete on public.gg_operations_command_runs to authenticated, service_role;

alter table public.gg_operations_command_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_operations_command_runs' and policyname='service role full access gg_operations_command_runs') then
    create policy "service role full access gg_operations_command_runs"
    on public.gg_operations_command_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 18 Governance & Compliance Core
create table if not exists public.gg_governance_compliance_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id text default 'default',
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  operations jsonb default '{}'::jsonb,
  governance jsonb default '{}'::jsonb,
  privacy jsonb default '{}'::jsonb,
  audit jsonb default '{}'::jsonb,
  boundary jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_gg_governance_compliance_runs_tenant_created on public.gg_governance_compliance_runs(tenant_id, created_at);
grant select, insert, update, delete on public.gg_governance_compliance_runs to authenticated, service_role;
alter table public.gg_governance_compliance_runs enable row level security;
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_governance_compliance_runs' and policyname='service role full access gg_governance_compliance_runs') then
    create policy "service role full access gg_governance_compliance_runs" on public.gg_governance_compliance_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 19 Adaptive Memory & Security Core
create table if not exists public.gg_adaptive_memory_security_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id text default 'default',
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  operations jsonb default '{}'::jsonb,
  memory_review jsonb default '{}'::jsonb,
  privacy jsonb default '{}'::jsonb,
  security jsonb default '{}'::jsonb,
  governance jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_adaptive_memory_security_runs_tenant_created
on public.gg_adaptive_memory_security_runs(tenant_id, created_at);

grant select, insert, update, delete on public.gg_adaptive_memory_security_runs to authenticated, service_role;

alter table public.gg_adaptive_memory_security_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_adaptive_memory_security_runs' and policyname='service role full access gg_adaptive_memory_security_runs') then
    create policy "service role full access gg_adaptive_memory_security_runs"
    on public.gg_adaptive_memory_security_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- Phase 20 Real Integrations & Deployment Wiring
create table if not exists public.gg_real_integration_deployment_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id text default 'default',
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  security jsonb default '{}'::jsonb,
  integrations jsonb default '{}'::jsonb,
  deployment jsonb default '{}'::jsonb,
  connectors jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Phase 21 Final Production Release
create table if not exists public.gg_final_production_release_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id text default 'default',
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  integration jsonb default '{}'::jsonb,
  investor jsonb default '{}'::jsonb,
  release jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_real_integration_deployment_runs_tenant_created
on public.gg_real_integration_deployment_runs(tenant_id, created_at);

create index if not exists idx_gg_final_production_release_runs_tenant_created
on public.gg_final_production_release_runs(tenant_id, created_at);

grant select, insert, update, delete on public.gg_real_integration_deployment_runs to authenticated, service_role;
grant select, insert, update, delete on public.gg_final_production_release_runs to authenticated, service_role;

alter table public.gg_real_integration_deployment_runs enable row level security;
alter table public.gg_final_production_release_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_real_integration_deployment_runs' and policyname='service role full access gg_real_integration_deployment_runs') then
    create policy "service role full access gg_real_integration_deployment_runs"
    on public.gg_real_integration_deployment_runs for all to service_role using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_final_production_release_runs' and policyname='service role full access gg_final_production_release_runs') then
    create policy "service role full access gg_final_production_release_runs"
    on public.gg_final_production_release_runs for all to service_role using (true) with check (true);
  end if;
end $$;



-- AI Event Operating System V1
create table if not exists public.gg_event_os_runs (
  id uuid primary key default gen_random_uuid(),
  user_key text default 'anonymous_preview',
  request text,
  response_text text,
  intent jsonb default '{}'::jsonb,
  blueprint jsonb default '{}'::jsonb,
  vendors jsonb default '{}'::jsonb,
  pricing jsonb default '{}'::jsonb,
  calendar jsonb default '{}'::jsonb,
  approvals jsonb default '{}'::jsonb,
  event_memory jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_gg_event_os_runs_user_created
on public.gg_event_os_runs(user_key, created_at);

grant select, insert, update, delete on public.gg_event_os_runs to authenticated, service_role;

alter table public.gg_event_os_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gg_event_os_runs' and policyname='service role full access gg_event_os_runs') then
    create policy "service role full access gg_event_os_runs"
    on public.gg_event_os_runs for all to service_role using (true) with check (true);
  end if;
end $$;
