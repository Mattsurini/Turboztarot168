export type Service = {
  id: string;
  slug: string;
  name: string;
  short_desc: string;
  description: string;
  price: string;
  duration_min: number;
  order: number;
  active: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  published_at: string;
  category: Category | null;
};

export type AvailableSlot = {
  start: string; // ISO, Asia/Bangkok
  end: string;
};

export type RawEvent = {
  start: Date;
  end: Date;
  /** true = this window is open for bookings; false = busy/not available. */
  open: boolean;
};

export type DayAvailability = {
  date: string; // YYYY-MM-DD
  slots: AvailableSlot[];
};
