import React from 'react';
import TourLabel from '../components/TourLabel';

export default class TourLabelContainer extends React.Component {

  componentWillMount = () => {
    const {start, end} = this.props;

    this.setState({modifier: 'hide'});
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
    setTimeout(() => {
      this.setState({modifier});
    }, timeout);
  }
  
  render() {
    return (
      <TourLabel
        modifier={this.state.modifier}
        text={this.props.text}
      />
    );
  }
}
