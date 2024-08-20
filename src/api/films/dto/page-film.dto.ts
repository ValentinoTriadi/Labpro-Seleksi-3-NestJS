import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PageFilmDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly take?: number = 12;
}
