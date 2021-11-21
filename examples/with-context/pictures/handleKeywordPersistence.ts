import type { HandlerArg } from '../../..';
import type { State, YamContext } from '../store';
import { serializeKeyword } from '../utils';
import { selectKeyword } from './state';

export default function handleKeywordPersistence({
  select,
  stateChangedBy,
}: HandlerArg<State, YamContext>) {
  if (stateChangedBy(selectKeyword)) {
    window.location.search = serializeKeyword(select(selectKeyword));
  }
}
