"use client";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  LockKeyhole,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EventHeader, GuestMobileNav } from "@/components/guest/event-chrome";
import { formatEventDate, type PublicEvent } from "@/lib/events";

type EventFilter = "all" | "upcoming" | "past";

const previewCard = {
  id: "design-preview",
  slug: "preview",
  title: "The Afterglow",
  description: "A night worth remembering.",
  venue: "Chicago, Illinois",
  starts_at: "2026-10-24T00:00:00.000Z",
  status: "upcoming" as const,
};

export function EventsDirectory({
  events,
  setupMessage,
}: Readonly<{
  events: PublicEvent[];
  setupMessage?: string;
}>) {
  const [filter, setFilter] = useState<EventFilter>("all");
  const [search, setSearch] = useState("");

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = events.filter((event) => {
      const matchesSearch =
        !query ||
        [event.title, event.venue, event.description]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(query));
      const isPast =
        event.status === "archived";
      const matchesFilter =
        filter === "all" ||
        (filter === "past" && isPast) ||
        (filter === "upcoming" && !isPast);
      return matchesSearch && matchesFilter;
    });

    return filter === "all" && !query
      ? [previewCard, ...matches]
      : matches;
  }, [events, filter, search]);

  return (
    <main className="guest-app guest-events-page">
      <EventHeader current="events" />

      <div className="guest-page-width">
        <section aria-labelledby="events-title" className="events-intro">
          <p className="guest-eyebrow">Every gathering has its own story</p>
          <h1 id="events-title">
            Find your <em>event.</em>
          </h1>
          <p>
            Choose the celebration you were part of. Each event has its own
            private gallery, so every memory stays in the right place.
          </p>
        </section>

        <section aria-label="Find an event" className="events-controls">
          <div aria-label="Filter events" className="events-tabs" role="group">
            {(
              [
                ["all", "All events"],
                ["upcoming", "Upcoming"],
                ["past", "Past events"],
              ] as const
            ).map(([value, label]) => (
              <button
                aria-pressed={filter === value}
                className={filter === value ? "events-tab active" : "events-tab"}
                key={value}
                onClick={() => setFilter(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          <label className="events-search">
            <Search aria-hidden="true" size={16} />
            <span className="visually-hidden">Search events</span>
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or place"
              type="search"
              value={search}
            />
          </label>
        </section>

        {setupMessage ? (
          <div aria-live="polite" className="events-setup-notice" role="status">
            <LockKeyhole aria-hidden="true" size={18} />
            <div>
              <strong>Events are not connected yet</strong>
              <p>{setupMessage}</p>
            </div>
          </div>
        ) : null}

        <section
          aria-label="Events"
          className={
            filteredEvents.length === 1
              ? "event-poster-grid event-poster-grid-single"
              : "event-poster-grid"
          }
        >
          {filteredEvents.map((event, index) => {
            const isPreview = event.id === previewCard.id;
            return (
              <Link
                className={`event-poster-card event-poster-tone-${index % 4}`}
                href={`/e/${event.slug}`}
                key={event.id}
              >
                <span aria-hidden="true" className="event-poster-glow" />
                <span className="event-poster-overline">
                  <Sparkles aria-hidden="true" size={14} />
                  AFTERGLOW · EVENT GALLERY
                </span>
                <span className="event-poster-copy">
                  <span className="event-poster-status">
                    {isPreview ? "Design preview" : statusLabel(event.status)}
                  </span>
                  <strong>{event.title}</strong>
                  <span className="event-poster-date">
                    <CalendarDays aria-hidden="true" size={14} />
                    {formatEventDate(event.starts_at)}
                  </span>
                </span>
                <span className="event-poster-bottom">
                  <span>
                    <MapPin aria-hidden="true" size={13} />
                    {event.venue || "A shared celebration"}
                  </span>
                  <span className="event-poster-enter">
                    {isPreview ? "Explore preview" : "Enter event"}
                    <ArrowRight aria-hidden="true" size={14} />
                  </span>
                </span>
              </Link>
            );
          })}
        </section>

        {!setupMessage && filteredEvents.length === 0 ? (
          <section aria-live="polite" className="events-empty">
            <Clock3 aria-hidden="true" size={22} />
            <h2>No events found</h2>
            <p>
              Try a different search or event filter. Published events will
              appear here.
            </p>
          </section>
        ) : null}

        <footer className="guest-footer">
          <Link className="guest-footer-brand" href="/">
            <Sparkles aria-hidden="true" size={15} />
            THE AFTERGLOW
          </Link>
          <p>A night worth remembering. A little light to take with you.</p>
          <Link className="guest-footer-admin" href="/admin/login">
            Studio sign in
          </Link>
        </footer>
      </div>

      <GuestMobileNav current="events" />
    </main>
  );
}

function statusLabel(status: PublicEvent["status"]) {
  if (status === "live") {
    return "Live now";
  }
  if (status === "archived") {
    return "A past celebration";
  }
  return "Coming soon";
}
