import { Sparkles } from "lucide-react";

export function SetupNotice() {
  return (
    <main className="setup-card">
      <p className="eyebrow">Afterglow Studio · First-time setup</p>
      <h1>Connect your Supabase project</h1>
      <p>
        The workspace is ready, but it needs a Supabase project before an
        administrator can sign in or manage events.
      </p>
      <ol>
        <li>Create a Supabase project and apply the migrations in <code>supabase/migrations</code>.</li>
        <li>Copy <code>.env.example</code> to <code>.env.local</code>.</li>
        <li>Set the project URL and public anon key, then restart the dev server.</li>
        <li>Create the first administrator in Supabase Auth.</li>
      </ol>
      <p className="alert alert-info">
        <Sparkles aria-hidden="true" size={17} />
        <span>
          The service-role key is not needed for this milestone and must never
          be exposed in a browser.
        </span>
      </p>
    </main>
  );
}
