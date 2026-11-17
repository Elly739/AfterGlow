import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { EventHeader, GuestMobileNav } from "@/components/guest/event-chrome";

export function GuestUnavailable({
  title,
  message,
}: Readonly<{ title: string; message: string }>) {
  return (
    <main className="guest-app guest-events-page">
      <EventHeader current="events" />
      <div className="guest-page-width">
        <section aria-labelledby="unavailable-title" className="events-setup-notice guest-unavailable">
          <Sparkles aria-hidden="true" size={19} />
          <div>
            <h1 id="unavailable-title">{title}</h1>
            <p>{message}</p>
            <Link className="guest-text-link" href="/events">
              <ArrowLeft aria-hidden="true" size={15} />
              Back to all events
            </Link>
          </div>
        </section>
        <footer className="guest-footer">
          <Link className="guest-footer-brand" href="/">
            <Sparkles aria-hidden="true" size={15} />
            THE AFTERGLOW
          </Link>
          <p>Every celebration, gathered in one place.</p>
          <Link className="guest-footer-admin" href="/admin/login">
            Studio sign in
          </Link>
        </footer>
      </div>
      <GuestMobileNav current="events" />
    </main>
  );
}
