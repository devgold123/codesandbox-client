import React from 'react';
import ReactShow from 'react-show';

import {
  ChildContainer,
  ItemHeader,
  Title,
  ExpandIconContainer,
  Actions,
} from './elements';

export default class WorkspaceItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: !!props.defaultOpen,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.open !== this.state.open ||
      nextProps.disabled !== this.props.disabled ||
      this.props.children !== nextProps.children
    );
  }

  toggleOpen = () => this.setState({ open: !this.state.open });

  render() {
    const { children, title, keepState, disabled, actions } = this.props;
    const { open } = this.state;

    return (
      <div>
        <ItemHeader onClick={this.toggleOpen}>
          <ExpandIconContainer open={open} />
          <Title>{title}</Title>

          {open && <Actions>{actions}</Actions>}
        </ItemHeader>
        <ReactShow show={open} duration={250} unmountOnHide={!keepState}>
          <ChildContainer disabled={disabled}>{children}</ChildContainer>
        </ReactShow>
      </div>
    );
  }
}
