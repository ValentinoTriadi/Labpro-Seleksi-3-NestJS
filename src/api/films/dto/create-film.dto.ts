import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class CreateFilmDto {
  @IsString()
  readonly title: string;
  @IsString()
  readonly description: string;
  @IsString()
  readonly director: string;

  @Type(() => Number)
  @IsInt()
  readonly release_year: number;

  @IsString({ each: true })
  genre: string[];

  @Type(() => Number)
  @IsInt()
  readonly price: number;

  @Type(() => Number)
  @IsInt()
  readonly duration: number;

  readonly video: Buffer;
  cover_image: Buffer | null;
}
