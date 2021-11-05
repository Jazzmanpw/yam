import { HandlerArg } from '../../../src/types';
import { resultReceived } from '../results/actions';
import { getSearch } from './state';
import { State } from '../store';
import { fetchSearchResults } from '../utils';

export default async function handleSearch({
  state,
  stateChangedBy,
}: HandlerArg<State>) {
  if (stateChangedBy(getSearch)) {
    const result = await fetchSearchResults(getSearch(state));
    return resultReceived(result);
  }
}
