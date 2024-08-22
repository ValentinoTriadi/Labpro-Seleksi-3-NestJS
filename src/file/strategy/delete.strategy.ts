import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class DeleteFileStrategy implements FileStrategy {
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
    const { link } = data;

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
