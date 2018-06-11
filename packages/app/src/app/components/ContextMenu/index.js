import * as React from 'react';
import { spring, Motion } from 'react-motion';

import Portal from '../Portal';
import { Container, Item } from './elements';

class ContextMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      show: false,
    };
    this.mousedownCb = mousedownEvent => {
      const { show } = this.state;

      if (show && this.el) {
        if (!this.el.contains(mousedownEvent.target)) {
          this.close();
        }
      }
    };
    this.keydownCb = keydownEvent => {
      const { show } = this.state;
      if (keydownEvent.keyCode === 27 && show) {
        // Escape
        this.close();
      }
    };
  }
  onContextMenu = event => {
    event.preventDefault();
    window.addEventListener('mousedown', this.mousedownCb);
    window.addEventListener('keydown', this.keydownCb);

    this.setState({
      show: true,
      x: event.clientX + 10,
      y: event.clientY + 10,
    });
  };

  close = () => {
    window.removeEventListener('keydown', this.keydownCb);
    window.removeEventListener('mousedown', this.mousedownCb);
    this.setState({
      show: false,
    });
  };

  render() {
    const { children, items } = this.props;
    const { show, x, y } = this.state;

    return (
      <div onContextMenu={this.onContextMenu}>
        {children}
        {show && (
          <Portal>
            <div
              ref={el => {
                this.el = el;
              }}
            >
              <Motion
                defaultStyle={{ opacity: 0.6 }}
                style={{ opacity: spring(1) }}
              >
                {({ opacity }) => (
                  <Container
                    style={{
                      left: x,
                      top: y,
                      opacity,
                    }}
                  >
                    <div>
                      {items.map(item => (
                        <Item
                          key={item.title}
                          color={item.color}
                          onClick={() => item.action() && this.close()}
                        >
                          {item.icon && <item.icon />}
                          {item.title}
                        </Item>
                      ))}
                    </div>
                  </Container>
                )}
              </Motion>
            </div>
          </Portal>
        )}
      </div>
    );
  }
}

export default ContextMenu;
