import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FilmsModule } from './api/films/films.module';
import { AuthModule } from './api/auth/auth.module';
import { FilmsService } from './api/films/films.service';

@Module({
  imports: [DatabaseModule, FilmsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, FilmsService],
})
export class AppModule {}
