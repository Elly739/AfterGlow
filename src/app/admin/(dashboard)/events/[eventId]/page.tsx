import { notFound } from "next/navigation";
import Link from "next/link";
import { updateEvent } from "@/app/admin/actions";
import { EventForm } from "@/components/events/event-form";
import { InviteCodeManager } from "@/components/events/invite-code-manager";
import { formatRetention } from "@/lib/events";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function EventSettingsPage({
  params,
}: Readonly<{ params: Promise<{ eventId: string }> }>) {
  if (!getSupabaseConfig()) {
    return null;
  }

  const { eventId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .maybeSingle();

  if (error) {
    console.error("Afterglow event details failed:", error.message);
    return (
      <p className="alert">
        Event details could not be loaded. Refresh the page or check your
        Supabase connection.
      </p>
    );
  }

  if (!event) {
    notFound();
  }

  const updateEventAction = updateEvent.bind(null, event.id);

  return (
    <>
      <p className="breadcrumb">
        <Link href="/admin">Events</Link>
        <span>/</span>
        {event.title}
      </p>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Event settings</p>
          <h1>{event.title}</h1>
          <p className="heading-copy">
            Update event details, guest options, or retention. Memories are set
            to {formatRetention(event).toLowerCase()}.
          </p>
        </div>
      </div>
      <div className="form-layout">
        <EventForm action={updateEventAction} event={event} />
        <div className="event-settings-aside">
          <InviteCodeManager eventId={event.id} />
          <aside className="side-note">
            <h3>Archive, don’t lose the light.</h3>
            <p>
              Set the event status to archived to close its active lifecycle
              while keeping its settings and memories available to you.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
