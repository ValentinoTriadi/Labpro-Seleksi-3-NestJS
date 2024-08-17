import { Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FilmsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createFilmDto: CreateFilmDto) {
    try {
      const { video, cover_image, ...rest } = createFilmDto;
      const data = {
        ...rest,
        video_url: video,
        cover_image_url: cover_image || null,
      };

      // existing title and director at the same yaer handler
      const existingFilm = await this.databaseService.film.findFirst({
        where: {
          title: data.title,
          director: data.director,
          release_year: data.release_year,
        },
      });
      if (existingFilm) {
        return {
          status: 'error',
          message:
            'Film with the same title and director at the same year already exists',
          data: null,
        };
      }

      // create film
      const result = await this.databaseService.film.create({
        data,
      });
      return {
        status: 'success',
        message: 'Film created successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async findAll(q?: string) {
    try {
      const where: Prisma.FilmWhereInput = q
        ? {
            OR: [
              {
                title: {
                  contains: q,
                  mode: 'insensitive',
                },
              },
              {
                director: {
                  contains: q,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {};

      const result = await this.databaseService.film.findMany({
        where,
        select: {
          id: true,
          title: true,
          director: true,
          release_year: true,
          genre: true,
          price: true,
          duration: true,
          cover_image_url: true,
          created_at: true,
          updated_at: true,
        },
      });

      // check if films exist
      if (!result) {
        return {
          status: 'error',
          message: 'Films not found',
          data: null,
        };
      }

      return {
        status: 'success',
        message: 'Films retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Films retrieval failed',
        data: null,
      };
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.databaseService.film.findUnique({
        where: {
          id,
        },
      });

      // check if films exist
      if (!result) {
        return {
          status: 'error',
          message: 'Film not found',
          data: null,
        };
      }

      return {
        status: 'success',
        message: 'Film retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Film retrieval failed',
        data: null,
      };
    }
  }

  async update(id: string, updateFilmDto: UpdateFilmDto) {
    try {
      const { video, cover_image, ...rest } = updateFilmDto;
      const data = {
        ...rest,
        video_url: video || undefined,
        cover_image_url: cover_image || null,
      };

      const where = {
        title: data.title,
        director: data.director,
        release_year: data.release_year,
      };

      if (where.title && where.director && where.release_year) {
        // existing title and director at the same year handler
        const existingFilm = await this.databaseService.film.findFirst({
          where: {
            ...where,
            NOT: {
              id,
            },
          },
        });
        if (existingFilm) {
          return {
            status: 'error',
            message:
              'Film with the same title and director at the same year already exists',
            data: null,
          };
        }
      }

      // update film
      const result = await this.databaseService.film.update({
        where: {
          id,
        },
        data,
      });

      return {
        status: 'success',
        message: 'Film updated successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async remove(id: string) {
    try {
      const result = await this.databaseService.film.delete({
        where: {
          id,
        },
        select: {
          id: true,
          title: true,
          description: true,
          director: true,
          release_year: true,
          genre: true,
          video_url: true,
          created_at: true,
          updated_at: true,
        },
      });

      // check if films exist
      if (!result) {
        return {
          status: 'error',
          message: 'Film not found',
          data: null,
        };
      }

      return {
        status: 'success',
        message: 'Film deleted successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Film deletion failed',
        data: null,
      };
    }
  }
}
