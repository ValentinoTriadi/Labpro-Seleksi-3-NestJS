import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { AdminOnlyGuard } from '../auth/guards/admin-only.guard';

@Controller('api/films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @UseGuards(AdminOnlyGuard)
  @FormDataRequest({ storage: MemoryStoredFile })
  create(@Body() createFilmDto: CreateFilmDto) {
    if (typeof createFilmDto.genre === 'string') {
      // @ts-expect-error The received body is not a list.
      createFilmDto.genre = createFilmDto.genre.split(',');
    }

    // @ts-expect-error The received body is not a buffer.
    createFilmDto.cover_image = createFilmDto.cover_image?.buffer ?? null;
    // @ts-expect-error The received body is not a buffer.
    createFilmDto.video = createFilmDto.video?.buffer ?? null;
    return this.filmsService.create(createFilmDto);
  }

  @Get()
  @UseGuards(AdminOnlyGuard)
  findAll(@Query('q') q?: string) {
    return this.filmsService.findAll(q);
  }

  @Get(':id')
  @UseGuards(AdminOnlyGuard)
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @FormDataRequest({ storage: MemoryStoredFile })
  update(@Param('id') id: string, @Body() updateFilmDto: UpdateFilmDto) {
    if (typeof updateFilmDto.genre === 'string') {
      // @ts-expect-error The received body is not a list.
      updateFilmDto.genre = updateFilmDto.genre.split(',');
    }

    // @ts-expect-error The received body is not a buffer.
    updateFilmDto.cover_image = updateFilmDto.cover_image?.buffer ?? null;
    // @ts-expect-error The received body is not a buffer.
    updateFilmDto.video = updateFilmDto.video?.buffer ?? null;
    return this.filmsService.update(id, updateFilmDto);
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  remove(@Param('id') id: string) {
    return this.filmsService.remove(id);
  }
}
