import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class UploadFileStrategy implements FileStrategy {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.S3_ENDPOINT ?? '',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
      },
    });
  }

  async execute(data: any) {
    const { file, id, type } = data;

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
      return '';
    }
  }
}
