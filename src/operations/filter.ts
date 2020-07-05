import {Transform} from 'readable-stream';

export type FilterPredicate<T> = (value: T) => boolean;

class Filter<T extends object> extends Transform {
  constructor(private readonly predicate: FilterPredicate<T>) {
    super({ objectMode: true });
  }

  _transform(chunk: T, encoding: string, callback: (error?: Error, data?: T) => void): void {
    if (this.predicate(chunk)) {
      callback(undefined, chunk);
    } else {
      callback();
    }
  }
}

export default function filter<T extends object>(predicate: FilterPredicate<T>): Transform {
  return new Filter(predicate);
}
