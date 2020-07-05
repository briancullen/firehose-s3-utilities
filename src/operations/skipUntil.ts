import {Transform} from 'readable-stream';
import skipWhile from './skipWhile';

export type SkipUntilPredicate<T> = (value: T) => boolean;

export default function skipUntil<T extends object>(predicate: SkipUntilPredicate<T>): Transform {
  return skipWhile<T>((value) => !predicate(value));
}
