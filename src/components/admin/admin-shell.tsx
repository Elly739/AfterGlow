import {
  CalendarDays,
  Globe2,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/admin/login/actions";

export function AdminShell({
  children,
  email,
}: Readonly<{
  children: React.ReactNode;
  email: string;
}>) {
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <Link aria-label="Afterglow Studio home" className="brand" href="/admin">
          <span className="brand-mark">
            <Sparkles aria-hidden="true" size={18} />
          </span>
          <span>
            <span className="brand-name">Afterglow</span>
            <span className="brand-caption">Studio</span>
          </span>
        </Link>

        <p className="sidebar-label">Workspace</p>
        <nav aria-label="Main navigation" className="nav-list">
          <Link className="nav-link active" href="/admin">
            <LayoutDashboard aria-hidden="true" size={17} />
            Overview
          </Link>
          <Link className="nav-link" href="/admin#events-heading">
            <CalendarDays aria-hidden="true" size={17} />
            Events
          </Link>
          <Link className="nav-link" href="/events">
            <Globe2 aria-hidden="true" size={17} />
            Guest site
          </Link>
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-label">Signed in as</p>
          <p className="account-email" title={email}>
            {email}
          </p>
          <form action={signOut}>
            <button className="sign-out" type="submit">
              <LogOut aria-hidden="true" size={15} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <span className="topbar-kicker">Your memories, thoughtfully kept.</span>
          <Link className="topbar-date topbar-site-link" href="/events">
            View guest site
          </Link>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
