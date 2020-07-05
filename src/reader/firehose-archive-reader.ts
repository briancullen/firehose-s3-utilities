import { Readable } from 'readable-stream';
import S3, { Object } from 'aws-sdk/clients/s3';

import ReadableStream = NodeJS.ReadableStream;

export default class FirehoseArchiveReader extends Readable {
  private s3Stream: ReadableStream;

  constructor(private readonly s3Client: S3,
    private readonly bucket: string,
    private readonly dataFiles: Object[]) {
    super();

    if (dataFiles.length === 0) {
      throw new Error('No data files specified');
    }

    this.s3Stream = this.setupStream();
  }

  private setupStream(): ReadableStream {
    const key = this.dataFiles.pop()!.Key!;
    const newStream = this.s3Client.getObject({
      Bucket: this.bucket,
      Key: key,
    }).createReadStream();

    newStream.pause();
    newStream.on('data', (chunk) => {
      if (!this.push(chunk)) {
        newStream.pause();
      }
    });

    newStream.on('end', () => {
      if (this.dataFiles.length === 0) {
        this.push(null);
        return;
      }

      this.s3Stream = this.setupStream();
      this.s3Stream.resume();
    });

    return newStream;
  }

  _read(): void {
    this.s3Stream?.resume();
  }
}
