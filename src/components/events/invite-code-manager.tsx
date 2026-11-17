"use client";

import { useActionState } from "react";
import { KeyRound, LoaderCircle } from "lucide-react";
import { rotateEventInviteCode } from "@/app/admin/actions";
import { CopyValueButton } from "@/components/common/copy-value-button";

export function InviteCodeManager({ eventId }: Readonly<{ eventId: string }>) {
  const action = rotateEventInviteCode.bind(null, eventId);
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <section aria-labelledby="guest-code-title" className="form-card">
      <h2 id="guest-code-title">Guest access</h2>
      <p className="form-intro">
        Guests can browse the event poster, but need this private code to open
        its gallery. Replacing the code immediately disables the old one.
      </p>
      {state.error ? (
        <p aria-live="polite" className="alert">
          {state.error}
        </p>
      ) : null}
      {state.inviteCode ? (
        <div className="invite-code-value">
          <code>{state.inviteCode}</code>
          <CopyValueButton value={state.inviteCode} />
        </div>
      ) : null}
      <form action={formAction}>
        <input name="confirm" type="hidden" value="rotate" />
        <button className="button button-secondary" disabled={isPending} type="submit">
          {isPending ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />
          ) : (
            <KeyRound aria-hidden="true" size={16} />
          )}
          {isPending ? "Creating code…" : "Create a new guest code"}
        </button>
      </form>
    </section>
  );
}
