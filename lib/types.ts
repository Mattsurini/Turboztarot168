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
  due: string;
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
