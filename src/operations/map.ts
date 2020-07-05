import {Transform} from 'readable-stream';

export type MapFunction<T, U> = (value: T) => U;

class Map<T extends object, U extends object> extends Transform {
  constructor(private readonly func: MapFunction<T, U>) {
    super({ objectMode: true });
  }

  _transform(chunk: T, encoding: string, callback: (error?: Error, data?: U) => void): void {
    callback(undefined, this.func(chunk))
  }
}

export default function map<T extends object, U extends object>(func: MapFunction<T, U>): Transform {
  return new Map(func);
}
