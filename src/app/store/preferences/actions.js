import store from 'store/dist/store.modern';

import {
  VIM_MODE,
  AUTO_COMPLETE,
  LIVE_PREVIEW,
  PRETTIFY_ON_SAVE,
  LINT_ENABLED,
  INSTANT_PREVIEW,
  FONT_SIZE,
  FONT_FAMILY,
  CLEAR_CONSOLE,
} from './keys';

export const SET_PREFERENCE_AUTOCOMPLETE = 'SET_PREFERENCE_AUTOCOMPLETE';
export const SET_PREFERENCE_VIM_MODE = 'SET_PREFERENCE_VIM_MODE';
export const SET_PREFERENCE_FONT_SIZE = 'SET_PREFERENCE_FONT_SIZE';
export const SET_PREFERENCE_FONT_FAMILY = 'SET_PREFERENCE_FONT_FAMILY';
export const SET_PREFERENCE_LIVE_PREVIEW = 'SET_PREFERENCE_LIVE_PREVIEW';
export const SET_PREFERENCE_PRETTIFY_ON_SAVE =
  'SET_PREFERENCE_PRETTIFY_ON_SAVE';
export const SET_PREFERENCE_LINT = 'SET_PREFERENCE_LINT';
export const SET_INSTANT_PREVIEW = 'SET_INSTANT_PREVIEW';
export const SET_CLEAR_CONSOLE = 'SET_CLEAR_CONSOLE';

const setOption = (key, val) => {
  try {
    store.set(key, val);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default {
  setVimPreference: (vimMode: boolean) => (dispatch: Function) => {
    setOption(VIM_MODE, vimMode);

    dispatch({
      type: SET_PREFERENCE_VIM_MODE,
      option: vimMode,
    });
  },

  setAutoCompletePreference: (autoComplete: boolean) => (
    dispatch: Function,
  ) => {
    setOption(AUTO_COMPLETE, autoComplete);

    dispatch({
      type: SET_PREFERENCE_AUTOCOMPLETE,
      option: autoComplete,
    });
  },

  setLivePreview: (livePreview: boolean) => (dispatch: Function) => {
    setOption(LIVE_PREVIEW, livePreview);

    dispatch({
      type: SET_PREFERENCE_LIVE_PREVIEW,
      option: livePreview,
    });
  },

  setPrettifyOnSavePreference: (prettify: boolean) => (dispatch: Function) => {
    setOption(PRETTIFY_ON_SAVE, prettify);

    dispatch({
      type: SET_PREFERENCE_PRETTIFY_ON_SAVE,
      option: prettify,
    });
  },

  setClearConsolePreference: (clearConsole: boolean) => (
    dispatch: Function,
  ) => {
    setOption(CLEAR_CONSOLE, clearConsole);

    dispatch({
      type: SET_CLEAR_CONSOLE,
      option: clearConsole,
    });
  },

  setLintPreference: (lint: boolean) => (dispatch: Function) => {
    setOption(LINT_ENABLED, lint);

    dispatch({
      type: SET_PREFERENCE_LINT,
      option: lint,
    });
  },

  setInstantPreview: (instantPreview: boolean) => (dispatch: Function) => {
    setOption(INSTANT_PREVIEW, instantPreview);

    dispatch({
      type: SET_INSTANT_PREVIEW,
      option: instantPreview,
    });
  },

  setFontSizePreference: (fontSize: number) => (dispatch: Function) => {
    setOption(FONT_SIZE, fontSize);

    dispatch({
      type: SET_PREFERENCE_FONT_SIZE,
      option: fontSize,
    });
  },

  setFontFamilyPreference: (fontFamily: string) => (dispatch: Function) => {
    setOption(FONT_FAMILY, fontFamily);

    dispatch({
      type: SET_PREFERENCE_FONT_FAMILY,
      option: fontFamily,
    });
  },
};
