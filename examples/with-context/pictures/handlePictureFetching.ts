import type { HandlerArg } from '../../..';
import type { State, YamContext } from '../store';
import { resultsReceived } from './actions';
import { selectKeyword } from './state';

export default async function handlePictureFetching({
  select,
  stateChangedBy,
  context: { fetchPictures },
}: HandlerArg<State, YamContext>) {
  if (stateChangedBy(selectKeyword)) {
    const result = await fetchPictures(select(selectKeyword));
    return resultsReceived(result);
  }
}
