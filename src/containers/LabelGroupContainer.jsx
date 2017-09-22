import React from 'react';
import PropTypes from 'prop-types';
import LabelContainer from './LabelContainer';
import {connect} from 'react-redux';
import ReduxService from '../services/ReduxService';

export class LabelGroupContainer extends React.Component {

  static propTypes = {
    orbitalData: PropTypes.array.isRequired
  }
  
  getOrbitalLabels = (orbitals) => {
    return orbitals.map((orbital) => (
      <LabelContainer
        position={this.props.positions && this.props.positions[orbital.id]}
        text={orbital.name}
        id={orbital.id}
        key={orbital.id}>
        {orbital.satellites && this.getOrbitalLabels(orbital.satellites)}
      </LabelContainer>
    ));
  }

  render() {
    return <div>{this.getOrbitalLabels(this.props.orbitalData)}</div>;
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'uiControls.positions'
  ),
  null
)(LabelGroupContainer);
