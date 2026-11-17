import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { EventAccessForm } from "@/components/guest/event-access-form";
import { EventHeader, GuestMobileNav } from "@/components/guest/event-chrome";
import { formatEventDate, type PublicEvent } from "@/lib/events";

export function GuestEventEntry({
  event,
  authorized,
  accessError,
}: Readonly<{
  event: PublicEvent;
  authorized: boolean;
  accessError?: string;
}>) {
  return (
    <main className="guest-app guest-event-entry-page">
      <EventHeader
        current="home"
        eventTitle={event.title}
        isPreview={false}
        slug={event.slug}
      />

      <div className="guest-page-width">
        <Link className="guest-back-link" href="/events">
          <ArrowLeft aria-hidden="true" size={15} />
          All events
        </Link>

        <section aria-labelledby="event-entry-title" className="event-entry-panel">
          <div aria-hidden="true" className="event-entry-art">
            <span className="event-entry-ring event-entry-ring-one" />
            <span className="event-entry-ring event-entry-ring-two" />
            <Sparkles className="event-entry-sparkle" size={22} />
            <span className="event-entry-art-label">A NIGHT WORTH REMEMBERING</span>
          </div>

          <div className="event-entry-copy">
            <p className="guest-eyebrow">{statusLabel(event.status)}</p>
            <h1 id="event-entry-title">{event.title}</h1>
            {event.description ? (
              <p className="event-entry-description">{event.description}</p>
            ) : null}
            <div className="event-entry-details">
              <span>
                <CalendarDays aria-hidden="true" size={15} />
                {formatEventDate(event.starts_at)}
              </span>
              {event.venue ? (
                <span>
                  <MapPin aria-hidden="true" size={15} />
                  {event.venue}
                </span>
              ) : null}
            </div>

            <div className="event-entry-access">
              {authorized ? (
                <>
                  <p className="guest-eyebrow">You’re in</p>
                  <p>Your private gallery is ready for you.</p>
                  <Link
                    className="guest-button guest-button-gold"
                    href={`/e/${event.slug}/gallery`}
                  >
                    Enter the gallery
                    <ArrowRight aria-hidden="true" size={15} />
                  </Link>
                </>
              ) : accessError ? (
                <p aria-live="polite" className="event-access-error" role="alert">
                  {accessError}
                </p>
              ) : (
                <>
                  <p className="guest-eyebrow">A private collection</p>
                  <p>
                    Enter the code shared by your host to view and contribute
                    to this event’s memories.
                  </p>
                  <EventAccessForm slug={event.slug} />
                </>
              )}
            </div>
          </div>
        </section>

        <footer className="guest-footer">
          <Link className="guest-footer-brand" href="/">
            <Sparkles aria-hidden="true" size={15} />
            THE AFTERGLOW
          </Link>
          <p>Every celebration, gathered in one place.</p>
          <Link className="guest-footer-admin" href="/admin/login">
            Studio sign in
          </Link>
        </footer>
      </div>

      <GuestMobileNav current="home" slug={event.slug} />
    </main>
  );
}

function statusLabel(status: PublicEvent["status"]) {
  if (status === "live") {
    return "A celebration in progress";
  }
  if (status === "archived") {
    return "A night we remember";
  }
  return "Coming soon";
}
