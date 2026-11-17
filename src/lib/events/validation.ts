import { z } from "zod";
import type { RetentionMode, EventStatus } from "@/lib/database.types";

export type EventFormValues = {
  title: string;
  slug: string;
  description: string | null;
  venue: string | null;
  starts_at: string | null;
  status: EventStatus;
  guest_uploads_enabled: boolean;
  guest_messages_enabled: boolean;
  downloads_enabled: boolean;
  retention_mode: RetentionMode;
  retention_days: number | null;
  retention_until: string | null;
};

export type EventFormErrors = Partial<
  Record<
    | "title"
    | "slug"
    | "description"
    | "venue"
    | "starts_at"
    | "status"
    | "retention_mode"
    | "retention_days"
    | "retention_until",
    string
  >
>;

export type EventFormParseResult =
  | { success: true; data: EventFormValues }
  | { success: false; fieldErrors: EventFormErrors };

const eventFormSchema = z
  .object({
    title: z.string().trim().min(2, "Enter at least 2 characters.").max(100),
    slug: z
      .string()
      .trim()
      .min(3, "Use at least 3 characters.")
      .max(80)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers, and single hyphens.",
      ),
    description: z.string().max(1200, "Keep the description under 1,200 characters."),
    venue: z.string().max(160, "Keep the venue under 160 characters."),
    starts_at: z
      .string()
      .refine((value) => value === "" || isValidUtcDateTime(value), {
        message: "Enter a valid date and time.",
      }),
    status: z.enum(["draft", "upcoming", "live", "archived", "closed"]),
    guest_uploads_enabled: z.boolean(),
    guest_messages_enabled: z.boolean(),
    downloads_enabled: z.boolean(),
    retention_mode: z.enum(["permanent", "duration", "until_date"]),
    retention_days: z.string(),
    retention_until: z.string(),
  })
  .superRefine((value, context) => {
    if (value.retention_mode === "duration") {
      const days = Number(value.retention_days);
      if (!Number.isInteger(days) || days < 1 || days > 3650) {
        context.addIssue({
          code: "custom",
          message: "Choose a duration between 1 and 3,650 days.",
          path: ["retention_days"],
        });
      }
    }

    if (
      value.retention_mode === "until_date" &&
      !isValidDate(value.retention_until)
    ) {
      context.addIssue({
        code: "custom",
        message: "Choose a valid retention date.",
        path: ["retention_until"],
      });
    }
  });

function isValidUtcDateTime(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}:00.000Z`);
  return (
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 16) === value
  );
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function toSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/-{2,}/g, "-");
}

export function parseEventForm(formData: FormData): EventFormParseResult {
  const title = readString(formData, "title");
  const rawSlug = readString(formData, "slug");
  const parsed = eventFormSchema.safeParse({
    title,
    slug: toSlug(rawSlug || title),
    description: readString(formData, "description"),
    venue: readString(formData, "venue"),
    starts_at: readString(formData, "starts_at"),
    status: readString(formData, "status") || "upcoming",
    guest_uploads_enabled: formData.get("guest_uploads_enabled") === "on",
    guest_messages_enabled: formData.get("guest_messages_enabled") === "on",
    downloads_enabled: formData.get("downloads_enabled") === "on",
    retention_mode: readString(formData, "retention_mode") || "permanent",
    retention_days: readString(formData, "retention_days"),
    retention_until: readString(formData, "retention_until"),
  });

  if (!parsed.success) {
    const fieldErrors: EventFormErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !(field in fieldErrors)) {
        fieldErrors[field as keyof EventFormErrors] = issue.message;
      }
    }
    return { success: false, fieldErrors };
  }

  const value = parsed.data;
  return {
    success: true,
    data: {
      title: value.title,
      slug: value.slug,
      description: value.description.trim() || null,
      venue: value.venue.trim() || null,
      starts_at: value.starts_at
        ? new Date(`${value.starts_at}:00.000Z`).toISOString()
        : null,
      status: value.status,
      guest_uploads_enabled: value.guest_uploads_enabled,
      guest_messages_enabled: value.guest_messages_enabled,
      downloads_enabled: value.downloads_enabled,
      retention_mode: value.retention_mode,
      retention_days:
        value.retention_mode === "duration"
          ? Number(value.retention_days)
          : null,
      retention_until:
        value.retention_mode === "until_date"
          ? new Date(`${value.retention_until}T23:59:59.999Z`).toISOString()
          : null,
    },
  };
}
