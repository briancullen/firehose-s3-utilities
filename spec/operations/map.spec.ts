import {ArrayStream} from './ArrayStream';
import map from '../../src/operations/map'

describe('Operations: Map', () => {
  const source = Array.from(new Array(100)).map((value, index) => ({key: index}));

  test('should map data', (done) => {
    const readableStream = new ArrayStream(source);
    const mapStream = map<{key: number}, {oldValue: {key: number}}>(
        item => ({ oldValue: item })
    );

    const resultStream = readableStream.pipe(mapStream);
    resultStream.on('data', data => expect(source.includes(data.oldValue)).toEqual(true));
    resultStream.on('end', () => {
      expect.assertions(source.length);
      done();
    });
  });
});
