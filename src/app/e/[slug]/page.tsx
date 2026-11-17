import { notFound } from "next/navigation";
import { EventHome } from "@/components/guest/event-home";
import { GuestEventEntry } from "@/components/guest/event-entry";
import { GuestUnavailable } from "@/components/guest/guest-unavailable";
import { guestPreviewSlug } from "@/lib/guest-preview";
import { getPublicEvent, hasGuestEventAccess, isEventSchemaError } from "@/lib/guest-events";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const metadata = {
  title: { absolute: "The Afterglow · A night worth remembering" },
  description: "Celebrate the experience. Preserve the memories.",
};

export default async function GuestEventPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  if (slug === guestPreviewSlug) {
    return <EventHome />;
  }

  if (!getSupabaseConfig()) {
    return (
      <GuestUnavailable
        title="Event access is not connected"
        message="The Afterglow event directory needs its Supabase connection before event galleries can be opened."
      />
    );
  }

  const { event, error } = await getPublicEvent(slug);
  if (error) {
    console.error("Afterglow public event details failed:", error.message);
    return (
      <GuestUnavailable
        title="This event is not available"
        message={
          isEventSchemaError(error)
            ? "The event database setup is incomplete. Apply the Supabase migrations 001_initial_schema.sql and 002_guest_event_access.sql in order."
            : "We could not load this event. Please try again in a moment."
        }
      />
    );
  }
  if (!event) {
    notFound();
  }

  const access = await hasGuestEventAccess(slug);
  return (
    <GuestEventEntry
      accessError={
        access.error
          ? isEventSchemaError(access.error)
            ? "Guest access is not configured yet. The administrator needs to apply the Supabase migrations."
            : "Guest access could not be checked. Please try again."
          : undefined
      }
      authorized={access.authorized}
      event={event}
    />
  );
}
