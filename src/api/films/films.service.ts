import { Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { FileService } from 'src/file/file.service';
import { v4 as uuidv4 } from 'uuid';
import { PageFilmDto } from './dto/page-film.dto';
import { UploadFileStrategy } from 'src/file/strategy/upload.strategy';
import { GetFileStrategy } from 'src/file/strategy/get.strategy';
import { DeleteFileStrategy } from 'src/file/strategy/delete.strategy';

@Injectable()
export class FilmsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly fileService: FileService,
  ) {}

  async create(createFilmDto: CreateFilmDto) {
    try {
      const uuid = uuidv4();
      const { video, cover_image, ...rest } = createFilmDto;
      this.fileService.setStrategy(new UploadFileStrategy());
      const data = await {
        ...rest,
        id: uuid,
        video_url: video
          ? await this.fileService.execute({
              file: video,
              id: uuid,
              type: 'video/mp4',
            })
          : '',
        cover_image_url: cover_image
          ? await this.fileService.execute({
              file: cover_image,
              id: uuid,
              type: 'image/png',
            })
          : null,
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

  async findPage(pageFilmDto: PageFilmDto, q?: string) {
    try {
      let { take, page } = pageFilmDto;
      page ??= 1;
      page = +page;
      page = page < 1 ? 1 : page;
      take ??= 12;
      take = +take;
      take = take < 1 ? 1 : take;

      const skip = (page - 1) * take;

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

      const count = await this.databaseService.film.count({
        where,
      });

      const result = await this.databaseService.film.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
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
        skip,
        take: +take,
      });

      this.fileService.setStrategy(new GetFileStrategy());
      result.map((film) => {
        if (film.cover_image_url) {
          film.cover_image_url = this.fileService.execute({
            link: film.cover_image_url,
          });
        } else {
          film.cover_image_url = '/images/default.png';
        }
      });

      // check if films exist
      if (!result) {
        return {
          status: 'error',
          message: 'Films not found',
          data: null,
        };
      }

      const totalPage = Math.ceil(count / (take ?? 12));
      const completeResult = {
        films: result,
        totalPage,
        count,
        page: page,
        prevPage: page - 1,
        nextPage: page + 1,
        take: take,
        hasPrevious: page > 1,
        hasNext: page < totalPage,
      };

      return {
        status: 'success',
        message: 'Films retrieved successfully',
        data: completeResult,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Films retrieval failed',
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

      this.fileService.setStrategy(new GetFileStrategy());
      result.map((film) => {
        if (film.cover_image_url) {
          film.cover_image_url = this.fileService.execute({
            link: film.cover_image_url,
          });
        } else {
          film.cover_image_url = '/images/default.png';
        }
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

      this.fileService.setStrategy(new GetFileStrategy());
      if (result.cover_image_url) {
        result.cover_image_url = this.fileService.execute({
          link: result.cover_image_url,
        });
      } else {
        result.cover_image_url = '/images/default.png';
      }

      if (result.video_url !== '') {
        result.video_url = this.fileService.execute({ link: result.video_url });
      } else {
        result.video_url = '/videos/default.mp4';
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
      this.fileService.setStrategy(new UploadFileStrategy());

      const data: {
        cover_image_url: string | null;
        title?: string | undefined;
        description?: string | undefined;
        director?: string | undefined;
        release_year?: number | undefined;
        genre?: string[] | undefined;
        price?: number | undefined;
        duration?: number | undefined;
        video_url?: string | undefined;
      } = await {
        ...rest,
        cover_image_url: cover_image
          ? await this.fileService.execute({
              file: cover_image,
              id: id,
              type: 'image/png',
            })
          : null,
      };

      let video_url = null;
      if (video) {
        video_url = await this.fileService.execute({
          file: video,
          id: id,
          type: 'video/mp4',
        });
      }

      if (video_url) {
        data.video_url = video_url;
      }

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

      const film = await this.databaseService.film.findUnique({
        where: {
          id,
        },
      });

      // update film
      const result = await this.databaseService.film.update({
        where: {
          id,
        },
        data: {
          ...data,
          cover_image_url: data.cover_image_url ?? film?.cover_image_url,
        },
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
          cover_image_url: true,
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
      const { cover_image_url, video_url, ...rest } = result;
      this.fileService.setStrategy(new DeleteFileStrategy());

      // Delete existing cover image
      if (cover_image_url) {
        await this.fileService.execute({ link: cover_image_url });
      }

      // Delete existing video
      if (video_url) {
        await this.fileService.execute({ link: video_url });
      }

      return {
        status: 'success',
        message: 'Film deleted successfully',
        data: rest,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: 'Film deletion failed',
        data: null,
      };
    }
  }

  async findOwnFilms(userId: string) {
    try {
      const result = await this.databaseService.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          films: {
            select: {
              film: true,
            },
          },
        },
      });

      if (!result) {
        return {
          status: 'error',
          message: 'User not found',
          data: null,
        };
      }

      const tempResult = result.films.map((film) => film.film);
      this.fileService.setStrategy(new GetFileStrategy());

      await Promise.all(
        tempResult.map(async (film) => {
          if (film.cover_image_url) {
            film.cover_image_url = await this.fileService.execute({
              link: film.cover_image_url,
            });
          } else {
            film.cover_image_url = '/images/default.png';
          }
        }),
      );

      // check if films exist
      if (!tempResult) {
        return {
          status: 'error',
          message: 'Films not found',
          data: null,
        };
      }

      return {
        status: 'success',
        message: 'Films retrieved successfully',
        data: tempResult,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Films retrieval failed',
        data: null,
      };
    }
  }

  async isFilmOwned(filmId: string, userId: string) {
    try {
      const result = await this.databaseService.boughtFilm.findUnique({
        where: {
          filmId_userId: {
            filmId,
            userId,
          },
        },
      });

      if (!result) {
        return {
          status: 'error',
          message: 'Failed to check if film is owned',
          data: false,
        };
      }

      return {
        status: 'success',
        message: 'Successfully checked if film is owned',
        data: true,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to check if film is owned',
        data: false,
      };
    }
  }

  async buyFilm(filmId: string, userId: string, userBalance: number) {
    try {
      const film = await this.findOne(filmId);
      const filmPrice = film.data?.price;

      if (!film || !filmPrice) {
        return {
          status: 'error',
          message: 'Film not found',
          data: null,
        };
      }

      if (userBalance < filmPrice) {
        return {
          status: 'error',
          message: 'Insufficient balance',
          data: null,
        };
      }

      const result = await this.databaseService.boughtFilm.create({
        data: {
          filmId,
          userId,
        },
      });

      if (!result) {
        return {
          status: 'error',
          message: 'Failed to buy film',
          data: null,
        };
      }

      await this.databaseService.user.update({
        where: {
          id: userId,
        },
        data: {
          balance: {
            decrement: filmPrice,
          },
        },
      });

      return {
        status: 'success',
        message: 'Successfully bought film',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to buy film',
        data: null,
      };
    }
  }
}
