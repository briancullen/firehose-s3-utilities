import {ObjectStream} from './ObjectStream';
import ReadableStream = NodeJS.ReadableStream;
import ReadWriteStream = NodeJS.ReadWriteStream;
import chunk from './operations/chunk';
import filter from './operations/filter';
import map from './operations/map';

export default class ObjectStreamPipeline<T extends object> implements ObjectStream<T> {

  private readonly pipelineStages: (ReadableStream | ReadWriteStream)[];

  constructor(...pipelineStages: (ReadableStream | ReadWriteStream)[]) {
    this.pipelineStages = pipelineStages ?? [];
  }

  chunk(size: number): ObjectStream<T[]> {
    return new ObjectStreamPipeline(...this.pipelineStages, chunk(size));
  }

  filter(predicate: (value: T) => boolean): ObjectStream<T> {
    return new ObjectStreamPipeline(...this.pipelineStages, filter<T>(predicate));
  }

  flatMap<U extends object>(func: (value: T) => U[]): ObjectStream<U> {
    return undefined;
  }

  map<U extends object>(func: (value: T) => U): ObjectStream<U> {
    return new ObjectStreamPipeline(...this.pipelineStages, map(func));
  }

  skip(count: number): ObjectStream<T> {
    return undefined;
  }

  skipUntil(predicate: (value: T) => boolean): ObjectStream<T> {
    return undefined;
  }

  skipWhile(predicate: (value: T) => boolean): ObjectStream<T> {
    return undefined;
  }

  take(limit: number): ObjectStream<T> {
    return undefined;
  }

  takeUntil(predicate: (value: T) => boolean): ObjectStream<T> {
    return undefined;
  }

  takeWhile(predicate: (value: T) => boolean): ObjectStream<T> {
    return undefined;
  }

  toJson(): NodeJS.ReadableStream {
    return undefined;
  }

}
