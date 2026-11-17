import { Camera, House, Images, Sparkles } from "lucide-react";
import Link from "next/link";
import { guestPreviewSlug } from "@/lib/guest-preview";

type GuestSection = "home" | "gallery" | "events";

export function EventHeader({
  current,
  eventTitle,
  isPreview = true,
  slug = guestPreviewSlug,
}: Readonly<{
  current: GuestSection;
  eventTitle?: string;
  isPreview?: boolean;
  slug?: string;
}>) {
  const isEventsPage = current === "events";
  const eventHome = isEventsPage ? "/" : `/e/${slug}`;
  const gallery = `/e/${slug}/gallery`;

  return (
    <header className="guest-header">
      <Link aria-label="The Afterglow event home" className="guest-brand" href={eventHome}>
        <span className="guest-brand-mark">
          <Sparkles aria-hidden="true" size={17} />
        </span>
        <span className="guest-brand-text">
          <span className="guest-brand-name">The Afterglow</span>
          <span className="guest-brand-event">
            {eventTitle ?? (isEventsPage ? "Every moment, gathered" : "A night worth remembering")}
          </span>
        </span>
      </Link>

      <nav aria-label="Event navigation" className="guest-desktop-nav">
        {isEventsPage ? (
          <Link className="guest-nav-link" href="/">
            The evening
          </Link>
        ) : (
          <>
            <Link
              aria-current={current === "home" ? "page" : undefined}
              className={current === "home" ? "guest-nav-link current" : "guest-nav-link"}
              href={eventHome}
            >
              The evening
            </Link>
            <Link
              aria-current={current === "gallery" ? "page" : undefined}
              className={
                current === "gallery" ? "guest-nav-link current" : "guest-nav-link"
              }
              href={gallery}
            >
              The gallery
            </Link>
          </>
        )}
        <Link
          aria-current={isEventsPage ? "page" : undefined}
          className="guest-header-share"
          href="/events"
        >
          <Camera aria-hidden="true" size={15} />
          Explore events
        </Link>
      </nav>

      {isPreview && !isEventsPage ? (
        <span className="guest-preview-badge">Design preview</span>
      ) : null}
    </header>
  );
}

export function GuestMobileNav({
  current,
  slug = guestPreviewSlug,
}: Readonly<{
  current: GuestSection;
  slug?: string;
}>) {
  const isEventsPage = current === "events";
  const eventHome = isEventsPage ? "/" : `/e/${slug}`;
  const gallery = `/e/${slug}/gallery`;

  return (
    <nav
      aria-label="Quick event navigation"
      className={`guest-mobile-nav${isEventsPage ? " guest-mobile-nav-events" : ""}`}
    >
      {!isEventsPage ? (
        <>
          <Link
            aria-current={current === "home" ? "page" : undefined}
            className={current === "home" ? "guest-mobile-link active" : "guest-mobile-link"}
            href={eventHome}
          >
            <House aria-hidden="true" size={18} />
            <span>Home</span>
          </Link>
          <Link
            aria-current={current === "gallery" ? "page" : undefined}
            className={
              current === "gallery" ? "guest-mobile-link active" : "guest-mobile-link"
            }
            href={gallery}
          >
            <Images aria-hidden="true" size={18} />
            <span>Gallery</span>
          </Link>
        </>
      ) : (
        <Link className="guest-mobile-link" href="/">
          <House aria-hidden="true" size={18} />
          <span>Evening</span>
        </Link>
      )}
      <Link
        aria-current={isEventsPage ? "page" : undefined}
        className={isEventsPage ? "guest-mobile-link active" : "guest-mobile-link"}
        href="/events"
      >
        <Camera aria-hidden="true" size={18} />
        <span>Events</span>
      </Link>
    </nav>
  );
}
