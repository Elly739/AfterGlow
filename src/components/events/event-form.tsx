"use client";

import { useActionState } from "react";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import Link from "next/link";
import type { Event, EventStatus, RetentionMode } from "@/lib/database.types";
import {
  eventStatuses,
  retentionModes,
} from "@/lib/events";
import type { EventActionState } from "@/app/admin/actions";
import { CopyValueButton } from "@/components/common/copy-value-button";

type EventFormAction = (
  previousState: EventActionState,
  formData: FormData,
) => Promise<EventActionState>;

export function EventForm({
  action,
  event,
}: Readonly<{
  action: EventFormAction;
  event?: Event;
}>) {
  const [state, formAction, isPending] = useActionState(action, {});

  if (state.inviteCode && state.eventId && state.eventSlug) {
    return (
      <section
        aria-labelledby="event-created-title"
        className="form-card invite-code-card"
      >
        <p className="eyebrow">Your event is ready</p>
        <h2 id="event-created-title">Share the private guest code</h2>
        <p className="form-intro">
          This code is shown only once. Share it with the guests you want to
          invite. They can find the event poster, then use this code to open its
          private gallery.
        </p>
        <div className="invite-code-value">
          <code>{state.inviteCode}</code>
          <CopyValueButton value={state.inviteCode} />
        </div>
        <p className="field-hint">
          Keep this code private. Creating a replacement invalidates this one.
        </p>
        <div className="form-actions">
          <Link className="button button-primary" href={`/admin/events/${state.eventId}`}>
            Manage event
          </Link>
          <Link className="button button-secondary" href={`/e/${state.eventSlug}`}>
            Preview event page
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form action={formAction}>
      {state.error ? (
        <p aria-live="polite" className="alert">
          {state.error}
        </p>
      ) : null}

      <section className="form-card">
        <h2>Event details</h2>
        <p className="form-intro">
          Give this gathering a name guests will recognize. You can update
          these details at any time.
        </p>

        <div className="form-fields">
          <div className="field">
            <label className="field-label" htmlFor="title">
              Event name
            </label>
            <input
              autoComplete="off"
              className="input"
              defaultValue={event?.title ?? ""}
              id="title"
              maxLength={100}
              name="title"
              placeholder="The evening we celebrated"
              required
            />
            <FieldError message={state.fieldErrors?.title} />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="slug">
              Event link
            </label>
            <input
              autoCapitalize="none"
              autoComplete="off"
              className="input"
              defaultValue={event?.slug ?? ""}
              id="slug"
              maxLength={80}
              name="slug"
              placeholder="leave-blank-to-use-event-name"
            />
            <span className="field-hint">
              Lowercase letters, numbers, and hyphens. The event name is used
              when this field is left blank.
            </span>
            <FieldError message={state.fieldErrors?.slug} />
          </div>

          <div className="form-row">
            <div className="field">
              <label className="field-label" htmlFor="venue">
                Venue
              </label>
              <input
                className="input"
                defaultValue={event?.venue ?? ""}
                id="venue"
                maxLength={160}
                name="venue"
                placeholder="Optional"
              />
              <FieldError message={state.fieldErrors?.venue} />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="starts_at">
                Event starts (UTC)
              </label>
              <input
                className="input"
                defaultValue={event?.starts_at?.slice(0, 16) ?? ""}
                id="starts_at"
                name="starts_at"
                type="datetime-local"
              />
              <FieldError message={state.fieldErrors?.starts_at} />
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="description">
              Description
            </label>
            <textarea
              className="textarea"
              defaultValue={event?.description ?? ""}
              id="description"
              maxLength={1200}
              name="description"
              placeholder="A few words about the occasion (optional)"
            />
            <FieldError message={state.fieldErrors?.description} />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="status">
              Event status
            </label>
            <select
              className="select"
              defaultValue={event?.status ?? "upcoming"}
              id="status"
              name="status"
            >
              {eventStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
            <FieldError message={state.fieldErrors?.status} />
            {!event ? (
              <span className="field-hint">
                Upcoming events appear in the public event directory.
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="form-card">
        <h2>Guest experience</h2>
        <p className="form-intro">
          Choose which participation options will be available for this event.
        </p>
        <div className="toggle-list">
          <label className="toggle-row">
            <input
              defaultChecked={event?.guest_uploads_enabled ?? true}
              name="guest_uploads_enabled"
              type="checkbox"
            />
            <span>
              Guest uploads
              <small>Allow guests to contribute photos and videos.</small>
            </span>
          </label>
          <label className="toggle-row">
            <input
              defaultChecked={event?.guest_messages_enabled ?? true}
              name="guest_messages_enabled"
              type="checkbox"
            />
            <span>
              Guest messages
              <small>Leave room for notes and well wishes.</small>
            </span>
          </label>
          <label className="toggle-row">
            <input
              defaultChecked={event?.downloads_enabled ?? true}
              name="downloads_enabled"
              type="checkbox"
            />
            <span>
              Downloads
              <small>Allow guests to save published media.</small>
            </span>
          </label>
        </div>
      </section>

      <section className="form-card">
        <h2>Memory retention</h2>
        <p className="form-intro">
          Choose how long this event and its memories should remain available.
        </p>
        <div className="form-fields">
          <div className="field">
            <label className="field-label" htmlFor="retention_mode">
              Retention policy
            </label>
            <select
              className="select"
              defaultValue={event?.retention_mode ?? "permanent"}
              id="retention_mode"
              name="retention_mode"
            >
              {retentionModes.map((mode) => (
                <option key={mode} value={mode}>
                  {retentionLabel(mode)}
                </option>
              ))}
            </select>
            <FieldError message={state.fieldErrors?.retention_mode} />
          </div>

          <div className="form-row">
            <div className="field">
              <label className="field-label" htmlFor="retention_days">
                Retain for (days)
              </label>
              <input
                className="input"
                defaultValue={
                  event?.retention_days ? String(event.retention_days) : ""
                }
                id="retention_days"
                max="3650"
                min="1"
                name="retention_days"
                placeholder="Required for duration policy"
                type="number"
              />
              <FieldError message={state.fieldErrors?.retention_days} />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="retention_until">
                Delete on (UTC)
              </label>
              <input
                className="input"
                defaultValue={event?.retention_until?.slice(0, 10) ?? ""}
                id="retention_until"
                name="retention_until"
                type="date"
              />
              <FieldError message={state.fieldErrors?.retention_until} />
            </div>
          </div>
        </div>
      </section>

      <div className="form-actions">
        <button className="button button-primary" disabled={isPending} type="submit">
          {isPending ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />
          ) : (
            <Save aria-hidden="true" size={16} />
          )}
          {isPending ? "Saving…" : event ? "Save changes" : "Create event"}
        </button>
        <Link className="button button-secondary" href="/admin">
          <ArrowLeft aria-hidden="true" size={15} />
          Cancel
        </Link>
      </div>
    </form>
  );
}

function FieldError({ message }: Readonly<{ message?: string }>) {
  return message ? <span className="field-error">{message}</span> : null;
}

function statusLabel(status: EventStatus) {
  return status.replace("_", " ");
}

function retentionLabel(mode: RetentionMode) {
  if (mode === "duration") {
    return "Retain for a duration";
  }
  if (mode === "until_date") {
    return "Delete on a specific date";
  }
  return "Keep indefinitely";
}
