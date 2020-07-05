import {Transform} from 'readable-stream';

export type SkipWhilePredicate<T> = (value: T) => boolean;

class SkipWhile<T extends object> extends Transform {
  private skippingValues: boolean = true;

  constructor(private readonly predicate: SkipWhilePredicate<T>) {
    super({ objectMode: true });
  }

  _transform(chunk: T, encoding: string, callback: (error?: Error, data?: T) => void): void {
    if (this.skippingValues) {
      if (this.predicate(chunk)) {
        return callback();
      }

      this.skippingValues = false;
    }

    callback(undefined, chunk);
  }
}

export default function skipWhile<T extends object>(predicate: SkipWhilePredicate<T>): Transform {
  return new SkipWhile(predicate);
}
