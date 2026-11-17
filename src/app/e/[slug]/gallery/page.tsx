import { notFound, redirect } from "next/navigation";
import { GalleryExperience } from "@/components/guest/gallery-experience";
import { GuestUnavailable } from "@/components/guest/guest-unavailable";
import { guestPreviewSlug } from "@/lib/guest-preview";
import {
  getPublicEvent,
  hasGuestEventAccess,
  isEventSchemaError,
} from "@/lib/guest-events";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const metadata = {
  title: { absolute: "The Gallery · The Afterglow" },
  description: "A shared collection of the moments that made the night.",
};

export default async function GuestGalleryPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  if (slug === guestPreviewSlug) {
    return <GalleryExperience />;
  }

  if (!getSupabaseConfig()) {
    return (
      <GuestUnavailable
        title="This gallery is not connected"
        message="Connect Afterglow to its Supabase project to open event galleries."
      />
    );
  }

  const { event, error } = await getPublicEvent(slug);
  if (error) {
    console.error("Afterglow guest gallery event lookup failed:", error.message);
    return (
      <GuestUnavailable
        title="This gallery is not available"
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
  if (access.error) {
    console.error("Afterglow guest gallery access failed:", access.error.message);
    return (
      <GuestUnavailable
        title="Guest access could not be checked"
        message={
          isEventSchemaError(access.error)
            ? "The guest access migration is not installed yet. Ask the administrator to apply migration 002_guest_event_access.sql."
            : "Please return to the event page and try again."
        }
      />
    );
  }
  if (!access.authorized) {
    redirect(`/e/${slug}`);
  }

  return <GalleryExperience eventSlug={event.slug} eventTitle={event.title} />;
}
