import {firehoseConfigurationReaderFactory} from './configuration';
import Firehose from 'aws-sdk/clients/firehose';
import {FindObjectsDefaultImpl} from './s3-objects/find-objects';
import S3 from 'aws-sdk/clients/s3';
import moment from 'moment';
import ObjectStreamPipeline from './ObjectStreamPipeline';

const client = new Firehose();
const configurationReader = firehoseConfigurationReaderFactory(client)
configurationReader('stream-name')
    .then(configuration => {
      const findObjects = new FindObjectsDefaultImpl(new S3(), configuration);
      const start = moment('2020-05-07T15:25:00.000');
      return findObjects.findObjectsSince(start);
    })
    .then(objects => console.log(objects));

interface WhatEver {
  id: string;
  data: number;
}

const stream = new ObjectStreamPipeline<WhatEver>([] as any)
    .filter(value => value.data === 1)
    .map(value => ({ num: value.data }))
    .flatMap(value => [ { result: value.num + 1 }]);

// readStreamArchive('nameoffirehose', dateRange?)
//     .decompress()
//     .asJson()
//     .asObjects()
//     .filter(() => true)
//     .map()
//     .asJsonArray({ chunk: 500 })
//     .asJsonArrayString()
//     .take()
//     .while()
//     .until()
//     .toFile()
//     .toKinesis(partitionKeyFunction);
