import {Transform} from 'readable-stream';

export type ReduceFunction<T, U> = (accumulator: U, value: T) => U;

class Reduce<T extends object, U extends object> extends Transform {
  private accumulator: U;

  constructor(private readonly func: ReduceFunction<T, U>, initialValue: U) {
    super({ objectMode: true });
    this.accumulator = initialValue;
  }

  _transform(chunk: T, encoding: string, callback: (error?: Error, data?: U) => void): void {
    this.accumulator = this.func(this.accumulator, chunk);
    callback();
  }

  _flush(callback: (error?: Error, data?: any) => void) {
    callback(undefined, this.accumulator);
  }
}

export default function reduce<T extends object, U extends object>(
    func: ReduceFunction<T, U>, initialValue: U
): Transform {
  return new Reduce(func, initialValue);
}
