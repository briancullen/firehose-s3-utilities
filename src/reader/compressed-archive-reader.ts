import S3, { Object } from 'aws-sdk/clients/s3';
import ReadableStream = NodeJS.ReadableStream;
import {pipeline} from 'stream';
import FirehoseArchiveReader from './firehose-archive-reader';
import {createGunzip, createUnzip} from 'zlib';
import {CompressionFormat} from 'aws-sdk/clients/firehose';
import ReadWriteStream = NodeJS.ReadWriteStream;

function getDecompressionStream(format: CompressionFormat): ReadWriteStream {
  switch(format) {
    case 'GZIP':
      return createGunzip();
    case 'ZIP':
      return createUnzip();
    default:
      throw new Error(`Unsupported compression format ${format}`);
  }
}


export default function(s3client: S3,
                        bucket: string,
                        dataFiles: Object[],
                        format: CompressionFormat = 'UNCOMPRESSED'): ReadableStream {
  const reader = new FirehoseArchiveReader(s3client, bucket, dataFiles);
  if (format === 'UNCOMPRESSED') {
    return reader;
  }

  return pipeline(reader, getDecompressionStream(format));
}
