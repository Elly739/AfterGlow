export const guestPreviewSlug = "preview";

export type PreviewAlbum =
  | "Arrivals"
  | "Golden hour"
  | "After dark"
  | "Little details";

export type PreviewMoment = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  album: PreviewAlbum;
  time: string;
  aspect: "portrait" | "landscape" | "square";
  kind: "photo" | "video";
  duration?: string;
};

export const previewAlbums: PreviewAlbum[] = [
  "Arrivals",
  "Golden hour",
  "After dark",
  "Little details",
];

export const previewMoments: PreviewMoment[] = [
  {
    id: "afterglow",
    src: "/preview/hero.jpeg",
    alt: "Fireworks illuminate a crowd celebrating together",
    caption: "When the whole room came alive",
    album: "After dark",
    time: "11:42 PM",
    aspect: "landscape",
    kind: "video",
    duration: "0:18",
  },
  {
    id: "arrival",
    src: "/preview/arrival.jpeg",
    alt: "A celebration cake decorated with fresh flowers",
    caption: "A little something sweet",
    album: "Little details",
    time: "8:14 PM",
    aspect: "portrait",
    kind: "photo",
  },
  {
    id: "first-light",
    src: "/preview/dancefloor.jpeg",
    alt: "Friends and family gathered by the water for a celebration",
    caption: "All of us, in one place",
    album: "Arrivals",
    time: "6:32 PM",
    aspect: "portrait",
    kind: "photo",
  },
  {
    id: "the-table",
    src: "/preview/toast.jpeg",
    alt: "A flower-filled celebration table glowing in the evening",
    caption: "Before the first toast",
    album: "Little details",
    time: "7:06 PM",
    aspect: "landscape",
    kind: "photo",
  },
  {
    id: "golden-hour",
    src: "/preview/golden-hour.jpeg",
    alt: "A couple celebrating together at golden hour",
    caption: "A minute before sunset",
    album: "Golden hour",
    time: "5:48 PM",
    aspect: "portrait",
    kind: "photo",
  },
  {
    id: "portrait",
    src: "/preview/candid.jpeg",
    alt: "A guest enjoying a quiet moment outdoors",
    caption: "Caught between the songs",
    album: "Arrivals",
    time: "9:21 PM",
    aspect: "portrait",
    kind: "photo",
  },
  {
    id: "hands",
    src: "/preview/couple.jpeg",
    alt: "Two hands coming together during a celebration",
    caption: "A promise, held close",
    album: "Golden hour",
    time: "6:04 PM",
    aspect: "landscape",
    kind: "photo",
  },
  {
    id: "last-dance",
    src: "/preview/party.jpeg",
    alt: "A couple sharing a dance as the sun sets",
    caption: "We saved the last dance",
    album: "After dark",
    time: "11:57 PM",
    aspect: "landscape",
    kind: "photo",
  },
];
