import moment, {Moment} from 'moment';
import {S3} from 'aws-sdk';
import {parse} from './firehose-file-name';
import {ListObjectsV2Output, Object} from 'aws-sdk/clients/s3';
import {FirehoseConfiguration} from '../configuration';

export interface FindObjects {
  findObjectsSince(start: Moment): Promise<Object[]>;
  findObjectsInRange(start: Moment, end: Moment): Promise<Object[]>;
}

export class FindObjectsDefaultImpl implements FindObjects {
  private readonly s3Prefix: string | undefined;
  private readonly version: string;
  private readonly streamName: string;
  private readonly bucketArn: string;

  constructor(private readonly s3Client: S3, configuration: FirehoseConfiguration) {
    this.s3Prefix = configuration.s3Prefix;
    this.version = configuration.version;
    this.streamName = configuration.name;
    this.bucketArn = configuration.s3Bucket;
  }

  async findObjectsSince(start: Moment): Promise<Object[]> {
    return this.findObjectsInRange(start, moment().add(1, 'hour'));
  }

  async findObjectsInRange(start: Moment, end: Moment): Promise<Object[]> {
    const adjustedStart = start.clone().utc();
    const adjustedEnd = end.clone().utc();

    const startKey = `${this.s3Prefix ? `${this.s3Prefix}/` : ''}${adjustedStart.format('YYYY/MM/DD/HH')}`
        + `/${this.streamName}-${this.version}-${adjustedStart.format('YYYY-MM-DD-HH-mm-ss')}`;

    const contents: Object[] = [];
    let continuationToken: string | undefined = undefined;

    do {
      const response: ListObjectsV2Output = await this.s3Client.listObjectsV2({
        Bucket: this.bucketArn,
        Prefix: this.s3Prefix,
        StartAfter: startKey,
        ContinuationToken: continuationToken
      }).promise();

      const [reachedEnd, filteredObjects] = this.processObjects(adjustedEnd, response.Contents);
      contents.push(...filteredObjects);

      continuationToken = reachedEnd ? undefined : response.NextContinuationToken;
    } while (continuationToken);
    return contents;
  }

  private processObjects(end: Moment, s3Objects: Object[] | undefined): [ boolean, Object[] ] {
    if (s3Objects === undefined || s3Objects.length === 0) {
      return [false, []];
    }

    const lastObject = s3Objects[s3Objects.length - 1];
    const lastFile = parse(this.s3Prefix, this.streamName, lastObject.Key!);
    if (lastFile.timestamp.isBefore(end)) {
      return [false, s3Objects];
    }

    return [true, s3Objects.filter(s3Object => {
      const file = parse(this.s3Prefix, this.streamName, s3Object.Key!)
      return file.timestamp.isSameOrBefore(end);
    })];
  }
}
