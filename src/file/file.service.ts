import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService implements FileStrategy {
  private strategy: FileStrategy;

  setStrategy(strategy: FileStrategy) {
    this.strategy = strategy;
  }

  execute(data: any) {
    return this.strategy.execute(data);
  }
}
