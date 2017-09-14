import React from 'react';

export default class TourLabelContainer extends React.Component {

  componentWillMount = () => {
    const {start, end} = this.props;
    const className = 'tour-label__text';

    this.setState({className});
    this.setClassAsync('show', start);
    this.setClassAsync('hide', end);
  }

  /**
   * Updates the local state class name with the given modifier at the given delay.
   *
   * @param {String} modifier - BEM CSS class modifier
   * @param {Number} timeout - delay, in milliseconds
   */
  setClassAsync = (modifier, timeout) => {
    const base = 'tour-label__text';
    const className = `${base} ${base}--${modifier}`;
    
    setTimeout(() => {
      this.setState({className});
    }, timeout);
  }
  
  render() {
    return (
      <div className="tour-label">
        <span className={this.state.className}>
          {this.props.text}
        </span>
      </div>
    );
  }
}
