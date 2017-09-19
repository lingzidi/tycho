import React from 'react';
import SpinLabelContainer from '../../containers/SpinLabelContainer';
import PropTypes from 'prop-types';

export default class Tour extends React.Component {

  static propTypes = {
    modifier: PropTypes.string,
    labels: PropTypes.array,
    skipTour: PropTypes.func
  }

  render() {
    const {modifier, labels} = this.props;
    return (
      <div>
        <div className={`tour tour--${modifier}`}>
          <div
            className={`tour__theater-bar tour__theater-bar--${modifier}`}
            style={{top: 0}}>
          </div>
          <div className="tour__labels">
						{labels}
					</div>
          <div
            className={`tour__theater-bar tour__theater-bar--${modifier}`}
            style={{bottom: 0}}>
            <span
              className="tour__skip-link"
              onClick={this.props.skipTour}>
              Skip Tour
            </span>
          </div>
				</div>
        <SpinLabelContainer />
      </div>
    );
  }
}
