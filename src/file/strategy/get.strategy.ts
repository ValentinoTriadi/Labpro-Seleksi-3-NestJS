// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class GetFileStrategy implements FileStrategy {
  private readonly domain: string;

  constructor() {
    this.domain = process.env.S3_API ?? '';
  }

  execute(data: any) {
    const { link } = data;

    try {
      return this.domain + '/' + link;
    } catch (error) {
      console.error(error);
      return '/images/default.png';
    }
  }
}
