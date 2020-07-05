import {Readable} from 'readable-stream';

export class ArrayStream<T extends object> extends Readable {
  private readonly source: T[];

  constructor(source: T[] = []) {
    super({ objectMode: true });

    this.source = [...source];
  }

  _read(): void {
    if (this.source.length > 0) {
      this.push(this.source.shift());
    } else {
      this.push(null);
    }
  }
}
