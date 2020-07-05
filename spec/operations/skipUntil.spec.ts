import {ArrayStream} from './ArrayStream';
import skipUntil from '../../src/operations/skipUntil'

describe('Operations: Skip Until', () => {
  const source = Array.from(new Array(100)).map((value, index) => ({key: index}));

  test('should allow all data through if skip predicate is always true', (done) => {
    const readableStream = new ArrayStream(source);
    const takeStream = skipUntil<{key: number}>(() => true);

    const resultStream = readableStream.pipe(takeStream);
    resultStream.on('data', data => expect(source.includes(data)).toEqual(true));
    resultStream.on('end', () => {
      expect.assertions(source.length);
      done();
    });
  });

  test('should allow no data through if skip predicate is always false', (done) => {
    const readableStream = new ArrayStream(source);
    const takeStream = skipUntil<{key: number}>(() => false);

    const resultStream = readableStream.pipe(takeStream);
    resultStream.on('data', () => fail());
    resultStream.on('end', () => {
      expect.assertions(0);
      done();
    });
  });

  test('should block data until skip predicate is true', (done) => {
    const readableStream = new ArrayStream(source);
    const takeStream = skipUntil<{key: number}>(item => item.key >= 30);

    const resultStream = readableStream.pipe(takeStream);
    resultStream.on('data', data => {
      expect(source.includes(data)).toEqual(true);
      expect(data.key).toBeGreaterThanOrEqual(30);
    });
    resultStream.on('end', () => {
      expect.assertions(140);
      done();
    });
  });
});
