import Link from "next/link";
import { createEvent } from "@/app/admin/actions";
import { EventForm } from "@/components/events/event-form";

export default function NewEventPage() {
  return (
    <>
      <p className="breadcrumb">
        <Link href="/admin">Events</Link>
        <span>/</span>
        New event
      </p>
      <div className="page-heading">
        <div>
          <p className="eyebrow">A new beginning</p>
          <h1>Create an event</h1>
          <p className="heading-copy">
            Set up a private home for the memories your guests will make.
          </p>
        </div>
      </div>
      <div className="form-layout">
        <EventForm action={createEvent} />
        <aside className="side-note">
          <h3>One event, one shared story.</h3>
          <p>
            Every event gets its own private access credential and independent
            settings. Guests will not need to create an account.
          </p>
        </aside>
      </div>
    </>
  );
}
