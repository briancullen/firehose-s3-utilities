import {Transform} from 'readable-stream';
import takeWhile from './takeWhile';

export type TakeUntilPredicate<T> = (value: T) => boolean;

export default function takeUntil<T extends object>(predicate: TakeUntilPredicate<T>): Transform {
  return takeWhile<T>((value) => !predicate(value));
}
