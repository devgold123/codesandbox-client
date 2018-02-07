import * as React from 'react';
import { inject, observer } from 'mobx-react';

import Navigation from 'app/pages/common/Navigation';

import Prompt from './Prompt';
import { Container } from './elements';

class CLI extends React.Component {
  componentDidMount() {
    if (this.props.store.user.jwt) {
      this.props.signals.requestAuthorisation();
    }
  }

  render() {
    const { user, authToken, isLoadingCLI, error } = this.props.store;

    return (
      <Container>
        <Navigation title="CLI Authorization" />
        <Prompt
          error={error}
          token={authToken}
          loading={isLoadingCLI}
          username={user && user.username}
          signIn={this.props.signals.sigin}
        />
      </Container>
    );
  }
}

export default inject('store', 'signals')(observer(CLI));
