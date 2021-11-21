import { HandlerArg } from '../../..';
import { resultReceived } from '../results/actions';
import { selectSearch } from './state';
import { State } from '../store';
import { fetchSearchResults } from '../utils';

export default async function handleSearch({
  select,
  stateChangedBy,
}: HandlerArg<State>) {
  if (stateChangedBy(selectSearch)) {
    const result = await fetchSearchResults(select(selectSearch));
    return resultReceived(result);
  }
}
