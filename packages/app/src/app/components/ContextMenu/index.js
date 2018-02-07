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
  }
  onContextMenu = event => {
    event.preventDefault();
    this.mousedown = window.addEventListener('mousedown', mousedownEvent => {
      const { show } = this.state;

      if (show) {
        if (!this.el.contains(mousedownEvent.target)) {
          this.close();
        }
      }
    });

    this.keydown = window.addEventListener('keydown', keydownEvent => {
      const { show } = this.state;
      if (keydownEvent.keyCode === 27 && show) {
        // Escape
        this.close();
      }
    });

    this.setState({
      show: true,
      x: event.clientX + 10,
      y: event.clientY + 10,
    });
  };

  close = () => {
    window.removeEventListener('keydown', this.keydown);
    window.removeEventListener('mousedown', this.mousedown);
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
        <Portal>
          <div
            ref={el => {
              this.el = el;
            }}
          >
            {show && (
              <Motion
                defaultStyle={{ size: 0.75, opacity: 0.6 }}
                style={{
                  size: spring(1, { stiffness: 200, damping: 26 }),
                  opacity: spring(1),
                }}
              >
                {({ size, opacity }) => (
                  <Container
                    style={{
                      left: x,
                      top: y,
                      transform: `scale(${size}, ${size})`,
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
            )}
          </div>
        </Portal>
      </div>
    );
  }
}

export default ContextMenu;
