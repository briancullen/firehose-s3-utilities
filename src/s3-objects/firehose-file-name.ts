import moment, {Moment} from 'moment';

export interface FirehoseFileName {
  prefix?: string;
  streamName: string;
  version: string;
  timestamp: Moment;
  uid: string;
}

export function parse(prefix: string | undefined, streamName: string, key: string): FirehoseFileName {
  const [_, suffix] = key.split(`/${streamName}-`);
  if (suffix === undefined) {
    throw new Error('Undefined Suffix');
  }

  const matches = suffix.match(/(?<version>\d+)-(?<dateTime>\d+-\d+-\d+-\d+-\d+-\d+)-(?<uid>.+)/);

  if (!matches || !matches.groups || !matches.groups['dateTime']
      || !matches.groups['version'] || !matches.groups['uid']) {
    throw new Error('Unable to parse the filehose file naem');
  }

  const { dateTime, version, uid } = matches.groups;
  const timestamp = moment(dateTime, 'YYYY-MM-DD-HH-mm-ss');

  return {
    prefix,
    streamName,
    version,
    timestamp,
    uid
  }
}
