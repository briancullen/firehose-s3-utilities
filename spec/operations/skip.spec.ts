import {ArrayStream} from './ArrayStream';
import skip from '../../src/operations/skip'

describe('Operations: Skip', () => {
  const source = Array.from(new Array(100)).map((value, index) => ({key: index}));

  test('should not allow data through if count greater than data', (done) => {
    const readableStream = new ArrayStream(source);
    const takeStream = skip(source.length + 1);

    const resultStream = readableStream.pipe(takeStream);
    resultStream.on('data', () => fail());
    resultStream.on('end', () => {
      expect.assertions(0);
      done();
    });
  });

  test('should allow data if data greater than count', (done) => {
    const readableStream = new ArrayStream(source);
    const takeStream = skip(2);

    const resultStream = readableStream.pipe(takeStream);
    resultStream.on('data', data => expect(source.includes(data)).toEqual(true));
    resultStream.on('end', () => {
      expect.assertions(source.length - 2);
      done();
    });
  });
});
