"use client";

import { useActionState } from "react";
import { ArrowRight, LoaderCircle, LockKeyhole } from "lucide-react";
import { unlockGuestEvent } from "@/app/e/[slug]/actions";

export function EventAccessForm({ slug }: Readonly<{ slug: string }>) {
  const action = unlockGuestEvent.bind(null, slug);
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="event-access-form">
      <label htmlFor="access_code">Your host’s guest code</label>
      <input
        autoCapitalize="none"
        autoComplete="off"
        id="access_code"
        inputMode="text"
        maxLength={64}
        minLength={64}
        name="access_code"
        pattern="[a-fA-F0-9]{64}"
        placeholder="Paste the 64-character code"
        required
        spellCheck={false}
      />
      {state.error ? (
        <p aria-live="polite" className="event-access-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="guest-button guest-button-gold" disabled={isPending} type="submit">
        {isPending ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />
        ) : (
          <LockKeyhole aria-hidden="true" size={15} />
        )}
        {isPending ? "Checking code…" : "Open private gallery"}
        <ArrowRight aria-hidden="true" size={15} />
      </button>
    </form>
  );
}
