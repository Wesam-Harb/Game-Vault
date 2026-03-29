export interface Platforms {
  results: Result[];
}

export interface Result {
  id: number;
  name: string;
  slug: string;
  platforms: Platform[];
}

export interface Platform {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}
