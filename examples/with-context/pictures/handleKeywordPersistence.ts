import type { HandlerArg } from '../../../build/types';
import type { State, YamContext } from '../store';
import { serializeKeyword } from '../utils';
import { getKeyword } from './state';

export default function handleKeywordPersistence({
  state,
  stateChangedBy,
}: HandlerArg<State, YamContext>) {
  if (stateChangedBy(getKeyword)) {
    window.location.search = serializeKeyword(getKeyword(state));
  }
}
