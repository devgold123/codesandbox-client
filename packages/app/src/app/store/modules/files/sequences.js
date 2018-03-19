import { push, set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import { ensureOwnedSandbox } from '../../sequences';
import { setCurrentModule, addNotification } from '../../factories';
import { closeTabByIndex } from '../../actions';
import {
  sendModuleCreated,
  sendModuleDeleted,
  sendModuleUpdated,
  sendDirectoryCreated,
  sendDirectoryDeleted,
  sendDirectoryUpdated,
} from '../live/actions';
import * as actions from './actions';

export const createModule = [
  ensureOwnedSandbox,
  actions.createOptimisticModule,
  push(
    state`editor.sandboxes.${state`editor.currentId`}.modules`,
    props`optimisticModule`
  ),
  actions.setDefaultNewCode,
  actions.saveNewModule,
  {
    success: [
      actions.updateOptimisticModule,
      setCurrentModule(props`newModule.id`),
      set(props`moduleShortid`, props`newModule.shortid`),
      sendModuleCreated,
    ],
    error: [
      actions.removeOptimisticModule,
      setCurrentModule(state`editor.mainModule.shortid.id`),
      addNotification('Unable to save new file', 'error'),
    ],
  },
];

export const renameModule = [
  ensureOwnedSandbox,
  actions.renameModule,
  actions.saveNewModuleName,
  {
    success: [sendModuleUpdated],
    error: [
      actions.revertModuleName,
      addNotification('Could not rename file', 'error'),
    ],
  },
];

export const renameDirectory = [
  ensureOwnedSandbox,
  actions.renameDirectory,
  actions.saveNewDirectoryName,
  {
    success: [sendDirectoryUpdated],
    error: [
      actions.revertDirectoryName,
      addNotification('Could not rename file', 'error'),
    ],
  },
];

export const createDirectory = [
  ensureOwnedSandbox,
  actions.createOptimisticDirectory,
  push(
    state`editor.sandboxes.${state`editor.currentId`}.directories`,
    props`optimisticDirectory`
  ),
  actions.saveDirectory,
  {
    success: [
      actions.updateOptimisticDirectory,
      set(props`directoryShortid`, props`newDirectory.shortid`),
      sendDirectoryCreated,
    ],
    error: [
      actions.removeOptimisticDirectory,
      addNotification('Unable to save new directory', 'error'),
    ],
  },
];

export const removeDirectory = [
  set(state`editor.currentModuleShortid`, state`editor.mainModule.shortid`),
  actions.removeDirectory,
];

export const deleteDirectory = [
  ensureOwnedSandbox,
  removeDirectory,
  actions.deleteDirectory,
  {
    success: [sendDirectoryDeleted],
    error: [
      push(
        state`editor.sandboxes.${state`editor.currentId`}.directories`,
        props`removedDirectory`
      ),
      addNotification('Could not delete directory', 'error'),
    ],
  },
];

export const moveDirectoryToDirectory = [
  ensureOwnedSandbox,
  actions.moveDirectoryToDirectory,
  actions.saveNewDirectoryDirectoryShortid,
  {
    success: [
      set(props`directoryShortid`, props`shortid`),
      sendDirectoryUpdated,
    ],
    error: [
      actions.revertMoveDirectoryToDirectory,
      addNotification('Could not save new directory location', 'error'),
    ],
  },
];

export const moveModuleToDirectory = [
  ensureOwnedSandbox,
  actions.moveModuleToDirectory,
  actions.saveNewModuleDirectoryShortid,
  {
    success: [sendModuleUpdated],
    error: [
      actions.revertMoveModuleToDirectory,
      addNotification('Could not save new module location', 'error'),
    ],
  },
];

export const removeModule = [
  ensureOwnedSandbox,
  actions.whenModuleIsSelected,
  {
    true: setCurrentModule(state`editor.mainModule.id`),
    false: [],
  },
  actions.whenCloseTab,
  {
    true: closeTabByIndex,
    false: [],
  },
  actions.removeModule,
];

export const deleteModule = [
  removeModule,
  actions.deleteModule,
  {
    success: [sendModuleDeleted],
    error: [
      push(
        state`editor.sandboxes.${state`editor.currentId`}.modules`,
        props`removedModule`
      ),
      addNotification('Could not delete file', 'error'),
    ],
  },
];
