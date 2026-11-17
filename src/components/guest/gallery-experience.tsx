"use client";

import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowLeft,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Play,
  Share2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { EventHeader, GuestMobileNav } from "@/components/guest/event-chrome";
import { guestPreviewSlug, previewAlbums, previewMoments } from "@/lib/guest-preview";
import type { PreviewAlbum, PreviewMoment } from "@/lib/guest-preview";

type PreviewUpload = {
  name: string;
  previewUrl: string;
  kind: "image" | "video";
};

const noMoments: PreviewMoment[] = [];

export function GalleryExperience({
  eventSlug = guestPreviewSlug,
  eventTitle = "A night worth remembering",
}: Readonly<{ eventSlug?: string; eventTitle?: string }>) {
  const isPreview = eventSlug === guestPreviewSlug;
  const moments = isPreview ? previewMoments : noMoments;
  const albums = isPreview ? previewAlbums : [];
  const [activeAlbum, setActiveAlbum] = useState<PreviewAlbum | "All moments">(
    "All moments",
  );
  const [activeMoment, setActiveMoment] = useState<PreviewMoment | null>(null);
  const [likes, setLikes] = useState<string[]>([]);
  const [uploads, setUploads] = useState<PreviewUpload[]>([]);
  const [uploadNotice, setUploadNotice] = useState("");
  const [shareNotice, setShareNotice] = useState("");

  const filteredMoments = useMemo(
    () =>
      activeAlbum === "All moments"
        ? moments
        : moments.filter((moment) => moment.album === activeAlbum),
    [activeAlbum, moments],
  );

  const closeMoment = useCallback(() => setActiveMoment(null), [setActiveMoment]);

  useEffect(() => {
    if (!activeMoment) {
      return;
    }
    const activeMomentId = activeMoment.id;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMoment();
      }
      if (event.key === "ArrowRight") {
        moveMoment(1);
      }
      if (event.key === "ArrowLeft") {
        moveMoment(-1);
      }
    };

    function moveMoment(direction: number) {
      const currentIndex = filteredMoments.findIndex(
        (moment) => moment.id === activeMomentId,
      );
      const nextIndex =
        (currentIndex + direction + filteredMoments.length) %
        filteredMoments.length;
      setActiveMoment(filteredMoments[nextIndex]);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("guest-dialog-open");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("guest-dialog-open");
    };
  }, [activeMoment, closeMoment, filteredMoments]);

  useEffect(
    () => () => {
      for (const upload of uploads) {
        URL.revokeObjectURL(upload.previewUrl);
      }
    },
    [uploads],
  );

  function handleUploadChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const supportedFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/"),
    );
    const nextUploads = supportedFiles.slice(0, 6).map((file) => ({
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      kind: file.type.startsWith("video/") ? "video" as const : "image" as const,
    }));

    for (const upload of uploads) {
      URL.revokeObjectURL(upload.previewUrl);
    }
    setUploads(nextUploads);
    setUploadNotice(
      files.length > 6
        ? "The preview is limited to 6 files at a time."
        : supportedFiles.length === 0 && files.length > 0
          ? "Choose an image or video file to see a local preview."
          : "",
    );
  }

  function toggleLike(momentId: string) {
    setLikes((current) =>
      current.includes(momentId)
        ? current.filter((id) => id !== momentId)
        : [...current, momentId],
    );
  }

  async function shareMoment(moment: PreviewMoment) {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: moment.caption,
          text: `${moment.caption} · ${eventTitle}`,
          url,
        });
        setShareNotice("Gallery link shared.");
        return;
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareNotice("Gallery link copied. Guests need this event’s code to open it.");
        return;
      }
      setShareNotice("Sharing is unavailable in this browser. Copy the gallery address from the address bar.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error("Afterglow gallery share failed:", error);
      setShareNotice("The gallery link could not be shared. Please try copying it from the address bar.");
    }
  }

  const allAlbums: Array<PreviewAlbum | "All moments"> = [
    "All moments",
    ...albums,
  ];

  return (
    <main className="guest-app guest-gallery-page">
      <EventHeader
        current="gallery"
        eventTitle={eventTitle}
        isPreview={isPreview}
        slug={eventSlug}
      />
      <div className="guest-page-width">
        <Link className="guest-back-link" href={`/e/${eventSlug}`}>
          <ArrowLeft aria-hidden="true" size={15} />
          Back to the evening
        </Link>

        <section aria-labelledby="gallery-title" className="gallery-heading">
          <div>
            <p className="guest-eyebrow">
              {isPreview ? "The evening, as we remember it" : eventTitle}
            </p>
            <h1 id="gallery-title">
              Every little <em>moment.</em>
            </h1>
            <p className="gallery-intro">
              {isPreview
                ? "A shared collection of the glances, laughter, and in-between moments that made the night ours."
                : "This gallery is private to this event. Share your moments here when uploads are connected."}
            </p>
          </div>
          <div className="gallery-heading-count">
            <span>{moments.length.toString().padStart(2, "0")}</span>
            <small>featured moments</small>
          </div>
        </section>

        <section aria-label="Photo albums" className="gallery-toolbar">
          <div aria-label="Filter by album" className="album-filters" role="group">
            {allAlbums.map((album) => {
              const count =
                album === "All moments"
                  ? moments.length
                  : moments.filter((moment) => moment.album === album).length;
              return (
                <button
                  aria-pressed={activeAlbum === album}
                  className={
                    activeAlbum === album
                      ? "album-filter active"
                      : "album-filter"
                  }
                  key={album}
                  onClick={() => setActiveAlbum(album)}
                  type="button"
                >
                  {album}
                  <span>{count}</span>
                </button>
              );
            })}
          </div>
          <span className="gallery-sort-label">
            <span className="gallery-live-dot" />
            {filteredMoments.length}{" "}
            {filteredMoments.length === 1 ? "moment" : "moments"}
          </span>
        </section>

        <section aria-label="Event photos and films" className="gallery-grid">
          {filteredMoments.map((moment) => (
            <article
              className={`gallery-card ${moment.aspect}`}
              key={moment.id}
            >
              <button
                aria-label={`Open ${moment.kind}: ${moment.caption}`}
                className="gallery-card-open"
                onClick={() => setActiveMoment(moment)}
                type="button"
              >
                <Image
                  alt={moment.alt}
                  className="gallery-card-image"
                  fill
                  sizes="(max-width: 620px) 48vw, (max-width: 1000px) 32vw, 24vw"
                  src={moment.src}
                />
                <span aria-hidden="true" className="gallery-card-shade" />
                {moment.kind === "video" ? (
                  <span aria-hidden="true" className="gallery-play">
                    <Play fill="currentColor" size={17} />
                  </span>
                ) : null}
                <span className="gallery-card-meta">
                  <span className="gallery-album-label">{moment.album}</span>
                  <span>{moment.time}</span>
                </span>
              </button>
              <div className="gallery-card-caption">
                <span>
                  {moment.kind === "video" ? (
                    <span className="gallery-kind">
                      <Play aria-hidden="true" fill="currentColor" size={10} />
                      Film · {moment.duration}
                    </span>
                  ) : (
                    <span className="gallery-kind">A shared photograph</span>
                  )}
                  <strong>{moment.caption}</strong>
                </span>
                <span className="gallery-card-actions">
                  <button
                    aria-label={`Share ${moment.caption}`}
                    className="gallery-favorite"
                    onClick={() => void shareMoment(moment)}
                    type="button"
                  >
                    <Share2 aria-hidden="true" size={15} />
                  </button>
                  <button
                    aria-label={
                      likes.includes(moment.id)
                        ? `Unlike ${moment.caption}`
                        : `Like ${moment.caption}`
                    }
                    aria-pressed={likes.includes(moment.id)}
                    className={
                      likes.includes(moment.id)
                        ? "gallery-favorite favorited"
                        : "gallery-favorite"
                    }
                    onClick={() => toggleLike(moment.id)}
                    type="button"
                  >
                    <Heart
                      aria-hidden="true"
                      fill={likes.includes(moment.id) ? "currentColor" : "none"}
                      size={17}
                    />
                  </button>
                </span>
              </div>
            </article>
          ))}
        </section>
        {!isPreview && moments.length === 0 ? (
          <section aria-label="Empty event gallery" className="gallery-empty">
            <Camera aria-hidden="true" size={23} />
            <h2>The first memory is waiting to be shared.</h2>
            <p>
              This private gallery belongs to {eventTitle}. Once photo and video
              uploads are connected, your guests can add memories here.
            </p>
          </section>
        ) : null}
        {shareNotice ? (
          <p aria-live="polite" className="gallery-share-notice">
            {shareNotice}
          </p>
        ) : null}

        <section aria-labelledby="upload-title" className="gallery-upload" id="upload">
          <div className="gallery-upload-icon">
            <Upload aria-hidden="true" size={20} />
          </div>
          <div className="gallery-upload-copy">
            <p className="guest-eyebrow">The album is better with you in it</p>
            <h2 id="upload-title">Add your moments to the story.</h2>
            <p>
              {isPreview
                ? "Pick a few photos or videos to preview. Files selected here are not saved."
                : "Choose photos or videos for this event. Uploads are being connected, so selections stay on this device for now."}
            </p>
          </div>
          <label className="guest-button guest-button-gold gallery-pick-button">
            <Camera aria-hidden="true" size={15} />
            Choose photos
            <input
              accept="image/*,video/*"
              aria-label="Choose photos or videos to preview"
              className="gallery-file-input"
              multiple
              onChange={handleUploadChange}
              type="file"
            />
          </label>
          {uploads.length > 0 || uploadNotice ? (
            <div aria-live="polite" className="gallery-upload-preview">
              {uploads.length > 0 ? (
                <>
                  <p className="guest-eyebrow">
                    <Check aria-hidden="true" size={13} />
                    {uploads.length} local {uploads.length === 1 ? "preview" : "previews"} selected
                  </p>
                  <div className="gallery-upload-thumbnails">
                    {uploads.map((upload) => (
                      <span className="gallery-upload-thumb" key={upload.previewUrl}>
                        {upload.kind === "video" ? (
                          <video aria-label={`Video preview: ${upload.name}`} src={upload.previewUrl} />
                        ) : (
                          <Image
                            alt=""
                            fill
                            sizes="72px"
                            src={upload.previewUrl}
                            unoptimized
                          />
                        )}
                        <span>{upload.name}</span>
                      </span>
                    ))}
                  </div>
                  <p className="gallery-upload-disclaimer">
                    {isPreview
                      ? "These files have not been uploaded or saved. This is a local design preview."
                      : "These files have not been uploaded or saved to this event. This is a local preview only."}
                  </p>
                </>
              ) : null}
              {uploadNotice ? (
                <p className="gallery-upload-disclaimer">{uploadNotice}</p>
              ) : null}
            </div>
          ) : null}
        </section>

        <footer className="guest-footer">
          <Link
            aria-label="Back to event home"
            className="guest-footer-brand"
            href={`/e/${eventSlug}`}
          >
            <Camera aria-hidden="true" size={15} />
            THE AFTERGLOW
          </Link>
          <p>A night worth remembering. A little light to take with you.</p>
          <Link className="guest-footer-admin" href="/admin/login">
            Studio sign in
          </Link>
        </footer>
      </div>

      <GuestMobileNav
        current="gallery"
        slug={eventSlug}
      />

      {activeMoment ? (
        <div
          aria-label="Moment viewer"
          aria-modal="true"
          className="moment-dialog-backdrop"
          onClick={closeMoment}
          role="dialog"
        >
          <div className="moment-dialog" onClick={(event) => event.stopPropagation()}>
            <div className="moment-dialog-topbar">
              <span>
                {activeMoment.album}
                <span className="moment-dialog-dot">·</span>
                {activeMoment.time}
              </span>
              <div>
                <a
                  aria-label={
                    activeMoment.kind === "video"
                      ? "Download sample video thumbnail"
                      : "Download sample photo"
                  }
                  className="moment-dialog-action"
                  download
                  href={activeMoment.src}
                >
                  <ArrowDownToLine aria-hidden="true" size={17} />
                </a>
                <button
                  aria-label="Close moment viewer"
                  className="moment-dialog-action"
                  onClick={closeMoment}
                  type="button"
                >
                  <X aria-hidden="true" size={19} />
                </button>
              </div>
            </div>
            <div className="moment-dialog-image-wrap">
              <Image
                alt={activeMoment.alt}
                className="moment-dialog-image"
                fill
                priority
                sizes="(max-width: 800px) 100vw, 80vw"
                src={activeMoment.src}
              />
              {activeMoment.kind === "video" ? (
                <span aria-label="Sample video thumbnail" className="moment-video-preview">
                  <Play aria-hidden="true" fill="currentColor" size={23} />
                  <span>Sample film · playback coming soon</span>
                </span>
              ) : null}
              <button
                aria-label="Previous moment"
                className="moment-dialog-nav previous"
                onClick={() => {
                  const index = filteredMoments.findIndex(
                    (moment) => moment.id === activeMoment.id,
                  );
                  setActiveMoment(
                    filteredMoments[
                      (index - 1 + filteredMoments.length) % filteredMoments.length
                    ],
                  );
                }}
                type="button"
              >
                <ChevronLeft aria-hidden="true" size={20} />
              </button>
              <button
                aria-label="Next moment"
                className="moment-dialog-nav next"
                onClick={() => {
                  const index = filteredMoments.findIndex(
                    (moment) => moment.id === activeMoment.id,
                  );
                  setActiveMoment(
                    filteredMoments[(index + 1) % filteredMoments.length],
                  );
                }}
                type="button"
              >
                <ChevronRight aria-hidden="true" size={20} />
              </button>
            </div>
            <div className="moment-dialog-caption">
              <span>
                <small>{activeMoment.album}</small>
                <strong>{activeMoment.caption}</strong>
              </span>
              <span className="moment-dialog-count">
                {filteredMoments.findIndex(
                  (moment) => moment.id === activeMoment.id,
                ) + 1}{" "}
                / {filteredMoments.length}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
