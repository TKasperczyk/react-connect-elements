import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from './portal';
import { connectElements } from './utils';

export default class ReactConnectElements extends PureComponent {
  static propTypes = {
    elements: PropTypes.array.isRequired,
    overlay: PropTypes.number,
    selector: PropTypes.string.isRequired,
    strokeWidth: PropTypes.number,
    color: PropTypes.string,
  };

  static defaultProps = {
    overlay: 0,
    strokeWidth: 5,
    color: '#666',
  };

  state = {
    querySelector: 'body',
  };

  componentDidMount() {
    this.checkSelector();
  }

  componentDidUpdate() {
    this.connectAll();
  }

  checkSelector = () => {
    if (document.querySelector(this.props.selector)) {
      this.setState({ querySelector: this.props.selector }, () =>
        this.connectAll()
      );
    }
  };

  connectAll = () => {
    const { elements } = this.props;

    elements.map((element, index) => {
      const start = document.querySelector(element.from);
      const end = document.querySelector(element.to);
      const path = document.querySelector(`#path${index + 1}`);

      return connectElements(
        this.svgContainer,
        this.svg,
        path,
        start,
        end,
        element.color
      );
    });
  };

  render() {
    const { elements, overlay, strokeWidth, color } = this.props;

    return (
      this.state.querySelector && (
        <Portal query={this.state.querySelector}>
          <div
            id="react-connect-elements-container"
            style={{ zIndex: overlay, position: 'absolute', height: '100%' }}
            ref={svg => {
              this.svgContainer = svg;
            }}
          >
            <svg
              width="0"
              height="0"
              ref={svg => {
                this.svg = svg;
              }}
            >
              {elements.map((element, index) => {
                const baseId = `${element.from}-${element.to}`;
                const gradientId = `gradient-${baseId}`;
                let strokeColor = element.color || color;
                if (element.gradientColor1 && element.gradientColor2) {
                  strokeColor = `url(#${gradientId})`;
                }
                return (
                  <React.Fragment>
                    <defs>
                      <linearGradient
                        id={gradientId}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor={element.gradientColor1} />
                        <stop offset="35%" stopColor={element.gradientColor1} />
                        <stop offset="45%" stopColor={element.gradientColor2} />
                        <stop
                          offset="100%"
                          stopColor={element.gradientColor2}
                        />
                      </linearGradient>
                    </defs>
                    <path
                      key={baseId}
                      id={`path${index + 1}`}
                      d="M0 0"
                      stroke={strokeColor}
                      fill="none"
                      strokeWidth={`${strokeWidth}px`}
                    />
                  </React.Fragment>
                );
              })}
            </svg>
          </div>
        </Portal>
      )
    );
  }
}
