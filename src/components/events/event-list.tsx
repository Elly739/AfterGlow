import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/lib/database.types";
import { formatEventDate } from "@/lib/events";

export function EventList({ events }: Readonly<{ events: Event[] }>) {
  return (
    <div className="event-list">
      {events.map((event) => (
        <Link
          className="event-card"
          href={`/admin/events/${event.id}`}
          key={event.id}
        >
          <div>
            <h3 className="event-card-title">{event.title}</h3>
            <div className="event-meta">
              <span>
                <CalendarDays aria-hidden="true" size={14} />
                {formatEventDate(event.starts_at)}
              </span>
              {event.venue ? (
                <span>
                  <MapPin aria-hidden="true" size={14} />
                  {event.venue}
                </span>
              ) : null}
            </div>
          </div>
          <div className="event-card-end">
            <span className="status-pill" data-status={event.status}>
              {event.status}
            </span>
            <ArrowUpRight aria-hidden="true" color="#8b887f" size={17} />
          </div>
        </Link>
      ))}
    </div>
  );
}
