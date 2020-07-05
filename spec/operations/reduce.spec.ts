import {ArrayStream} from './ArrayStream';
import reduce from '../../src/operations/reduce'

describe('Operations: Reduce', () => {
  const source = Array.from(new Array(100)).map((value, index) => ({key: index}));

  test('should reduce data', (done) => {
    const readableStream = new ArrayStream(source);
    const mapStream = reduce<{key: number}, { result: number }>(
        (acc, item) => ({ result: acc.result + item.key }), { result: 0 }
    );

    const resultStream = readableStream.pipe(mapStream);
    resultStream.on('data', data => expect(data.result).toEqual(4950));
    resultStream.on('end', () => {
      expect.assertions(1);
      done();
    });
  });
});
