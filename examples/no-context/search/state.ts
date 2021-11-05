import { combineReducers } from 'redux';
import { State } from '../store';
import filters from './filters/state';
import keyword from './keyword/state';

export default combineReducers({ filters, keyword });

export const getSearch = (state: State) => state.search;
