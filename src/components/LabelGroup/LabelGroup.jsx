import React from 'react';
import PropTypes from 'prop-types';
import LabelContainer from '../../containers/LabelContainer';

class LabelGroup extends React.Component {

  static propTypes = {
    positions: PropTypes.object.isRequired,
    orbitalData: PropTypes.array.isRequired
  }
  
  getOrbitalLabels = (orbitals) => {
    return orbitals.map((orbital) => (
      <LabelContainer
        position={this.props.positions[orbital.id]}
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

export default LabelGroup;
