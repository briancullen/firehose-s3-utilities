export interface FirehoseConfiguration {
  name: string;

  s3Bucket: string;
  s3Prefix?: string;

  version: string;
  compressed: boolean;
}
