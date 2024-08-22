import { Module } from '@nestjs/common';
import { DatabaseService, DatabaseServiceFactory } from './database.service';

@Module({
  providers: [DatabaseService, DatabaseServiceFactory],
  exports: [DatabaseService, DatabaseServiceFactory],
})
export class DatabaseModule {}
