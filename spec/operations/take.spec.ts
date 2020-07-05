import {ArrayStream} from './ArrayStream';
import take from '../../src/operations/take'

describe('Operations: Take', () => {
  const source = Array.from(new Array(100)).map((value, index) => ({key: index}));

  test('should allow all data through if limit greater than data', (done) => {
    const readableStream = new ArrayStream(source);
    const takeStream = take(source.length + 1);

    const resultStream = readableStream.pipe(takeStream);
    resultStream.on('data', data => expect(source.includes(data)).toEqual(true));
    resultStream.on('end', () => {
      expect.assertions(source.length);
      done();
    });
  });

  test('should block data if once limit has been reached', (done) => {
    const readableStream = new ArrayStream(source);
    const takeStream = take(2);

    const resultStream = readableStream.pipe(takeStream);
    resultStream.on('data', data => expect(source.includes(data)).toEqual(true));
    resultStream.on('end', () => {
      expect.assertions(2);
      done();
    });
  });
});
