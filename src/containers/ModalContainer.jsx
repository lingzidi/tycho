import React from 'react';
import {connect} from 'react-redux';
import ReactAnimationFrame from 'react-animation-frame';
import * as Actions from '../actions/UIControlsActions';
import ReduxService from '../services/ReduxService';
import OrbitalService from '../services/OrbitalService';
import Physics from '../services/Physics';
import Modal from '../components/Modal';

export class ModalContainer extends React.Component {

  componentWillMount = () => {
    this.state = {};
  }

  componentWillReceiveProps = (nextProps) => {
    const {targetName} = nextProps;

    if (this.props.targetName !== targetName) {
      this.updateTargetParams(targetName);
    }
  }

  /**
   * Update state with active target information
   * 
   * @param {String} targetName - name of active target
   */
  updateTargetParams = (targetName) => {
    const {
      name,
      description,
      GM,
      semimajor
    } = OrbitalService.getTargetByName(this.props.orbitalData, targetName);
    
    this.setState({name, description, GM, semimajor});
  }

  /**
   * Updates orbital information.
   *
   * @param {String} targetName - name of active target
   */
  updateOrbitalStats = (targetName) => {
    const {GM, semimajor} = this.state;
    const magnitude = OrbitalService.getDistanceToSun(this.props.positions, targetName);
    const velocity = Physics.orbitalEnergyConservation(GM, magnitude, semimajor);

    this.setState({magnitude, velocity});
  }

  /**
   * Closes the modal.
   */
  closeModal = () => {
    this.props.action.toggleModal(false);
    this.props.action.setUIControls(true);
  }

  onAnimationFrame = () => {
    this.updateOrbitalStats(this.state.targetName);
  }

  render() {
    return (
      <Modal
        modalActive={this.props.modalActive}
        description="Hello, *world*!"
        velocity={this.state.velocity}
        magnitude={this.state.magnitude}
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
    'label.targetName',
    'data.orbitalData',
    'data.pageText',
    'animation.positions'
  ),
  ReduxService.mapDispatchToProps(Actions)
)(AnimatedModal);

