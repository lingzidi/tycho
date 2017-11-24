import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import ReactAnimationFrame from 'react-animation-frame';
import * as Actions from '../actions/UIControlsActions';
import ReduxService from '../services/ReduxService';
import OrbitalService from '../services/OrbitalService';
import Physics from '../services/Physics';
import Modal from '../components/Modal';
import Constants from '../constants';

export class ModalContainer extends React.Component {

  componentWillMount = () => {
    this.state = {};
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
    const {centralMass, semimajor} = this.state;

    const distance = OrbitalService.getDistanceToSun(positions, targetId);
    const energy = Physics.orbitalEnergyConservation(centralMass, distance, semimajor);

    const magnitude = this.formatNumber(distance);
    const velocity = this.formatNumber(energy);

    this.setState({magnitude, velocity});
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

  /**
   * Closes the modal.
   */
  closeModal = () => {
    this.props.action.toggleModal(false);
    this.props.action.setUIControls(true);
  }

  onAnimationFrame = () => {
    this.updateOrbitalStats();
  }

  render() {
    return (
      <Modal
        modalActive={this.props.modalActive}
        description="Hello, *world*!"
        velocity={this.state.velocity}
        magnitude={this.state.magnitude}
        time={this.getTime()}
        title={this.state.name}
        closeModal={this.closeModal}
      />
    );
  }
}

const AnimatedModal = ReactAnimationFrame(ModalContainer);

export default connect(
  ReduxService.mapStateToProps(
    'uiControls.modalActive',
    'label.targetId',
    'data.orbitalData',
    'data.pageText',
    'animation.time',
    'animation.positions'
  ),
  ReduxService.mapDispatchToProps(Actions)
)(AnimatedModal);
