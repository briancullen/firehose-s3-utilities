import {Transform} from 'readable-stream';

class Chunk<T extends object> extends Transform {
  private currentGroup: T[] = [];

  constructor(private readonly chunkSize: number) {
    super({ objectMode: true });

    if (chunkSize < 2) {
      throw new Error('Chunk size must be greater than one');
    }
  }

  _transform(chunk: T, encoding: string, callback: (error?: Error, data?: T[]) => void): void {
    this.currentGroup.push(chunk);
    if (this.currentGroup.length === this.chunkSize) {
      this.push(this.currentGroup);
      this.currentGroup = [];
    }

    callback();
  }

  _flush(callback: (error?: Error, data?: any) => void) {
    if (this.currentGroup.length > 0) {
      this.push(this.currentGroup);
    }

    callback();
  }
}

export default function chunk<T extends object>(chunkSize: number): Transform {
  return new Chunk(chunkSize);
}
