import { HandlerArg } from '../../..';
import { selectSearch } from './state';
import { State } from '../store';
import { serializeSearch } from '../utils';

export default function handleRequestPersistence({
  select,
  stateChangedBy,
}: HandlerArg<State>) {
  if (stateChangedBy(selectSearch)) {
    window.location.search = serializeSearch(select(selectSearch));
  }
}
