import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { SetupNotice } from "@/components/admin/setup-notice";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (!getSupabaseConfig()) {
    return <SetupNotice />;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && error.name !== "AuthSessionMissingError") {
    console.error("Afterglow login session check failed:", error.message);
    throw new Error("Unable to verify the current session. Please try again.");
  }

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="login-page">
      <section className="login-story">
        <div className="brand">
          <span className="brand-mark">
            <Sparkles aria-hidden="true" size={18} />
          </span>
          <span>
            <span className="brand-name">Afterglow</span>
            <span className="brand-caption">Studio</span>
          </span>
        </div>
        <div className="login-quote">
          <p>Make room for the moments that matter.</p>
          <h1>Every gathering leaves a little light behind.</h1>
          <span>
            Your private workspace for creating events and keeping every
            memory close.
          </span>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <p className="eyebrow">Administrator access</p>
          <h2>Welcome back</h2>
          <p>Sign in to create and manage your Afterglow events.</p>
          <LoginForm />
          <p className="login-footnote">
            Admin accounts are provisioned by the Afterglow owner. Guest
            accounts are not required.
          </p>
          <Link className="login-back-link" href="/">
            Return to the guest site
          </Link>
        </div>
      </section>
    </main>
  );
}
