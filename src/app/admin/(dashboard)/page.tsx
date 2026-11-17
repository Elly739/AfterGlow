import { CalendarDays, CircleDot, Clock3, Plus } from "lucide-react";
import Link from "next/link";
import { EventList } from "@/components/events/event-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { isEventSchemaError } from "@/lib/guest-events";

export default async function DashboardPage() {
  if (!getSupabaseConfig()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Afterglow event list failed:", error.message);
    return (
      <>
        <div className="page-heading">
          <div>
            <p className="eyebrow">Your workspace</p>
            <h1>Welcome to Afterglow</h1>
          </div>
        </div>
        <div className="alert">
          {isEventSchemaError(error) ? (
            <>
              <strong>Supabase is missing the event schema.</strong>
              <p>
                In the SQL Editor for the project configured in .env.local, run
                supabase/migrations/001_initial_schema.sql, then
                supabase/migrations/002_guest_event_access.sql. The second
                migration refreshes the API schema. Then reload this page.
              </p>
            </>
          ) : (
            <p>
              Your events could not be loaded. Check the Supabase connection
              and try again.
            </p>
          )}
        </div>
      </>
    );
  }

  const liveCount = events.filter((event) => event.status === "live").length;
  const upcomingCount = events.filter(
    (event) => event.status === "upcoming",
  ).length;

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h1>Welcome to Afterglow</h1>
          <p className="heading-copy">
            Each event is its own little world. Create one to start gathering
            the moments that make it yours.
          </p>
        </div>
        <Link className="button button-primary" href="/admin/events/new">
          <Plus aria-hidden="true" size={17} />
          Create event
        </Link>
      </div>

      <section aria-label="Event overview" className="stats-grid">
        <StatCard
          icon={<CalendarDays aria-hidden="true" size={16} />}
          label="Total events"
          value={events.length}
        />
        <StatCard
          icon={<CircleDot aria-hidden="true" size={16} />}
          label="Live now"
          value={liveCount}
        />
        <StatCard
          icon={<Clock3 aria-hidden="true" size={16} />}
          label="Coming up"
          value={upcomingCount}
        />
      </section>

      <section aria-labelledby="events-heading">
        <div className="section-heading">
          <h2 id="events-heading">Your events</h2>
          <span className="topbar-kicker">
            {events.length} {events.length === 1 ? "event" : "events"}
          </span>
        </div>
        {events.length > 0 ? (
          <EventList events={events} />
        ) : (
          <div className="empty-state">
            <span className="empty-icon">
              <CalendarDays aria-hidden="true" size={21} />
            </span>
            <h2>Your first gathering starts here</h2>
            <p>
              Create an event and give your guests a place to share the
              photographs and memories you make together.
            </p>
            <Link className="button button-primary" href="/admin/events/new">
              <Plus aria-hidden="true" size={16} />
              Create your first event
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
}: Readonly<{ icon: React.ReactNode; label: string; value: number }>) {
  return (
    <div className="stat-card">
      <div className="stat-label">
        {icon}
        {label}
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
