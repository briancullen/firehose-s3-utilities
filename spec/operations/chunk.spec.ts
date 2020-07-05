import {ArrayStream} from './ArrayStream';
import chunk from '../../src/operations/chunk'

describe('Operations: Chunk', () => {
  const source = Array.from(new Array(100)).map((value, index) => ({key: index}));

  test('should fail if size is less than 2', () => {
    expect(() => chunk(1)).toThrowError('');
  });

  test('should chunk data properly', (done) => {
    const chunkSize = 25;
    const readableStream = new ArrayStream(source);
    const filterStream = chunk<{ key: number }>(chunkSize);

    const filteredStream = readableStream.pipe(filterStream);
    filteredStream.on('data', data => {
      expect(data).toHaveLength(chunkSize);
    });
    filteredStream.on('end', () => {
      expect.assertions(Math.ceil(source.length / chunkSize));
      done();
    });
  });

  test('should chunk last piece of data even if chunk not full', (done) => {
    const chunkSize = 33;
    const readableStream = new ArrayStream(source);
    const filterStream = chunk<{ key: number }>(chunkSize);

    let chunkCount = 1;
    const numberOfChunks = Math.ceil(source.length / chunkSize);
    const filteredStream = readableStream.pipe(filterStream);
    filteredStream.on('data', data => {
      if (chunkCount !== numberOfChunks) {
        expect(data).toHaveLength(chunkSize);
      } else {
        expect(data).toHaveLength(source.length % chunkSize);
      }

      chunkCount++;
    });
    filteredStream.on('end', () => {
      expect.assertions(numberOfChunks);
      done();
    });
  });
});
