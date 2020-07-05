import ReadableStream = NodeJS.ReadableStream;

export interface ObjectStream<T extends object> {

  // Transform operations
  filter: (predicate: (value: T) => boolean) => ObjectStream<T>;
  map: <U extends object>(func: (value: T) => U) => ObjectStream<U>;
  flatMap: <U extends object>(func: (value: T) => U[]) => ObjectStream<U>;
  take: (limit: number) => ObjectStream<T>;
  takeWhile: (predicate: (value: T) => boolean) => ObjectStream<T>;
  takeUntil: (predicate: (value: T) => boolean) => ObjectStream<T>;
  skip: (count: number) => ObjectStream<T>;
  skipWhile: (predicate: (value: T) => boolean) => ObjectStream<T>;
  skipUntil: (predicate: (value: T) => boolean) => ObjectStream<T>;
  chunk: (size: number) => ObjectStream<T[]>;


  toJson: () => ReadableStream;

  // Terminal Operations
  // toFile(): void;
  // toKinesisStream(): void;
}
