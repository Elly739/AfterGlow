create extension if not exists pgcrypto with schema extensions;

create table public.events (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete restrict,
    title text not null check (char_length(title) between 2 and 100),
    slug text not null unique
        check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    description text,
    cover_image_path text,
    venue text,
    starts_at timestamptz,
    status text not null default 'draft'
        check (status in ('draft', 'upcoming', 'live', 'archived', 'closed')),
    guest_uploads_enabled boolean not null default true,
    guest_messages_enabled boolean not null default true,
    downloads_enabled boolean not null default true,
    retention_mode text not null default 'permanent'
        check (retention_mode in ('permanent', 'duration', 'until_date')),
    retention_days integer,
    retention_until timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (
        (retention_mode = 'permanent'
            and retention_days is null
            and retention_until is null)
        or
        (retention_mode = 'duration'
            and retention_days is not null
            and retention_days between 1 and 3650
            and retention_until is null)
        or
        (retention_mode = 'until_date'
            and retention_until is not null
            and retention_days is null)
    )
);

create table public.event_access (
    event_id uuid primary key
        references public.events(id) on delete cascade,
    token_hash text not null unique
        check (token_hash ~ '^[a-f0-9]{64}$'),
    enabled boolean not null default true,
    expires_at timestamptz,
    created_at timestamptz not null default now(),
    rotated_at timestamptz
);

create index events_owner_created_idx
    on public.events(owner_id, created_at desc);
create index events_status_idx
    on public.events(status);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

alter table public.events enable row level security;
alter table public.event_access enable row level security;

revoke all on table public.events from anon, authenticated;
revoke all on table public.event_access from anon, authenticated;
grant select, insert, update, delete on table public.events to authenticated;
grant select, insert, update, delete on table public.event_access to authenticated;

create policy "Owners manage their events"
on public.events
for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "Owners manage event access"
on public.event_access
for all
to authenticated
using (
    exists (
        select 1
        from public.events
        where events.id = event_access.event_id
          and events.owner_id = (select auth.uid())
    )
)
with check (
    exists (
        select 1
        from public.events
        where events.id = event_access.event_id
          and events.owner_id = (select auth.uid())
    )
);

create function public.create_event_with_access(
    p_title text,
    p_slug text,
    p_description text,
    p_venue text,
    p_starts_at timestamptz,
    p_guest_uploads_enabled boolean,
    p_guest_messages_enabled boolean,
    p_downloads_enabled boolean,
    p_retention_mode text,
    p_retention_days integer,
    p_retention_until timestamptz,
    p_token_hash text
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
    new_event_id uuid;
begin
    if auth.uid() is null then
        raise exception 'An authenticated user is required';
    end if;

    insert into public.events (
        owner_id,
        title,
        slug,
        description,
        venue,
        starts_at,
        guest_uploads_enabled,
        guest_messages_enabled,
        downloads_enabled,
        retention_mode,
        retention_days,
        retention_until
    )
    values (
        (select auth.uid()),
        p_title,
        p_slug,
        p_description,
        p_venue,
        p_starts_at,
        p_guest_uploads_enabled,
        p_guest_messages_enabled,
        p_downloads_enabled,
        p_retention_mode,
        p_retention_days,
        p_retention_until
    )
    returning id into new_event_id;

    insert into public.event_access (event_id, token_hash)
    values (new_event_id, p_token_hash);

    return new_event_id;
end;
$$;

revoke all on function public.create_event_with_access(
    text, text, text, text, timestamptz, boolean, boolean, boolean,
    text, integer, timestamptz, text
) from public, anon;
grant execute on function public.create_event_with_access(
    text, text, text, text, timestamptz, boolean, boolean, boolean,
    text, integer, timestamptz, text
) to authenticated;

revoke all on function public.set_updated_at() from public, anon, authenticated;
