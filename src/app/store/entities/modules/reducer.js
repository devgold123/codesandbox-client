// @flow
import { omitBy } from 'lodash';
import type { Module } from './';

import findType from '../../../utils/find-type';

import {
  CHANGE_CODE,
  SET_ERROR,
  SAVE_CODE,
} from './actions';
import { DELETE_ALL_MODULES_IN_DIRECTORY } from '../directories/actions';

type State = {
  [id: string]: Module;
};

const initialState: State = {};

const moduleReducer = (state: Module, action: Object): ?Module => {
  switch (action.type) {
    case CHANGE_CODE:
      if (action.code === state.code) return state;
      return {
        ...state,
        code: action.code,
        type: findType(action.code),
        isNotSynced: true,
      };
    case SAVE_CODE:
      return {
        ...state,
        isNotSynced: false,
      };
    case SET_ERROR: {
      return {
        ...state,
        error: action.error,
      };
    }
    default:
      return state;
  }
};

export default (state: State = initialState, action: Object): State => {
  switch (action.type) {
    case CHANGE_CODE:
    case SAVE_CODE:
    case SET_ERROR:
      return {
        ...state,
        [action.id]: moduleReducer(state[action.id], action),
      };
    case DELETE_ALL_MODULES_IN_DIRECTORY:
      return omitBy(state, m => m.directoryId === action.id);
    default:
      return state;
  }
};
