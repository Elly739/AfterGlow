import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  Camera,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { EventHeader, GuestMobileNav } from "@/components/guest/event-chrome";
import { guestPreviewSlug, previewMoments } from "@/lib/guest-preview";

const eventHome = `/e/${guestPreviewSlug}`;

export function EventHome() {
  const featuredMoments = previewMoments.slice(0, 3);

  return (
    <main className="guest-app">
      <EventHeader current="home" />

      <section aria-labelledby="event-title" className="guest-hero">
        <Image
          alt="Fireworks light up a crowd gathered for a night of celebration"
          className="guest-hero-image"
          fill
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          src="/preview/hero.jpeg"
        />
        <div aria-hidden="true" className="guest-hero-shade" />
        <div className="guest-hero-copy">
          <p className="guest-eyebrow">
            <span className="gold-dot" />
            A celebration in good company
          </p>
          <h1 id="event-title">
            The moments
            <br />
            <em>remain.</em>
          </h1>
          <p className="guest-hero-subtitle">
            Celebrate the experience.
            <br />
            Preserve the memories.
          </p>
          <div className="guest-event-details">
            <span>
              <Clock3 aria-hidden="true" size={15} />
              Saturday, October 24
            </span>
            <span>
              <MapPin aria-hidden="true" size={15} />
              Chicago, Illinois
            </span>
          </div>
          <div className="guest-hero-actions">
            <Link className="guest-button guest-button-gold" href={`${eventHome}/gallery`}>
              <Camera aria-hidden="true" size={16} />
              Explore the gallery
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
            <Link className="guest-button guest-button-glass" href="/events">
              Explore events
            </Link>
          </div>
        </div>
        <a aria-label="Scroll to event memories" className="guest-scroll-cue" href="#memories">
          <ArrowDown aria-hidden="true" size={16} />
        </a>
        <span className="guest-image-credit">Sample photography · Pexels</span>
      </section>

      <div className="guest-page-width">
        <section aria-label="Event moments" className="guest-stat-row">
          <div className="guest-stat">
            <span className="guest-stat-icon">
              <Camera aria-hidden="true" size={17} />
            </span>
            <span>
              <strong>8</strong>
              <small>featured moments</small>
            </span>
          </div>
          <span aria-hidden="true" className="guest-stat-divider" />
          <div className="guest-stat">
            <span className="guest-stat-icon">
              <UsersRound aria-hidden="true" size={17} />
            </span>
            <span>
              <strong>All of us</strong>
              <small>one shared evening</small>
            </span>
          </div>
          <span aria-hidden="true" className="guest-stat-divider" />
          <div className="guest-stat">
            <span className="guest-stat-icon">
              <Sparkles aria-hidden="true" size={17} />
            </span>
            <span>
              <strong>Still glowing</strong>
              <small>and yours to revisit</small>
            </span>
          </div>
        </section>

        <section aria-labelledby="note-title" className="guest-host-note" id="note">
          <div className="guest-note-ornament">
            <span>“</span>
          </div>
          <div>
            <p className="guest-eyebrow">A note from your hosts</p>
            <h2 id="note-title">The best nights are the ones we remember together.</h2>
            <p>
              Thank you for being here. Take a look around, find your favorite
              moments, and add the ones we might have missed.
            </p>
            <span className="guest-signature">With love, your hosts</span>
          </div>
          <Heart aria-hidden="true" className="guest-note-heart" size={20} />
        </section>

        <section aria-labelledby="memories-title" className="guest-featured" id="memories">
          <div className="guest-section-heading">
            <div>
              <p className="guest-eyebrow">A few from the evening</p>
              <h2 id="memories-title">Little moments, kept close.</h2>
            </div>
            <Link className="guest-text-link" href={`${eventHome}/gallery`}>
              See all moments
              <ChevronRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <div className="guest-featured-grid">
            {featuredMoments.map((moment, index) => (
              <Link
                className={`guest-feature-card guest-feature-card-${index + 1}`}
                href={`${eventHome}/gallery`}
                key={moment.id}
              >
                <Image
                  alt={moment.alt}
                  className="guest-feature-image"
                  fill
                  sizes="(max-width: 700px) 90vw, 33vw"
                  src={moment.src}
                />
                <span aria-hidden="true" className="guest-feature-overlay" />
                <span className="guest-feature-caption">
                  <small>{moment.album}</small>
                  <strong>{moment.caption}</strong>
                </span>
                {moment.kind === "video" ? (
                  <span className="guest-video-pill">Film · {moment.duration}</span>
                ) : null}
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="share-title" className="guest-share-panel" id="share">
          <div className="guest-share-symbol">
            <Camera aria-hidden="true" size={21} />
          </div>
          <div className="guest-share-copy">
            <p className="guest-eyebrow">Your view matters, too</p>
            <h2 id="share-title">Did you catch a moment we missed?</h2>
            <p>
              The best stories are told from every side of the room. Add your
              favorite photos and little films to the collection.
            </p>
          </div>
          <Link className="guest-button guest-button-gold" href="/events">
            Explore events
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </section>

        <footer className="guest-footer">
          <Link aria-label="Back to event home" className="guest-footer-brand" href={eventHome}>
            <Sparkles aria-hidden="true" size={15} />
            THE AFTERGLOW
          </Link>
          <p>A night worth remembering. A little light to take with you.</p>
          <Link className="guest-footer-admin" href="/admin/login">
            Studio sign in
          </Link>
        </footer>
      </div>

      <GuestMobileNav current="home" />
    </main>
  );
}
