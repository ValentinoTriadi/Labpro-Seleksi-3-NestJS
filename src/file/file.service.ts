import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class FileService {
  private s3Client: S3Client;
  private readonly domain: string;

  constructor() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.S3_ENDPOINT ?? '',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
      },
    });
    this.domain = process.env.S3_API ?? '';
  }

  async uploadFile(file: Buffer, id: string, type: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: 'nelfix-bucket',
      Key: type + '/' + id,
      Body: file,
    });

    try {
      const response = await this.s3Client.send(command);
      if (response.$metadata.httpStatusCode === 200) {
        return type + '/' + id;
      }
      return type + '/' + id;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  getFile(link: string): string {
    try {
      return this.domain + '/' + link;
    } catch (error) {
      console.error(error);
      return '/images/default.png';
    }
  }

  async deleteFile(link: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: 'nelfix-bucket',
        Key: link,
      });
      const response = await this.s3Client.send(command);
      if (response.$metadata.httpStatusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
