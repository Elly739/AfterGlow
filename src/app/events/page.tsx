import { EventsDirectory } from "@/components/guest/events-directory";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { isEventSchemaError, listPublicEvents } from "@/lib/guest-events";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Explore events",
  description: "Find your event and return to the moments you shared.",
};

export default async function EventsPage() {
  if (!getSupabaseConfig()) {
    return (
      <EventsDirectory
        events={[]}
        setupMessage="Connect Afterglow to its Supabase project to see published events."
      />
    );
  }

  const { events, error } = await listPublicEvents();
  if (error) {
    console.error("Afterglow public event directory failed:", error.message);
    return (
      <EventsDirectory
        events={[]}
        setupMessage={
          isEventSchemaError(error)
            ? "The event tables or guest-access functions are missing. Apply the Supabase migrations 001_initial_schema.sql and 002_guest_event_access.sql in order, then refresh the API schema."
            : "Events could not be loaded. Please try again in a moment."
        }
      />
    );
  }

  return <EventsDirectory events={events ?? []} />;
}
