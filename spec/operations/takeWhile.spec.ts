import {ArrayStream} from './ArrayStream';
import takeWhile from '../../src/operations/takeWhile'

describe('Operations: Take While', () => {
  const source = Array.from(new Array(100)).map((value, index) => ({key: index}));

  test('should allow all data through if predicate is true', (done) => {
    const readableStream = new ArrayStream(source);
    const takeStream = takeWhile<{key: number}>(() => true);

    const resultStream = readableStream.pipe(takeStream);
    resultStream.on('data', data => expect(source.includes(data)).toEqual(true));
    resultStream.on('end', () => {
      expect.assertions(source.length);
      done();
    });
  });

  test('should block data once predicate has been false', (done) => {
    const readableStream = new ArrayStream(source);
    const takeStream = takeWhile<{key: number}>(item => item.key !== 50);

    const resultStream = readableStream.pipe(takeStream);
    resultStream.on('data', data => {
      expect(source.includes(data)).toEqual(true);
      expect(data.key).toBeLessThan(50);
    });
    resultStream.on('end', () => {
      expect.assertions(100);
      done();
    });
  });
});
