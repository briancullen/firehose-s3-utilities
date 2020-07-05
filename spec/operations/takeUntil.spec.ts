import {ArrayStream} from './ArrayStream';
import takeUntil from '../../src/operations/takeUntil'

describe('Operations: Take Until', () => {
  const source = Array.from(new Array(100)).map((value, index) => ({key: index}));

  test('should allow all data through if predicate is always false', (done) => {
    const readableStream = new ArrayStream(source);
    const takeStream = takeUntil<{key: number}>(() => false)
    const resultStream = readableStream.pipe(takeStream);
    resultStream.on('data', data => expect(source.includes(data)).toEqual(true));
    resultStream.on('end', () => {
      expect.assertions(source.length);
      done();
    });
  });

  test('should block data once predicate is false', (done) => {
    const readableStream = new ArrayStream(source);
    const takeStream = takeUntil<{key: number}>(item => item.key === 40);

    const resultStream = readableStream.pipe(takeStream);
    resultStream.on('data', data => {
      expect(source.includes(data)).toEqual(true);
      expect(data.key).toBeLessThanOrEqual(50);
    });
    resultStream.on('end', () => {
      expect.assertions(80);
      done();
    });
  });
});
