export interface platformsFamilies {
  playstation: number[];
  xbox: number[];
  pc: number[];
  nintendo: number[];
  mobile: number[];
}

export interface ResponseApi {
  results: FamilyApi[];
}

export interface FamilyApi {
  slug: string;
  name: string;
  playtime: number;
  platforms: Platform[];
  stores: Store[];
  released: string;
  background_image: string;
  rating: number;
  ratings_count: number;
  reviews_text_count: number;
  added: number;
  added_by_status: AddedByStatus;
  metacritic: number;
  updated: string;
  id: number;
  tags: Tag[];
  reviews_count: number;
  short_screenshots: ShortScreenshot[];
  parent_platforms: ParentPlatform[];
  genres: Genre[];
}

export interface Platform {
  platform: Platform2;
}

export interface Platform2 {
  id: number;
  name: string;
  slug: string;
}

export interface Store {
  store: Store2;
}

export interface Store2 {
  id: number;
  name: string;
  slug: string;
}

export interface AddedByStatus {
  yet: number;
  owned: number;
  beaten: number;
  toplay: number;
  dropped: number;
  playing: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  language: string;
  games_count: number;
  image_background: string;
}

export interface ShortScreenshot {
  id: number;
  image: string;
}

export interface ParentPlatform {
  platform: Platform3;
}

export interface Platform3 {
  id: number;
  name: string;
  slug: string;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}
