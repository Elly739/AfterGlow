"use client";

import { useActionState } from "react";
import { LoaderCircle, LogIn } from "lucide-react";
import { signIn } from "@/app/admin/login/actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, {});

  return (
    <form action={formAction} className="form-fields">
      {state.error ? (
        <p aria-live="polite" className="alert login-alert">
          {state.error}
        </p>
      ) : null}
      <div className="field">
        <label className="field-label" htmlFor="email">
          Email address
        </label>
        <input
          autoComplete="email"
          className="input"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
        {state.fieldErrors?.email ? (
          <span className="field-error">{state.fieldErrors.email}</span>
        ) : null}
      </div>
      <div className="field">
        <label className="field-label" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className="input"
          id="password"
          name="password"
          required
          type="password"
        />
        {state.fieldErrors?.password ? (
          <span className="field-error">{state.fieldErrors.password}</span>
        ) : null}
      </div>
      <button className="button button-primary" disabled={isPending} type="submit">
        {isPending ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />
        ) : (
          <LogIn aria-hidden="true" size={16} />
        )}
        {isPending ? "Signing in…" : "Sign in to Studio"}
      </button>
    </form>
  );
}
