import {Transform} from 'readable-stream';

class Take<T extends object> extends Transform {
  constructor(private limit: number) {
    super({ objectMode: true, allowHalfOpen: false });
  }

  _transform(chunk: T, encoding: string, callback: (error?: Error, data?: T) => void): void {
    if (this.limit > 0) {
      callback(undefined, chunk);

      this.limit --;
      if (this.limit === 0) {
        this.push(null);
      }
    }
  }
}

export default function take<T extends object, U extends object>(limit: number): Transform {
  return new Take(limit);
}
