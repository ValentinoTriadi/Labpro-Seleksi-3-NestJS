export class CreateFilmDto {
  readonly title: string;
  readonly description: string;
  readonly director: string;
  readonly release_year: number;
  readonly genre: string[];
  readonly price: number;
  readonly duration: number;
  readonly video: string;
  readonly cover_image: string | null;
}
