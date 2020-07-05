import {Transform} from 'readable-stream';

export type TakeWhilePredicate<T> = (value: T) => boolean;

class TakeWhile<T extends object> extends Transform {
  private taking: boolean = true;

  constructor(private readonly predicate: TakeWhilePredicate<T>) {
    super({ objectMode: true, allowHalfOpen: false });
  }

  _transform(chunk: T, encoding: string, callback: (error?: Error, data?: T) => void): void {
    if(this.taking) {
      if (this.predicate(chunk)) {
        this.push(chunk);
      } else {
        this.taking = false;
        this.push(null);
      }
    }

    callback();
  }
}

export default function takeWhile<T extends object>(predicate: TakeWhilePredicate<T>): Transform {
  return new TakeWhile(predicate);
}
