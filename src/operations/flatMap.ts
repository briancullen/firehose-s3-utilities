import {Transform} from 'readable-stream';

export type FlatMapFunction<T, U> = (value: T) => U[];

class FlatMap<T extends object, U extends object> extends Transform {
  constructor(private readonly func: FlatMapFunction<T, U>) {
    super({ objectMode: true });
  }

  _transform(chunk: T, encoding: string, callback: (error?: Error, data?: U) => void): void {
    const mappedValues = this.func(chunk);
    mappedValues.forEach(value => this.push(value));
    callback();
  }
}

export default function flatMap<T extends object, U extends object>(func: FlatMapFunction<T, U>): Transform {
  return new FlatMap(func);
}
