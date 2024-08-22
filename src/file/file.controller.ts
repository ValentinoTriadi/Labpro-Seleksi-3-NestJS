import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileStrategy } from './strategy/upload.strategy';
import { GetFileStrategy } from './strategy/get.strategy';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const buffer = file?.buffer;
    const id = file?.originalname;
    const type = file.mimetype;
    this.fileService.setStrategy(new UploadFileStrategy());
    const link = await this.fileService.execute({
      file: buffer!,
      id,
      type,
    });
    return link;
  }

  @Get('show')
  async showFile(@Query('link') link: string) {
    this.fileService.setStrategy(new GetFileStrategy());
    const file = await this.fileService.execute({ link });
    return { file: file };
  }
}
