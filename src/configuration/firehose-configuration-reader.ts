import { Firehose } from 'aws-sdk';
import {FirehoseConfiguration} from './configuration';

const SUPPORTED_COMPRESSION_FORMATS = [ 'UNCOMPRESSED', 'GZIP' ];

async function readConfiguration(client: Firehose, stream: string): Promise<FirehoseConfiguration> {
  const descriptionResult = await client.describeDeliveryStream({
    DeliveryStreamName: stream
  }).promise();

  const description = descriptionResult.DeliveryStreamDescription;
  const s3Destination = description.Destinations
      .find(destination => destination.ExtendedS3DestinationDescription);

  if (!s3Destination) {
    throw new Error('Unable to process streams that do not have an S3 destination configured');
  }

  const destinationDescription = s3Destination.ExtendedS3DestinationDescription!;
  if (!SUPPORTED_COMPRESSION_FORMATS.includes(destinationDescription.CompressionFormat)) {
    throw new Error(`Unsupported compression format ${destinationDescription.CompressionFormat}`);
  }

  return Object.freeze({
    name: description.DeliveryStreamName,
    s3Bucket: destinationDescription.BucketARN?.split(':').pop()!,
    s3Prefix: destinationDescription.Prefix,
    version: description.VersionId,
    compressed: destinationDescription.CompressionFormat !== 'UNCOMPRESSED'
  });
}

export type FirehoseConfigurationReader = (streamName: string) => Promise<FirehoseConfiguration>;
export default function (firehoseClient: Firehose): FirehoseConfigurationReader {
  return (streamName: string) => readConfiguration(firehoseClient, streamName);
}
