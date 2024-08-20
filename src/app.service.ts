import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { RegisterDto } from './user/dto/user.dto';
import { LoginDto } from './api/auth/dto/auth.dto';
import { AuthService } from './api/auth/auth.service';
import { FilmsService } from './api/films/films.service';
import { PageFilmDto } from './api/films/dto/page-film.dto';

@Injectable()
export class AppService {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private filmService: FilmsService,
  ) {}

  async registerUser(data: RegisterDto) {
    return await this.userService.register(data);
  }

  async loginUser(data: LoginDto) {
    return await this.authService.login(data);
  }

  self(token: string) {
    return this.authService.selfInfo(token);
  }

  async getAllFilms(pageDto: PageFilmDto, q?: string) {
    return await this.filmService.findPage(pageDto, q);
  }

  async getFilmById(id: string) {
    return await this.filmService.findOne(id);
  }

  async getOwnedFilms(id: string) {
    return await this.filmService.findOwnFilms(id);
  }

  async isFilmOwned(filmId: string, userId: string) {
    return await this.filmService.isFilmOwned(filmId, userId);
  }

  async buyFilm(filmId: string, userId: string) {
    const userBalance = await this.userService.getUserBalance(userId);
    return await this.filmService.buyFilm(filmId, userId, userBalance);
  }

  async getUserBalance(id: string) {
    return await this.userService.getUserBalance(id);
  }
}
