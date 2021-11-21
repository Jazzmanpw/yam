import type { HandlerArg } from '../../..';
import type { State, YamContext } from '../store';
import { resultsReceived } from './actions';
import { getKeyword } from './state';

export default async function handlePictureFetching({
  state,
  stateChangedBy,
  context: { fetchPictures },
}: HandlerArg<State, YamContext>) {
  if (stateChangedBy(getKeyword)) {
    const result = await fetchPictures(getKeyword(state));
    return resultsReceived(result);
  }
}
