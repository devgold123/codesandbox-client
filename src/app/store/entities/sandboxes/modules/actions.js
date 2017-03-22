// @flow

export const RENAME_MODULE = 'RENAME_MODULE';
export const MOVE_MODULE = 'MOVE_MODULE';
export const SET_CODE = 'SET_CODE';
export const SET_MODULE_ERROR = 'SET_MODULE_ERROR';
export const SET_MODULE_SYNCED = 'SET_MODULE_SYNCED';

export default {
  renameModule: (id: string, title: string) => ({
    type: RENAME_MODULE,
    id,
    title,
  }),
  moveModule: (id: string, directoryShortid: string) => ({
    type: MOVE_MODULE,
    id,
    directoryShortid,
  }),
  setCode: (id: string, code: string) => ({
    type: SET_CODE,
    id,
    code,
    isNotSynced: true,
  }),
  setModuleSynced: (id: string) => ({
    type: SET_MODULE_SYNCED,
    id,
  }),
  setError: (id: string, error: Object) => ({
    type: SET_MODULE_ERROR,
    id,
    error,
  }),
};
