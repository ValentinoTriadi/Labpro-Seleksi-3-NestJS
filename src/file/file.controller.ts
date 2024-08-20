import {
  Controller,
  Get,
  Post,
  Query,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const buffer = file?.buffer;
    const id = file?.originalname;
    const type = file.mimetype;
    const link = await this.fileService.uploadFile(buffer!, id!, type);
    return link;
  }

  @Get('show')
  @Render('show')
  async showFile(@Query('link') link: string) {
    const file = await this.fileService.getFile(link);
    return { file: file };
  }
}
