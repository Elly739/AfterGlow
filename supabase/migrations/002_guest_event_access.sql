drop function if exists public.create_event_with_access(
    text, text, text, text, timestamptz, boolean, boolean, boolean,
    text, integer, timestamptz, text
);
drop function if exists public.create_event_with_access(
    text, text, text, text, timestamptz, boolean, boolean, boolean,
    text, integer, timestamptz, text, text
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
    p_token_hash text,
    p_status text default 'upcoming'
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
        status,
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
        p_status,
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

create or replace function public.list_public_events()
returns table (
    id uuid,
    slug text,
    title text,
    description text,
    venue text,
    starts_at timestamptz,
    status text
)
language sql
stable
security definer
set search_path = ''
as $$
    select
        events.id,
        events.slug,
        events.title,
        events.description,
        events.venue,
        events.starts_at,
        events.status
    from public.events
    where events.status in ('upcoming', 'live', 'archived')
    order by events.starts_at desc nulls last, events.created_at desc;
$$;

create or replace function public.get_public_event(p_slug text)
returns table (
    id uuid,
    slug text,
    title text,
    description text,
    venue text,
    starts_at timestamptz,
    status text
)
language sql
stable
security definer
set search_path = ''
as $$
    select
        events.id,
        events.slug,
        events.title,
        events.description,
        events.venue,
        events.starts_at,
        events.status
    from public.events
    where events.slug = p_slug
      and events.status in ('upcoming', 'live', 'archived')
    limit 1;
$$;

create or replace function public.verify_event_access(
    p_slug text,
    p_token_hash text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.events
        join public.event_access
          on event_access.event_id = events.id
        where events.slug = p_slug
          and events.status in ('upcoming', 'live', 'archived')
          and event_access.token_hash = p_token_hash
          and event_access.enabled
          and (
              event_access.expires_at is null
              or event_access.expires_at > now()
          )
    );
$$;

revoke all on function public.create_event_with_access(
    text, text, text, text, timestamptz, boolean, boolean, boolean,
    text, integer, timestamptz, text, text
) from public, anon;
grant execute on function public.create_event_with_access(
    text, text, text, text, timestamptz, boolean, boolean, boolean,
    text, integer, timestamptz, text, text
) to authenticated;

revoke all on function public.list_public_events() from public;
grant execute on function public.list_public_events() to anon, authenticated;

revoke all on function public.get_public_event(text) from public;
grant execute on function public.get_public_event(text) to anon, authenticated;

revoke all on function public.verify_event_access(text, text) from public;
grant execute on function public.verify_event_access(text, text) to anon, authenticated;

notify pgrst, 'reload schema';
