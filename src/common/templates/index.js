import { decorateSelector } from '../theme';

export const react = {
  name: 'create-react-app',
  url: 'https://github.com/facebookincubator/create-react-app',
  color: decorateSelector(() => '#6CAEDD'),
};

export const reactTs = {
  name: 'create-react-app-typescript',
  url: 'https://github.com/wmonk/create-react-app-typescript',
  color: decorateSelector(() => '#009fff'),

  sourceConfig: {
    typescript: true,
    entry: 'index.tsx',
  },
};

export const vue = {
  name: 'vue-cli',
  url: 'https://github.com/vuejs/vue-cli',
  color: decorateSelector(() => '#41B883'),
};

export const svelte = {
  name: 'svelte',
  url: 'https://github.com/sveltejs/svelte',
  color: decorateSelector(() => '#AA1E1E'),
};

export const preact = {
  name: 'preact-cli',
  url: 'https://github.com/developit/preact-cli',
  color: decorateSelector(() => '#AD78DC'),
};

export default function getDefinition(
  theme:
    | 'create-react-app'
    | 'vue-cli'
    | 'preact-cli'
    | 'create-react-app-typescript'
) {
  if (!theme) {
    return react;
  }

  switch (theme) {
    case react.name:
      return react;
    case vue.name:
      return vue;
    case preact.name:
      return preact;
    case reactTs.name:
      return reactTs;
    case svelte.name:
      return svelte;
    default:
      return react;
  }
}
