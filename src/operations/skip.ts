import {Transform} from 'readable-stream';

class Skip<T extends object> extends Transform {
  constructor(private count: number) {
    super({ objectMode: true });
  }

  _transform(chunk: T, encoding: string, callback: (error?: Error, data?: T) => void): void {
    if (this.count > 0) {
      this.count--;
      callback();
    } else {
      callback(undefined, chunk);
    }
  }
}

export default function skip<T extends object, U extends object>(count: number): Transform {
  return new Skip(count);
}
