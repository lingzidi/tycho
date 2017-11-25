import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import ReduxService from '../services/ReduxService';
import OrbitalService from '../services/OrbitalService';
import Physics from '../services/Physics';
import Constants from '../constants';
import Stats from '../components/Stats';

export class StatsContainer extends React.Component {

  componentWillMount = () => {
    this.setState({});
  }

  componentWillReceiveProps = (nextProps) => {
    const {targetId} = nextProps;

    if (this.props.targetId !== targetId) {
      this.updateTargetParams(targetId);
    }
  }

  /**
   * Update state with active target information
   * 
   * @param {String} targetId - name of active target
   */
  updateTargetParams = (targetId) => {
    this.setState({
      ...OrbitalService.getTargetByName(this.props.orbitalData, targetId)
    });
  }

  /**
   * Updates orbital information.
   */
  updateOrbitalStats = () => {
    const {targetId, positions} = this.props;
    const {centralMass, semimajor, description} = this.state;

    const distance = OrbitalService.getDistanceToSun(positions, targetId);
    const energy = Physics.orbitalEnergyConservation(centralMass, distance, semimajor);

    const magnitude = this.formatNumber(distance);
    const velocity = this.formatNumber(energy);

    this.setState({magnitude, velocity, description});
  }

  /**
   * Returns the given number to the thousands place and commas.
   *
   * @param {Number} x - number to format
   * @returns {String} formatted number
   */
  formatNumber = (x) => {
     return x
      .toFixed(3)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  /**
   * Returns the current UNIX time prop in UI-friendly format.
   *
   * @returns {String} UI-friendly time
   */
  getTime = () => {
    return moment(this.props.time * 1000)
      .format(Constants.UI.UX_DATE_FORMAT);
  }


    render() {
        return (
            <Stats
                description={this.state.description}
                velocity={this.state.velocity}
                magnitude={this.state.magnitude}
                pageText={this.props.pageText}
                time={this.getTime()}
            />
        );
    }
}

export default connect(
  ReduxService.mapStateToProps(
    'label.targetId',
    'data.orbitalData',
    'data.pageText',
    'animation.time'
  ),
  null
)(StatsContainer);