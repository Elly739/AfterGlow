import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { SetupNotice } from "@/components/admin/setup-notice";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!getSupabaseConfig()) {
    return <SetupNotice />;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && error.name !== "AuthSessionMissingError") {
    console.error("Afterglow admin session check failed:", error.message);
    return (
      <main className="setup-card">
        <p className="alert">
          Your admin session could not be verified. Refresh the page or sign in
          again.
        </p>
      </main>
    );
  }

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminShell email={user.email ?? "Administrator"}>{children}</AdminShell>;
}
