import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { DatabaseModule } from 'src/database/database.module';
import { FileService } from 'src/file/file.service';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    DatabaseModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [FilmsController],
  providers: [FilmsService, FileService],
})
export class FilmsModule {}
