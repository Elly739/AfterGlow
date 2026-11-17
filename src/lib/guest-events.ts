import "server-only";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const guestEventCookieName = (slug: string) =>
  `afterglow-event-${slug}`;

export function isEventSchemaError(error: { code?: string; message?: string }) {
  return (
    error.code === "PGRST202" ||
    error.code === "PGRST205" ||
    /public\.events|list_public_events|get_public_event|verify_event_access/i.test(
      error.message ?? "",
    )
  );
}

export async function listPublicEvents() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("list_public_events");
  return { events: data, error };
}

export async function getPublicEvent(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_public_event", {
    p_slug: slug,
  });
  return { event: data?.[0] ?? null, error };
}

export async function validateGuestCode(slug: string, tokenHash: string) {
  const supabase = await createSupabaseServerClient();
  return supabase.rpc("verify_event_access", {
    p_slug: slug,
    p_token_hash: tokenHash,
  });
}

export async function hasGuestEventAccess(slug: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(guestEventCookieName(slug))?.value;
  if (!token) {
    return { authorized: false, error: null };
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const { data, error } = await validateGuestCode(slug, tokenHash);
  if (error) {
    console.error("Afterglow guest access check failed:", error.message);
    return { authorized: false, error };
  }

  return { authorized: data === true, error: null };
}
