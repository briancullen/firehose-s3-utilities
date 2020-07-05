import {ArrayStream} from './ArrayStream';
import flatMap from '../../src/operations/flatMap'

describe('Operations: FlatMap', () => {
  const source = Array.from(new Array(100)).map((value, index) => ({key: index}));

  test('should flat map data', (done) => {
    const readableStream = new ArrayStream(source);
    const flatMapStream = flatMap<{key: number}, {oldValue: {key: number}}>(
        item => [{ oldValue: item }, {oldValue: item}]
    );

    const resultStream = readableStream.pipe(flatMapStream);
    resultStream.on('data', data => expect(source.includes(data.oldValue)).toEqual(true));
    resultStream.on('end', () => {
      expect.assertions(source.length * 2);
      done();
    });
  });
});
