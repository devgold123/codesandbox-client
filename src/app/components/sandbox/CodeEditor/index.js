// @flow
import React from 'react';
import CodeMirror from 'codemirror';
import styled from 'styled-components';
import { debounce } from 'lodash';

import { getCodeMirror } from 'app/utils/codemirror';
import prettify from 'app/utils/codemirror/prettify';

import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/tern/tern';

import type { Preferences } from 'common/types';

import Header from './Header';

const documentCache = {};

type Props = {
  code: ?string,
  error: ?Object,
  id: string,
  title: string,
  modulePath: string,
  changeCode: (id: string, code: string) => Object,
  saveCode: () => void,
  canSave: boolean,
  preferences: Preferences,
  onlyViewMode: boolean,
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const CodeContainer = styled.div`
  position: relative;
  overflow: auto;
`;

const handleError = (cm, currentError, nextError, nextCode, nextId) => {
  if (currentError || nextError) {
    if (currentError && nextError && currentError.line === nextError.line) {
      return;
    }

    if (currentError) {
      cm.getValue().split('\n').forEach((_, i) => {
        cm.removeLineClass(i, 'background', 'cm-line-error');
      });
    }

    const code = nextCode || '';
    if (
      nextError &&
      (nextError.moduleId == null || nextError.moduleId === nextId) &&
      nextError.line !== 0 &&
      nextError.line <= code.split('\n').length
    ) {
      cm.addLineClass(nextError.line - 1, 'background', 'cm-line-error');
    }
  }
};

export default class CodeEditor extends React.PureComponent {
  props: Props;

  constructor(props) {
    super(props);

    this.handleChange = debounce(this.handleChange, 200);
  }

  shouldComponentUpdate(nextProps: Props) {
    return nextProps.id !== this.props.id ||
      nextProps.error !== this.props.error ||
      this.props.canSave !== nextProps.canSave ||
      this.props.preferences !== nextProps.preferences;
  }

  swapDocuments = async (
    {
      currentId,
      nextId,
      nextCode,
      nextTitle,
    }: {
      currentId: string,
      nextId: string,
      nextCode: ?string,
      nextTitle: string,
    }
  ) => {
    if (nextId !== currentId) {
      if (!documentCache[nextId]) {
        const mode = await this.getMode(nextTitle);

        documentCache[nextId] = new CodeMirror.Doc(nextCode || '', mode);
      }
      documentCache[currentId] = this.codemirror.swapDoc(documentCache[nextId]);

      this.updateCodeMirrorCode(nextCode || '');
    }
  };

  componentWillReceiveProps(nextProps: Props) {
    const cm = this.codemirror;
    const { id: currentId, error: currentError } = this.props;
    const {
      id: nextId,
      code: nextCode,
      error: nextError,
      title: nextTitle,
    } = nextProps;

    if (cm) {
      this.swapDocuments({ currentId, nextId, nextCode, nextTitle });
      handleError(cm, currentError, nextError, nextCode, nextId);
    }
  }

  updateCodeMirrorCode(code: string = '') {
    const pos = this.codemirror.getCursor();
    this.codemirror.setValue(code);
    this.codemirror.setCursor(pos);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.codemirror) {
      if (this.props.preferences !== prevProps.preferences) {
        this.setCodeMirrorPreferences();
      }
    }
  }

  getMode = async (title: string) => {
    if (title == null) return 'jsx';

    const kind = title.match(/\.([^.]*)$/);

    if (kind) {
      if (kind[1] === 'css') {
        await System.import('codemirror/mode/css/css');
        return 'css';
      } else if (kind[1] === 'html') {
        await System.import('codemirror/mode/htmlmixed/htmlmixed');
        return 'htmlmixed';
      }
    }

    return 'jsx';
  };

  getCodeMirror = async (el: Element) => {
    const { code, id, title } = this.props;
    if (!this.props.onlyViewMode) {
      CodeMirror.commands.save = this.handleSaveCode;
    }
    const mode = await this.getMode(title);
    documentCache[id] = new CodeMirror.Doc(code || '', mode);

    this.codemirror = getCodeMirror(el, documentCache[id]);

    if (!this.props.onlyViewMode) {
      this.codemirror.on('change', this.handleChange);
      this.setCodeMirrorPreferences();
    } else {
      this.codemirror.setOption('readOnly', true);
    }
  };

  setCodeMirrorPreferences = async () => {
    const { preferences } = this.props;

    const defaultKeys = {
      Tab: cm => {
        const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
        cm.replaceSelection(spaces);
      },
      'Cmd-/': cm => {
        cm.listSelections().forEach(() => {
          cm.toggleComment({ lineComment: '//' });
        });
      },
    };

    const updateArgHints = cm => {
      if (this.server) {
        this.server.updateArgHints(cm);
      }
    };

    const showAutoComplete = cm => {
      if (this.server) {
        const filter = new RegExp('[\.a-z_$]', 'i');
        if (cm.display.input.textarea.value.slice(-1).match(filter)) {
          cm.showHint({ hint: this.server.getHint, completeSingle: false });
        }
      }
    };

    if (preferences.autoCompleteEnabled) {
      const tern = await System.import('tern');
      const defs = await System.import('tern/defs/ecmascript.json');
      window.tern = tern;
      this.server = this.server ||
        new CodeMirror.TernServer({
          defs: [defs],
        });
      this.codemirror.on('cursorActivity', updateArgHints);
      this.codemirror.on('inputRead', showAutoComplete);
      this.codemirror.setOption('extraKeys', {
        ...defaultKeys,
        'Ctrl-Space': cm => {
          if (this.server) this.server.complete(cm);
        },
        'Ctrl-I': cm => {
          if (this.server) this.server.showType(cm);
        },
        'Ctrl-O': cm => {
          if (this.server) this.server.showDocs(cm);
        },
        'Alt-.': cm => {
          if (this.server) this.server.jumpToDef(cm);
        },
        'Alt-,': cm => {
          if (this.server) this.server.jumpBack(cm);
        },
        'Ctrl-Q': cm => {
          if (this.server) this.server.rename(cm);
        },
        'Ctrl-.': cm => {
          if (this.server) this.server.selectName(cm);
        },
      });
    } else {
      this.server = null;
      this.codemirror.off('cursorActivity', updateArgHints);
      this.codemirror.off('inputRead', showAutoComplete);
    }

    if (preferences.vimMode) {
      await System.import('codemirror/keymap/vim');
      this.codemirror.setOption('keyMap', 'vim');
    } else {
      this.codemirror.setOption('keyMap', 'sublime');
    }

    if (preferences.lintEnabled) {
      System.import('app/utils/codemirror/eslint-lint')
        .then(initializer => {
          return initializer.default();
        })
        .then(() => {
          this.codemirror.setOption('lint', true);
        });
    } else {
      this.codemirror.setOption('lint', false);
    }
  };

  handleChange = (cm: any, change: any) => {
    if (change.origin !== 'setValue') {
      this.props.changeCode(this.props.id, cm.getValue());
    }
  };

  getCode = () => this.codemirror.getValue();

  prettify = async () => {
    const { id, title, preferences } = this.props;
    const code = this.getCode();
    const mode = await this.getMode(title);
    if (mode === 'jsx') {
      try {
        const newCode = await prettify(code, preferences.lintEnabled);

        if (newCode !== code) {
          this.props.changeCode(id, newCode);
          this.updateCodeMirrorCode(newCode);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  handleSaveCode = async () => {
    const { saveCode, preferences } = this.props;
    if (preferences.prettifyOnSaveEnabled) {
      await this.prettify();
    }
    const { id } = this.props;
    this.props.changeCode(id, this.getCode());
    saveCode();
  };

  codemirror: typeof CodeMirror;
  server: typeof CodeMirror.TernServer;

  render() {
    const { title, canSave, onlyViewMode, modulePath } = this.props;

    return (
      <Container>
        <Header
          saveComponent={canSave && !onlyViewMode && this.handleSaveCode}
          prettify={!onlyViewMode && this.prettify}
          title={title}
          path={modulePath}
        />
        <CodeContainer>
          <div style={{ height: '100%' }} ref={this.getCodeMirror} />
        </CodeContainer>
      </Container>
    );
  }
}
