import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}

@Injectable()
export class DatabaseServiceFactory {
  createUserDatabaseService() {
    const db = new DatabaseService();
    return db.user;
  }

  createFilmDatabaseService() {
    const db = new DatabaseService();
    return db.film;
  }

  createBoughtFilmDatabaseService() {
    const db = new DatabaseService();
    return db.boughtFilm;
  }
}
