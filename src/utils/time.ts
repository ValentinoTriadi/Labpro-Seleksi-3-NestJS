export class TimeParser {
  private static instance: TimeParser | null;

  private constructor() {}

  public static getInstance(): TimeParser {
    if (!this.instance) {
      this.instance = new TimeParser();
    }
    return this.instance;
  }

  public secToString(sec: number): string {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec - hours * 3600) / 60);
    const seconds = sec - hours * 3600 - minutes * 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
