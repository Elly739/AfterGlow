"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { parseEventForm } from "@/lib/events/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type EventActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  inviteCode?: string;
  eventId?: string;
  eventSlug?: string;
};

export async function createEvent(
  _previousState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError && authError.name !== "AuthSessionMissingError") {
    console.error("Afterglow event creation auth check failed:", authError.message);
    return { error: "Your session could not be verified. Please sign in again." };
  }

  if (!user) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const parsed = parseEventForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const inviteCode = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(inviteCode).digest("hex");
  const { data: eventId, error } = await supabase.rpc(
    "create_event_with_access",
    {
      p_title: parsed.data.title,
      p_slug: parsed.data.slug,
      p_description: parsed.data.description,
      p_venue: parsed.data.venue,
      p_starts_at: parsed.data.starts_at,
      p_guest_uploads_enabled: parsed.data.guest_uploads_enabled,
      p_guest_messages_enabled: parsed.data.guest_messages_enabled,
      p_downloads_enabled: parsed.data.downloads_enabled,
      p_retention_mode: parsed.data.retention_mode,
      p_retention_days: parsed.data.retention_days,
      p_retention_until: parsed.data.retention_until,
      p_token_hash: tokenHash,
      p_status: parsed.data.status,
    },
  );

  if (error) {
    if (error.code === "23505") {
      return {
        fieldErrors: { slug: "That event link is already in use. Choose another." },
      };
    }
    console.error("Afterglow event creation failed:", error.message);
    return { error: "The event could not be created. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/events");
  return {
    inviteCode,
    eventId,
    eventSlug: parsed.data.slug,
  };
}

export async function updateEvent(
  eventId: string,
  _previousState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  if (!z.uuid().safeParse(eventId).success) {
    return { error: "This event link is invalid." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError && authError.name !== "AuthSessionMissingError") {
    console.error("Afterglow event update auth check failed:", authError.message);
    return { error: "Your session could not be verified. Please sign in again." };
  }

  if (!user) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const parsed = parseEventForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const { data, error } = await supabase
    .from("events")
    .update(parsed.data)
    .eq("id", eventId)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return {
        fieldErrors: { slug: "That event link is already in use. Choose another." },
      };
    }
    console.error("Afterglow event update failed:", error.message);
    return { error: "The event could not be saved. Please try again." };
  }

  if (!data) {
    return { error: "This event was not found or is no longer available." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/events/${eventId}`);
  redirect(`/admin/events/${eventId}`);
}

export async function rotateEventInviteCode(
  eventId: string,
  previousState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  if (previousState.inviteCode && formData.get("confirm") !== "rotate") {
    return { error: "Confirm that you want to replace the current guest code." };
  }

  if (!z.uuid().safeParse(eventId).success) {
    return { error: "This event link is invalid." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError && authError.name !== "AuthSessionMissingError") {
    console.error("Afterglow invite rotation auth check failed:", authError.message);
    return { error: "Your session could not be verified. Please sign in again." };
  }
  if (!user) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const inviteCode = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(inviteCode).digest("hex");
  const { data, error } = await supabase
    .from("event_access")
    .update({
      token_hash: tokenHash,
      enabled: true,
      expires_at: null,
      rotated_at: new Date().toISOString(),
    })
    .eq("event_id", eventId)
    .select("event_id")
    .maybeSingle();

  if (error) {
    console.error("Afterglow invite rotation failed:", error.message);
    return { error: "A new guest code could not be created. Please try again." };
  }
  if (!data) {
    return { error: "This event has no guest access record. Apply the database migrations first." };
  }

  revalidatePath(`/admin/events/${eventId}`);
  return { inviteCode };
}
