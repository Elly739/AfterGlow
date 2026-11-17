import type {
  Database,
  Event,
  EventStatus,
  RetentionMode,
} from "@/lib/database.types";

export type PublicEvent =
  Database["public"]["Functions"]["list_public_events"]["Returns"][number];

export const eventStatuses: EventStatus[] = [
  "draft",
  "upcoming",
  "live",
  "archived",
  "closed",
];

export const retentionModes: RetentionMode[] = [
  "permanent",
  "duration",
  "until_date",
];

export function formatEventDate(value: string | null) {
  if (!value) {
    return "Date not set";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function formatRetention(event: Event) {
  if (event.retention_mode === "duration") {
    return `${event.retention_days} days`;
  }

  if (event.retention_mode === "until_date" && event.retention_until) {
    return `Until ${new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeZone: "UTC",
    }).format(new Date(event.retention_until))}`;
  }

  return "Keep indefinitely";
}
