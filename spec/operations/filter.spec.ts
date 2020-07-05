import {ArrayStream} from './ArrayStream';
import filter from '../../src/operations/filter'

describe('Operations: Filter', () => {
  const source = Array.from(new Array(100)).map((value, index) => ({key: index}));

  test('should allow data through', (done) => {
    const readableStream = new ArrayStream(source);
    const filterStream = filter(() => true);

    const filteredStream = readableStream.pipe(filterStream);
    filteredStream.on('data', data => expect(source.includes(data)).toEqual(true));
    filteredStream.on('end', () => {
      expect.assertions(source.length);
      done();
    });
  });

  test('should block data', (done) => {
    const readableStream = new ArrayStream(source);
    const filterStream = filter(() => false);

    const filteredStream = readableStream.pipe(filterStream);
    filteredStream.on('data', () => fail());
    filteredStream.on('end', () => {
      expect.assertions(0);
      done();
    });
  });

  test('should filter data properly', (done) => {
    const readableStream = new ArrayStream(source);
    const filterStream = filter<{ key: number }>(data => data.key % 2 === 0);

    const filteredStream = readableStream.pipe(filterStream);
    filteredStream.on('data', data => expect(data.key % 2).toEqual(0));
    filteredStream.on('end', () => {
      expect.assertions(Math.floor(source.length / 2));
      done();
    });
  });
});
