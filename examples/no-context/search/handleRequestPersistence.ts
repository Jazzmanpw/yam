import { HandlerArg } from '../../..';
import { getSearch } from './state';
import { State } from '../store';
import { serializeSearch } from '../utils';

export default function handleRequestPersistence({
  state,
  stateChangedBy,
}: HandlerArg<State>) {
  if (stateChangedBy(getSearch)) {
    window.location.search = serializeSearch(getSearch(state));
  }
}
