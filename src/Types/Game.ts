export type Game = {
  id: number;
  slug: string;
  name: string;
  metacritic: number;
  background_image: string;
  released?: string;
  ratings_count?: number;

  tags: [
    {
      id: number;
      name: string;
      language: string;
    },
  ];
  genres: [
    {
      id: number;
      name: string;
      slug: string;
    },
  ];
};
