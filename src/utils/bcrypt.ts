import * as bcrypt from 'bcryptjs';

export class Bcrypt {
  private static instance: Bcrypt | null;

  private constructor() {}

  public static getInstance(): Bcrypt {
    if (!this.instance) {
      this.instance = new Bcrypt();
    }
    return this.instance;
  }

  public encode(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  public compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
