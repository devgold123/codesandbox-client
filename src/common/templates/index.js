import { decorateSelector } from '../theme';

export const react = {
  name: 'create-react-app',
  url: 'https://github.com/facebookincubator/create-react-app',
  color: decorateSelector(() => '#6CAEDD'),
};

export const vue = {
  name: 'vue-cli',
  url: 'https://github.com/vuejs/vue-cli',
  color: decorateSelector(() => '#41B883'),
};

export default function getDefinition(theme: 'create-react-app' | 'vue-cli') {
  if (!theme) {
    return react;
  }

  if (theme === react.name) {
    return react;
  } else if (theme === vue.name) {
    return vue;
  }

  return react;
}
