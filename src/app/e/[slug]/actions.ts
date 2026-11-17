"use server";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  guestEventCookieName,
  isEventSchemaError,
  validateGuestCode,
} from "@/lib/guest-events";

export type GuestAccessState = {
  error?: string;
};

const accessCodeSchema = z.string().trim().regex(/^[a-fA-F0-9]{64}$/);

export async function unlockGuestEvent(
  slug: string,
  _previousState: GuestAccessState,
  formData: FormData,
): Promise<GuestAccessState> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "This event link is not valid." };
  }

  const parsedCode = accessCodeSchema.safeParse(formData.get("access_code"));
  if (!parsedCode.success) {
    return { error: "Enter the 64-character guest code from your host." };
  }

  const token = parsedCode.data.toLowerCase();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const { data: authorized, error } = await validateGuestCode(slug, tokenHash);

  if (error) {
    console.error("Afterglow guest code verification failed:", error.message);
    return {
      error: isEventSchemaError(error)
        ? "Guest access is not set up yet. The administrator needs to apply the Supabase migrations."
        : "This event could not be opened. Please try again.",
    };
  }

  if (!authorized) {
    return { error: "That guest code is not valid for this event." };
  }

  const cookieStore = await cookies();
  cookieStore.set(guestEventCookieName(slug), token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: `/e/${slug}`,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect(`/e/${slug}/gallery`);
}
