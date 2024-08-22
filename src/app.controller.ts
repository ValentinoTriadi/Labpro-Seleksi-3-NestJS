import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './api/auth/guards/authenticated.guard';
import { AuthExceptionFilter } from './api/auth/filters/auth-exceptions.filter';
import { PageFilmDto } from './api/films/dto/page-film.dto';
import { TimeParser } from './utils/time';

@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {
  private loc = process.env.BASE_URL || 'http://localhost:3000';
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root(
    @Res() response: Response,
    @Req() request: Request & { cookies: { jwt: string } },
  ) {
    return { ...request.user, loggedIn: !!request.user, message: 'Home' };
  }

  @Get('register')
  @Render('register')
  register() {
    return { message: 'Register' };
  }

  @Post('register')
  registerPost(@Req() request: Request, @Res() res: Response) {
    this.appService.registerUser(request.body).then((response) => {
      if (response.status === 'success') {
        res.redirect('/login');
      } else {
        return res.render('register', {
          message: response.message,
          status: 'error',
          ...request.body,
        });
      }
    });
  }

  @Get('login')
  @Render('login')
  login() {
    return { message: 'Login' };
  }

  @Post('login')
  loginPost(@Req() request: Request, @Res() res: Response) {
    fetch(this.loc + '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success' && data.data) {
          res.cookie('jwt', data.data.token, { httpOnly: true });
          res.redirect('/dashboard');
        } else {
          return res.render('login', {
            message: data.message,
            status: 'error',
            ...request.body,
          });
        }
      });
  }

  @Get('dashboard')
  @Render('dashboard')
  @UseGuards(AuthenticatedGuard)
  async dashboard(
    @Res() response: Response,
    @Req() request: Request & { cookies: { jwt: string } },
  ) {
    if (!request.user) {
      response.redirect('/login');
    }
    // @ts-expect-error because we know that user is not null
    const { id } = request.user;
    const films = await this.appService.getOwnedFilms(id);
    const balance = await this.appService.getUserBalance(id);
    return {
      ...request.user,
      balance,
      loggedIn: !!request.user,
      films: films.data,
    };
  }

  @Get('films')
  @Render('films')
  async films(
    @Res() response: Response,
    @Req() request: Request & { cookies: { jwt: string } },
    @Query() pageDto: PageFilmDto,
    @Query('q') q?: string,
  ) {
    const films = await this.appService.getAllFilms(pageDto, q);

    films.data?.films.forEach((film) => {
      // @ts-expect-error because we know that film doesn't have durationString
      film.durationString = TimeParser.getInstance().secToString(film.duration);
    });

    return {
      ...request.user,
      loggedIn: !!request.user,
      message: 'Film',
      ...films.data,
      q,
    };
  }

  @Get('films/:id')
  @Render('filmdetail')
  async filmDetail(
    @Res() response: Response,
    @Req() request: Request & { cookies: { jwt: string } },
    @Param('id') id: string,
    @Query('mode') mode?: string,
  ) {
    const film = await this.appService.getFilmById(id);
    if (!film.data) {
      response.redirect('/films');
    }

    let owned = { data: false };
    let userBalance = 0;
    if (request.user) {
      // @ts-expect-error because we know that user is not null
      const { id: userId } = request.user;
      owned = await this.appService.isFilmOwned(id, userId);

      userBalance = await this.appService.getUserBalance(userId);
    }

    const isAffordable = userBalance >= film.data!.price;

    return {
      ...request.user,
      loggedIn: !!request.user,
      message: 'Film Details',
      ...film.data,
      release_year: film.data?.release_year.toString(),
      owned: owned.data,
      watch: mode === 'watch' && owned.data,
      isAffordable,
    };
  }

  @Post('films/:id/buy')
  async buyFilm(
    @Res() response: Response,
    @Req() request: Request & { cookies: { jwt: string } },
    @Param('id') id: string,
  ) {
    if (!request.user) {
      response.redirect('/login');
    }
    // @ts-expect-error because we know that user is not null
    const { id: userId } = request.user;
    const res = await this.appService.buyFilm(id, userId);
    console.log(res);
    return res;
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await req.logout((err) => {
      if (err) {
        throw err;
      }
    });
    res.clearCookie('jwt');
    res.redirect('/');
  }
}
